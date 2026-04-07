<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\StudentModel;
use CodeIgniter\HTTP\ResponseInterface;

class StudentController extends BaseController
{
    public function index(?int $instituteId = null): ResponseInterface
    {
        $builder = db_connect()->table('students s')
            ->select("s.id, s.institute_id, s.academic_year_id, s.gr_number, s.first_name, s.last_name, s.guardian_name, s.gender, s.category, s.current_class, s.division, s.mobile_number, s.email, s.dob, s.address, s.status, s.admission_status, i.name AS institute_name, ay.label AS academic_year_label, COALESCE((SELECT sle.balance FROM student_ledger_entries sle WHERE sle.student_id = s.id ORDER BY sle.entry_date DESC, sle.id DESC LIMIT 1), 0) AS outstanding_amount", false)
            ->join('institutes i', 'i.id = s.institute_id', 'left')
            ->join('academic_years ay', 'ay.id = s.academic_year_id', 'left')
            ->orderBy('s.id', 'DESC');

        if ($instituteId !== null) {
            $builder->where('s.institute_id', $instituteId);
        }

        return $this->response->setJSON([
            'students' => $builder->get()->getResultArray(),
        ]);
    }

    public function create(): ResponseInterface
    {
        $model = new StudentModel();
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $firstName = trim((string) ($payload['first_name'] ?? ''));
        $lastName = trim((string) ($payload['last_name'] ?? ''));
        $instituteId = (int) ($payload['institute_id'] ?? 1);

        if ($firstName === '' || $lastName === '') {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'First name and last name are required.',
            ]);
        }

        $academicYearId = $this->resolveAcademicYearId($instituteId, isset($payload['academic_year_id']) ? (int) $payload['academic_year_id'] : null);
        $grNumber = trim((string) ($payload['gr_number'] ?? ''));

        if ($grNumber === '') {
            $grNumber = $this->generateGrNumber($instituteId, $academicYearId);
        }

        $existing = $model->where('gr_number', $grNumber)->first();
        if (is_array($existing)) {
            return $this->response->setStatusCode(409)->setJSON([
                'message' => 'A student with the same GR number already exists.',
            ]);
        }

        $insertId = $model->insert([
            'institute_id' => $instituteId,
            'academic_year_id' => $academicYearId,
            'gr_number' => $grNumber,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'guardian_name' => trim((string) ($payload['guardian_name'] ?? '')),
            'gender' => trim((string) ($payload['gender'] ?? '')),
            'category' => trim((string) ($payload['category'] ?? '')),
            'current_class' => trim((string) ($payload['current_class'] ?? '')),
            'division' => trim((string) ($payload['division'] ?? 'A')),
            'mobile_number' => trim((string) ($payload['mobile_number'] ?? '')),
            'email' => trim((string) ($payload['email'] ?? '')),
            'dob' => ($payload['dob'] ?? '') !== '' ? (string) $payload['dob'] : null,
            'address' => trim((string) ($payload['address'] ?? '')),
            'status' => trim((string) ($payload['status'] ?? 'active')) ?: 'active',
            'admission_status' => trim((string) ($payload['admission_status'] ?? 'confirmed')) ?: 'confirmed',
        ], true);

        return $this->response->setStatusCode(201)->setJSON([
            'message' => 'Student master created successfully.',
            'student' => $model->find($insertId),
        ]);
    }

    public function update(int $id): ResponseInterface
    {
        $model = new StudentModel();
        $student = $model->find($id);

        if (! is_array($student)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Student record not found.',
            ]);
        }

        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $updates = [];

        if (isset($payload['institute_id'])) {
            $updates['institute_id'] = (int) $payload['institute_id'];
        }

        if (isset($payload['academic_year_id']) || isset($payload['institute_id'])) {
            $updates['academic_year_id'] = $this->resolveAcademicYearId(
                (int) ($updates['institute_id'] ?? $student['institute_id']),
                isset($payload['academic_year_id']) ? (int) $payload['academic_year_id'] : (int) $student['academic_year_id'],
            );
        }

        foreach (['gr_number', 'first_name', 'last_name', 'guardian_name', 'gender', 'category', 'current_class', 'division', 'mobile_number', 'email', 'address', 'status', 'admission_status'] as $field) {
            if (isset($payload[$field])) {
                $updates[$field] = trim((string) $payload[$field]);
            }
        }

        if (array_key_exists('dob', $payload)) {
            $updates['dob'] = ($payload['dob'] ?? '') !== '' ? (string) $payload['dob'] : null;
        }

        if (isset($updates['gr_number']) && $updates['gr_number'] !== '') {
            $existing = $model->where('gr_number', $updates['gr_number'])->where('id !=', $id)->first();
            if (is_array($existing)) {
                return $this->response->setStatusCode(409)->setJSON([
                    'message' => 'Another student already uses this GR number.',
                ]);
            }
        }

        if ($updates === []) {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'No student changes were provided.',
            ]);
        }

        $model->update($id, $updates);

        return $this->response->setJSON([
            'message' => 'Student master updated successfully.',
            'student' => $model->find($id),
        ]);
    }

    public function delete(int $id): ResponseInterface
    {
        $model = new StudentModel();
        $student = $model->find($id);

        if (! is_array($student)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Student record not found.',
            ]);
        }

        $db = db_connect();
        $hasAdmissions = $db->table('admissions')->where('student_id', $id)->countAllResults() > 0;
        $hasLedger = $db->table('student_ledger_entries')->where('student_id', $id)->countAllResults() > 0;
        $hasCertificates = $db->table('certificate_requests')->where('student_id', $id)->countAllResults() > 0;

        if ($hasAdmissions || $hasLedger || $hasCertificates) {
            return $this->response->setStatusCode(409)->setJSON([
                'message' => 'This student has linked admissions, ledger, or certificate records. Mark the student inactive instead of deleting.',
            ]);
        }

        $model->delete($id);

        return $this->response->setJSON([
            'message' => 'Student deleted successfully.',
        ]);
    }

    private function resolveAcademicYearId(int $instituteId, ?int $academicYearId = null): int
    {
        if (($academicYearId ?? 0) > 0) {
            return (int) $academicYearId;
        }

        $row = db_connect()->table('academic_years')
            ->select('id')
            ->where('institute_id', $instituteId)
            ->orderBy('is_current', 'DESC')
            ->orderBy('id', 'DESC')
            ->get()
            ->getRowArray();

        return (int) ($row['id'] ?? 1);
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
}
