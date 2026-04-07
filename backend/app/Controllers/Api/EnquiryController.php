<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\AdmissionModel;
use App\Models\EnquiryModel;
use App\Models\StudentModel;
use CodeIgniter\HTTP\ResponseInterface;

class EnquiryController extends BaseController
{
    public function summary(?int $instituteId = null): ResponseInterface
    {
        $db = db_connect();
        $builder = $db->table('enquiries');

        if ($instituteId !== null) {
            $builder->where('institute_id', $instituteId);
        }

        $enquiries = $builder->get()->getResultArray();
        $total = count($enquiries);
        $converted = count(array_filter($enquiries, static fn (array $row): bool => ($row['status'] ?? '') === 'converted'));
        $newCount = count(array_filter($enquiries, static fn (array $row): bool => in_array(($row['status'] ?? ''), ['new', 'contacted'], true)));
        $followUp = count(array_filter($enquiries, static fn (array $row): bool => ($row['status'] ?? '') === 'follow-up'));

        return $this->response->setJSON([
            'total' => $total,
            'converted' => $converted,
            'new' => $newCount,
            'followUp' => $followUp,
            'conversionRate' => $total > 0 ? round(($converted / $total) * 100, 1) : 0,
        ]);
    }

    public function index(?int $instituteId = null): ResponseInterface
    {
        $model = new EnquiryModel();
        $builder = $model->orderBy('id', 'DESC');

        if ($instituteId !== null) {
            $builder->where('institute_id', $instituteId);
        }

        return $this->response->setJSON([
            'enquiries' => $builder->findAll(),
        ]);
    }

    public function recentAdmissions(?int $instituteId = null): ResponseInterface
    {
        $builder = db_connect()->table('admissions a')
            ->select("a.id, a.admission_number, a.status, a.admitted_on, a.remarks, COALESCE(CONCAT(s.first_name, ' ', s.last_name), e.student_name) AS student_name, s.gr_number, e.desired_course, i.name AS institute_name")
            ->join('enquiries e', 'e.id = a.enquiry_id', 'left')
            ->join('students s', 's.id = a.student_id', 'left')
            ->join('institutes i', 'i.id = a.institute_id', 'left')
            ->orderBy('a.id', 'DESC');

        if ($instituteId !== null) {
            $builder->where('a.institute_id', $instituteId);
        }

        return $this->response->setJSON([
            'admissions' => $builder->get()->getResultArray(),
        ]);
    }

