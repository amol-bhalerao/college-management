<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\ScholarshipApplicationModel;
use CodeIgniter\HTTP\ResponseInterface;

class ScholarshipController extends BaseController
{
    public function summary(?int $instituteId = null): ResponseInterface
    {
        $builder = db_connect()->table('scholarship_applications');

        if ($instituteId !== null) {
            $builder->where('institute_id', $instituteId);
        }

        $rows = $builder->get()->getResultArray();

        return $this->response->setJSON([
            'total' => count($rows),
            'eligible' => count(array_filter($rows, static fn (array $row): bool => (int) ($row['is_eligible'] ?? 0) === 1)),
            'submitted' => count(array_filter($rows, static fn (array $row): bool => in_array((string) ($row['status'] ?? ''), ['submitted', 'verified', 'approved'], true))),
            'approved' => count(array_filter($rows, static fn (array $row): bool => (string) ($row['status'] ?? '') === 'approved')),
            'expectedAmount' => (float) array_sum(array_map(static fn (array $row): float => (float) ($row['expected_amount'] ?? 0), $rows)),
        ]);
    }

    public function index(?int $instituteId = null): ResponseInterface
    {
        $builder = db_connect()->table('scholarship_applications sa')
            ->select('sa.id, sa.student_id, sa.institute_id, sa.academic_year_id, sa.scheme_name, sa.status, sa.is_eligible, sa.expected_amount, s.gr_number, s.first_name, s.last_name, s.current_class, s.category, i.name AS institute_name')
            ->join('students s', 's.id = sa.student_id', 'left')
            ->join('institutes i', 'i.id = sa.institute_id', 'left')
            ->orderBy('sa.id', 'DESC');

        if ($instituteId !== null) {
            $builder->where('sa.institute_id', $instituteId);
        }

        return $this->response->setJSON([
            'applications' => $builder->get()->getResultArray(),
        ]);
    }

    public function create(): ResponseInterface
    {
        $model = new ScholarshipApplicationModel();
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $studentId = (int) ($payload['student_id'] ?? 0);
        $schemeName = trim((string) ($payload['scheme_name'] ?? ''));

        if ($studentId <= 0 || $schemeName === '') {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'Student and scheme name are required.',
            ]);
        }

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

        $insertId = $model->insert([
            'student_id' => $studentId,
            'institute_id' => (int) $student['institute_id'],
            'academic_year_id' => (int) $student['academic_year_id'],
            'scheme_name' => $schemeName,
            'status' => trim((string) ($payload['status'] ?? 'pending')) ?: 'pending',
            'is_eligible' => (int) ($payload['is_eligible'] ?? 1) ? 1 : 0,
            'expected_amount' => (float) ($payload['expected_amount'] ?? 0),
        ], true);

        return $this->response->setStatusCode(201)->setJSON([
            'message' => 'Scholarship application created successfully.',
            'application' => $model->find($insertId),
        ]);
    }

    public function update(int $id): ResponseInterface
    {
        $model = new ScholarshipApplicationModel();
        $row = $model->find($id);

        if (! is_array($row)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Scholarship application not found.',
            ]);
        }

        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $updates = [];

        foreach (['scheme_name', 'status'] as $field) {
            if (isset($payload[$field])) {
                $updates[$field] = trim((string) $payload[$field]);
            }
        }

        if (isset($payload['is_eligible'])) {
            $updates['is_eligible'] = (int) $payload['is_eligible'] ? 1 : 0;
        }

        if (isset($payload['expected_amount'])) {
            $updates['expected_amount'] = (float) $payload['expected_amount'];
        }

        if ($updates === []) {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'No scholarship changes were provided.',
            ]);
        }

        $model->update($id, $updates);

        return $this->response->setJSON([
            'message' => 'Scholarship application updated successfully.',
            'application' => $model->find($id),
        ]);
    }

    public function delete(int $id): ResponseInterface
    {
        $model = new ScholarshipApplicationModel();
        $row = $model->find($id);

        if (! is_array($row)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Scholarship application not found.',
            ]);
        }

        $model->delete($id);

        return $this->response->setJSON([
            'message' => 'Scholarship application deleted successfully.',
        ]);
    }
}
