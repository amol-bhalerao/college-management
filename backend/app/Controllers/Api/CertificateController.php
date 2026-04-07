<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\CertificateRequestModel;
use CodeIgniter\HTTP\ResponseInterface;

class CertificateController extends BaseController
{
    public function summary(?int $instituteId = null): ResponseInterface
    {
        $db = db_connect();
        $builder = $db->table('certificate_requests');

        if ($instituteId !== null) {
            $builder->where('institute_id', $instituteId);
        }

        $rows = $builder->get()->getResultArray();
        $total = count($rows);
        $issued = count(array_filter($rows, static fn (array $row): bool => ($row['status'] ?? '') === 'issued'));
        $requested = count(array_filter($rows, static fn (array $row): bool => ($row['status'] ?? '') === 'requested'));
        $verified = count(array_filter($rows, static fn (array $row): bool => ($row['status'] ?? '') === 'verified'));

        return $this->response->setJSON([
            'total' => $total,
            'issued' => $issued,
            'requested' => $requested,
            'verified' => $verified,
        ]);
    }

    public function students(?int $instituteId = null): ResponseInterface
    {
        $builder = db_connect()->table('students')
            ->select('id, institute_id, academic_year_id, gr_number, first_name, last_name, guardian_name, mother_name, current_class, division, category, nationality, religion, caste_subcaste, mobile_number, email, dob, date_of_birth_words, place_of_birth, birth_taluka, birth_district, birth_state, previous_school, date_of_admission, date_of_leaving, class_last_attended, progress_status, conduct, reason_for_leaving, tc_remarks, address')
            ->orderBy('first_name', 'ASC');

        if ($instituteId !== null) {
            $builder->where('institute_id', $instituteId);
        }

        return $this->response->setJSON([
            'students' => $builder->get()->getResultArray(),
        ]);
    }

    public function index(?int $instituteId = null): ResponseInterface
    {
        $db = db_connect();
        $builder = $db->table('certificate_requests c')
            ->select('c.id, c.student_id, c.institute_id, c.academic_year_id, c.request_number, c.certificate_type, c.purpose, c.status, c.verification_token, c.issued_on, c.requested_by, s.gr_number, s.first_name, s.last_name, s.guardian_name, s.mother_name, s.current_class, s.division, s.category, s.nationality, s.religion, s.caste_subcaste, s.mobile_number, s.email, s.dob, s.date_of_birth_words, s.place_of_birth, s.birth_taluka, s.birth_district, s.birth_state, s.previous_school, s.date_of_admission, s.date_of_leaving, s.class_last_attended, s.progress_status, s.conduct, s.reason_for_leaving, s.tc_remarks, s.address, i.name AS institute_name, i.header_title AS institute_header_title, i.header_subtitle AS institute_header_subtitle, i.header_address AS institute_header_address, i.principal_name AS institute_principal_name, i.footer_note AS institute_footer_note, i.contact_phone AS institute_contact_phone, i.contact_email AS institute_contact_email')
            ->join('students s', 's.id = c.student_id', 'left')
            ->join('institutes i', 'i.id = c.institute_id', 'left')
            ->orderBy('c.id', 'DESC');

        if ($instituteId !== null) {
            $builder->where('c.institute_id', $instituteId);
        }

        return $this->response->setJSON([
            'requests' => $builder->get()->getResultArray(),
        ]);
    }