    public function convert(int $id): ResponseInterface
    {
        $enquiryModel = new EnquiryModel();
        $admissionModel = new AdmissionModel();

        $enquiry = $enquiryModel->find($id);

        if (! is_array($enquiry)) {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'Enquiry not found.']);
        }

        $existingAdmission = $admissionModel->where('enquiry_id', $id)->first();

        if (! is_array($existingAdmission)) {
            $admissionNumber = 'ADM-' . date('Y') . '-' . str_pad((string) ($id), 4, '0', STR_PAD_LEFT);

            $admissionModel->insert([
                'enquiry_id' => $id,
                'student_id' => null,
                'institute_id' => $enquiry['institute_id'],
                'academic_year_id' => $enquiry['academic_year_id'],
                'admission_number' => $admissionNumber,
                'status' => 'confirmed',
                'admitted_on' => date('Y-m-d'),
                'remarks' => 'Converted from enquiry via admissions dashboard.',
            ]);
        }

        $enquiryModel->update($id, ['status' => 'converted']);

        return $this->response->setJSON([
            'message' => 'Enquiry converted to admission successfully.',
            'enquiry' => $enquiryModel->find($id),
        ]);
    }

    public function admitStudent(): ResponseInterface
    {
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $enquiryId = (int) ($payload['enquiry_id'] ?? 0);
        $firstName = trim((string) ($payload['first_name'] ?? ''));
        $lastName = trim((string) ($payload['last_name'] ?? ''));

        if ($enquiryId <= 0 || $firstName === '' || $lastName === '') {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'Enquiry, first name, and last name are required.',
            ]);
        }

        $enquiryModel = new EnquiryModel();
        $studentModel = new StudentModel();
        $admissionModel = new AdmissionModel();

        $enquiry = $enquiryModel->find($enquiryId);

        if (! is_array($enquiry)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Enquiry not found.',
            ]);
        }

        $db = db_connect();
        $grNumber = $this->generateGrNumber((int) $enquiry['institute_id'], (int) $enquiry['academic_year_id']);

        $db->transStart();

        $studentId = $studentModel->insert([
            'institute_id' => $enquiry['institute_id'],
            'academic_year_id' => $enquiry['academic_year_id'],
            'gr_number' => $grNumber,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'guardian_name' => trim((string) ($payload['guardian_name'] ?? '')),
            'gender' => trim((string) ($payload['gender'] ?? '')),
            'category' => trim((string) ($payload['category'] ?? $enquiry['category'] ?? '')),
            'current_class' => trim((string) ($payload['current_class'] ?? $enquiry['desired_course'] ?? '')),
            'division' => trim((string) ($payload['division'] ?? 'A')),
            'mobile_number' => trim((string) ($payload['mobile_number'] ?? $enquiry['mobile_number'] ?? '')),
            'email' => trim((string) ($payload['email'] ?? $enquiry['email'] ?? '')),
            'dob' => (($payload['dob'] ?? '') !== '') ? (string) $payload['dob'] : null,
            'address' => trim((string) ($payload['address'] ?? '')),
            'status' => 'active',
            'admission_status' => 'confirmed',
        ], true);

        $existingAdmission = $admissionModel->where('enquiry_id', $enquiryId)->first();
        $admissionNumber = $existingAdmission['admission_number'] ?? $this->generateAdmissionNumber();

        $admissionPayload = [
            'enquiry_id' => $enquiryId,
            'student_id' => (int) $studentId,
            'institute_id' => $enquiry['institute_id'],
            'academic_year_id' => $enquiry['academic_year_id'],
            'admission_number' => $admissionNumber,
            'status' => 'confirmed',
            'admitted_on' => date('Y-m-d'),
            'remarks' => trim((string) ($payload['remarks'] ?? 'Admission wizard completed.')),
        ];

        if (is_array($existingAdmission)) {
            $admissionModel->update((int) $existingAdmission['id'], $admissionPayload);
            $admissionRecord = $admissionModel->find((int) $existingAdmission['id']);
        } else {
            $admissionId = $admissionModel->insert($admissionPayload, true);
            $admissionRecord = $admissionModel->find((int) $admissionId);
        }

        $updatedNotes = trim(($enquiry['notes'] ?? '') . PHP_EOL . 'Admission wizard completed on ' . date('Y-m-d'));
        $enquiryModel->update($enquiryId, [
            'status' => 'converted',
            'notes' => $updatedNotes,
        ]);

        $db->transComplete();

        if (! $db->transStatus()) {
            return $this->response->setStatusCode(500)->setJSON([
                'message' => 'Unable to complete the admission wizard right now.',
            ]);
        }

        return $this->response->setStatusCode(201)->setJSON([
            'message' => 'Student master and admission record created successfully.',
            'student' => $studentModel->find((int) $studentId),
            'admission' => $admissionRecord,
        ]);
    }

    private function generateGrNumber(int $instituteId, int $academicYearId): string
    {
        $db = db_connect();
        $instituteCode = $db->table('institutes')->select('code')->where('id', $instituteId)->get()->getRowArray()['code'] ?? 'STU';
        $academicYear = $db->table('academic_years')->select('label')->where('id', $academicYearId)->get()->getRowArray()['label'] ?? date('Y') . '-' . substr((string) (date('Y') + 1), -2);
        $yearPrefix = preg_replace('/\D/', '', substr((string) $academicYear, 0, 4)) ?: date('Y');
        $sequence = $db->table('students')->where('institute_id', $instituteId)->countAllResults() + 1;

        return sprintf('%s%s%03d', strtoupper($instituteCode), $yearPrefix, $sequence);
    }

    private function generateAdmissionNumber(): string
    {
        $db = db_connect();
        $existing = $db->table('admissions')
            ->select('admission_number')
            ->orderBy('id', 'DESC')
            ->get()
            ->getResultArray();

        $maxNumber = 0;

        foreach ($existing as $row) {
            if (preg_match('/(\d{4})$/', (string) ($row['admission_number'] ?? ''), $matches)) {
                $maxNumber = max($maxNumber, (int) $matches[1]);
            }
        }

        return 'ADM-' . date('Y') . '-' . str_pad((string) ($maxNumber + 1), 4, '0', STR_PAD_LEFT);
    }
}
