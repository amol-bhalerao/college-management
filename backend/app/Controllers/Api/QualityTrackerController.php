<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\QualityMetricModel;
use CodeIgniter\HTTP\ResponseInterface;

class QualityTrackerController extends BaseController
{
    public function summary(?int $instituteId = null): ResponseInterface
    {
        $builder = db_connect()->table('quality_metrics');

        if ($instituteId !== null) {
            $builder->where('institute_id', $instituteId);
        }

        $rows = $builder->get()->getResultArray();
        $today = date('Y-m-d');
        $dueSoonDate = date('Y-m-d', strtotime('+14 days'));

        return $this->response->setJSON([
            'total' => count($rows),
            'completed' => count(array_filter($rows, static fn (array $row): bool => (string) ($row['status'] ?? '') === 'completed')),
            'evidenceReady' => count(array_filter($rows, static fn (array $row): bool => (string) ($row['evidence_status'] ?? '') === 'ready')),
            'dueSoon' => count(array_filter($rows, static fn (array $row): bool => ! empty($row['next_review_date']) && $row['next_review_date'] >= $today && $row['next_review_date'] <= $dueSoonDate)),
        ]);
    }

    public function index(?int $instituteId = null): ResponseInterface
    {
        $builder = db_connect()->table('quality_metrics qm')
            ->select('qm.*, i.name AS institute_name, ay.label AS academic_year_label')
            ->join('institutes i', 'i.id = qm.institute_id', 'left')
            ->join('academic_years ay', 'ay.id = qm.academic_year_id', 'left')
            ->orderBy('qm.id', 'DESC');

        if ($instituteId !== null) {
            $builder->where('qm.institute_id', $instituteId);
        }

        return $this->response->setJSON([
            'metrics' => $builder->get()->getResultArray(),
        ]);
    }

    public function create(): ResponseInterface
    {
        $model = new QualityMetricModel();
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $title = trim((string) ($payload['title'] ?? ''));
        $criterionCode = trim((string) ($payload['criterion_code'] ?? ''));
        $instituteId = (int) ($payload['institute_id'] ?? 1);

        if ($title === '' || $criterionCode === '') {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'Criterion code and title are required.',
            ]);
        }

        $insertId = $model->insert([
            'institute_id' => $instituteId,
            'academic_year_id' => $this->resolveAcademicYearId($instituteId, isset($payload['academic_year_id']) ? (int) $payload['academic_year_id'] : null),
            'criterion_code' => $criterionCode,
            'title' => $title,
            'owner' => trim((string) ($payload['owner'] ?? 'IQAC Cell')),
            'target_value' => (int) ($payload['target_value'] ?? 0),
            'achieved_value' => (int) ($payload['achieved_value'] ?? 0),
            'status' => trim((string) ($payload['status'] ?? 'ongoing')) ?: 'ongoing',
            'evidence_status' => trim((string) ($payload['evidence_status'] ?? 'in-progress')) ?: 'in-progress',
            'next_review_date' => ($payload['next_review_date'] ?? '') !== '' ? (string) $payload['next_review_date'] : null,
            'notes' => trim((string) ($payload['notes'] ?? '')),
        ], true);

        return $this->response->setStatusCode(201)->setJSON([
            'message' => 'IQAC / NAAC tracker entry created successfully.',
            'metric' => $model->find($insertId),
        ]);
    }

    public function update(int $id): ResponseInterface
    {
        $model = new QualityMetricModel();
        $row = $model->find($id);

        if (! is_array($row)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'IQAC tracker entry not found.',
            ]);
        }

        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $updates = [];

        foreach (['criterion_code', 'title', 'owner', 'status', 'evidence_status', 'notes'] as $field) {
            if (isset($payload[$field])) {
                $updates[$field] = trim((string) $payload[$field]);
            }
        }

        foreach (['target_value', 'achieved_value'] as $field) {
            if (isset($payload[$field])) {
                $updates[$field] = (int) $payload[$field];
            }
        }

        if (array_key_exists('next_review_date', $payload)) {
            $updates['next_review_date'] = ($payload['next_review_date'] ?? '') !== '' ? (string) $payload['next_review_date'] : null;
        }

        if ($updates === []) {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'No IQAC changes were provided.',
            ]);
        }

        $model->update($id, $updates);

        return $this->response->setJSON([
            'message' => 'IQAC / NAAC tracker entry updated successfully.',
            'metric' => $model->find($id),
        ]);
    }

    public function delete(int $id): ResponseInterface
    {
        $model = new QualityMetricModel();
        $row = $model->find($id);

        if (! is_array($row)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'IQAC tracker entry not found.',
            ]);
        }

        $model->delete($id);

        return $this->response->setJSON([
            'message' => 'IQAC tracker entry deleted successfully.',
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
}