    public function create(): ResponseInterface
    {
        $model = new CertificateRequestModel();
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $studentId = (int) ($payload['student_id'] ?? 0);
        $certificateType = trim((string) ($payload['certificate_type'] ?? ''));

        if ($studentId <= 0 || $certificateType === '') {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'Student and certificate type are required.',
            ]);
        }

        $db = db_connect();
        $student = $db->table('students')
            ->select('id, institute_id, academic_year_id')
            ->where('id', $studentId)
            ->get()
            ->getRowArray();

        if (! is_array($student)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Student record not found.',
            ]);
        }

        $status = trim((string) ($payload['status'] ?? 'requested')) ?: 'requested';
        $insertId = $model->insert([
            'student_id' => $studentId,
            'institute_id' => (int) ($payload['institute_id'] ?? $student['institute_id']),
            'academic_year_id' => (int) ($payload['academic_year_id'] ?? $student['academic_year_id']),
            'request_number' => $this->generateRequestNumber((int) $student['institute_id']),
            'certificate_type' => $certificateType,
            'purpose' => trim((string) ($payload['purpose'] ?? '')),
            'status' => $status,
            'verification_token' => in_array($status, ['issued', 'verified'], true)
                ? $this->generateVerificationToken((int) $student['institute_id'])
                : null,
            'issued_on' => $status === 'issued' ? date('Y-m-d') : null,
            'requested_by' => trim((string) ($payload['requested_by'] ?? 'Clerk Desk')),
        ], true);

        return $this->response->setStatusCode(201)->setJSON([
            'message' => 'Certificate request created successfully.',
            'request' => $model->find($insertId),
        ]);
    }

    public function update(int $id): ResponseInterface
    {
        $model = new CertificateRequestModel();
        $request = $model->find($id);

        if (! is_array($request)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Certificate request not found.',
            ]);
        }

        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $updates = [];

        if (isset($payload['student_id'])) {
            $studentId = (int) $payload['student_id'];
            $student = db_connect()->table('students')
                ->select('id, institute_id, academic_year_id')
                ->where('id', $studentId)
                ->get()
                ->getRowArray();

            if (! is_array($student)) {
                return $this->response->setStatusCode(404)->setJSON([
                    'message' => 'Student record not found.',
                ]);
            }

            $updates['student_id'] = $studentId;
            $updates['institute_id'] = (int) $student['institute_id'];
            $updates['academic_year_id'] = (int) $student['academic_year_id'];
        }

        foreach (['certificate_type', 'requested_by'] as $field) {
            if (isset($payload[$field])) {
                $updates[$field] = trim((string) $payload[$field]);
            }
        }

        if (array_key_exists('purpose', $payload)) {
            $updates['purpose'] = trim((string) ($payload['purpose'] ?? ''));
        }

        if (isset($payload['status'])) {
            $status = trim((string) $payload['status']);
            $updates['status'] = $status;

            if (in_array($status, ['issued', 'verified'], true) && empty($request['verification_token'])) {
                $updates['verification_token'] = $this->generateVerificationToken((int) ($updates['institute_id'] ?? $request['institute_id'] ?? 1));
            }

            if ($status === 'issued' && empty($request['issued_on'])) {
                $updates['issued_on'] = date('Y-m-d');
            }

            if ($status === 'requested') {
                $updates['issued_on'] = null;
            }
        }

        if ($updates === []) {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'No certificate changes were provided.',
            ]);
        }

        $model->update($id, $updates);

        return $this->response->setJSON([
            'message' => 'Certificate request updated successfully.',
            'request' => $model->find($id),
        ]);
    }

    public function delete(int $id): ResponseInterface
    {
        $model = new CertificateRequestModel();
        $request = $model->find($id);

        if (! is_array($request)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Certificate request not found.',
            ]);
        }

        $model->delete($id);

        return $this->response->setJSON([
            'message' => 'Certificate request deleted successfully.',
        ]);
    }

    public function issue(int $id): ResponseInterface
    {
        $model = new CertificateRequestModel();
        $request = $model->find($id);

        if (! is_array($request)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Certificate request not found.',
            ]);
        }

        $token = $request['verification_token'] ?: $this->generateVerificationToken((int) ($request['institute_id'] ?? 1));

        $model->update($id, [
            'status' => 'issued',
            'issued_on' => date('Y-m-d'),
            'verification_token' => $token,
        ]);

        return $this->response->setJSON([
            'message' => 'Certificate marked as issued.',
            'request' => $model->find($id),
        ]);
    }

    private function generateRequestNumber(int $instituteId): string
    {
        $db = db_connect();
        $instituteCode = $db->table('institutes')->select('code')->where('id', $instituteId)->get()->getRowArray()['code'] ?? 'CERT';
        $sequence = $db->table('certificate_requests')->where('institute_id', $instituteId)->countAllResults() + 1;

        return sprintf('CERT-%s-%04d', strtoupper($instituteCode), $sequence);
    }

    private function generateVerificationToken(int $instituteId): string
    {
        $db = db_connect();
        $instituteCode = $db->table('institutes')->select('code')->where('id', $instituteId)->get()->getRowArray()['code'] ?? 'CERT';

        return sprintf('CERT-%s-%s', strtoupper($instituteCode), strtoupper(bin2hex(random_bytes(3))));
    }
}
