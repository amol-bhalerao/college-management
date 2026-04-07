<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\MasterEntryModel;
use CodeIgniter\HTTP\ResponseInterface;

class MasterDataController extends BaseController
{
    public function summary(?int $instituteId = null): ResponseInterface
    {
        $builder = db_connect()->table('master_entries');

        if ($instituteId !== null) {
            $builder->where('institute_id', $instituteId);
        }

        $rows = $builder->get()->getResultArray();

        return $this->response->setJSON([
            'total' => count($rows),
            'active' => count(array_filter($rows, static fn (array $row): bool => (string) ($row['status'] ?? 'active') === 'active')),
            'types' => count(array_unique(array_map(static fn (array $row): string => (string) ($row['master_type'] ?? ''), $rows))),
            'feeAndForms' => count(array_filter($rows, static fn (array $row): bool => in_array((string) ($row['master_type'] ?? ''), ['fee_head', 'form_type'], true))),
        ]);
    }

    public function index(?int $instituteId = null): ResponseInterface
    {
        $type = trim((string) ($this->request->getGet('type') ?? ''));
        $builder = db_connect()->table('master_entries')
            ->orderBy('master_type', 'ASC')
            ->orderBy('sort_order', 'ASC')
            ->orderBy('label', 'ASC');

        if ($instituteId !== null) {
            $builder->where('institute_id', $instituteId);
        }

        if ($type !== '') {
            $builder->where('master_type', $type);
        }

        return $this->response->setJSON([
            'entries' => $builder->get()->getResultArray(),
        ]);
    }

    public function options(?int $instituteId = null): ResponseInterface
    {
        $builder = db_connect()->table('master_entries')
            ->where('status', 'active')
            ->orderBy('master_type', 'ASC')
            ->orderBy('sort_order', 'ASC')
            ->orderBy('label', 'ASC');

        if ($instituteId !== null) {
            $builder->where('institute_id', $instituteId);
        }

        return $this->response->setJSON([
            'options' => $this->groupOptions($builder->get()->getResultArray()),
        ]);
    }

    public function create(): ResponseInterface
    {
        $model = new MasterEntryModel();
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $instituteId = (int) ($payload['institute_id'] ?? 1);
        $masterType = trim((string) ($payload['master_type'] ?? ''));
        $label = trim((string) ($payload['label'] ?? ''));

        if ($masterType === '' || $label === '') {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'Master type and label are required.',
            ]);
        }

        $insertId = $model->insert([
            'institute_id' => $instituteId,
            'master_type' => $masterType,
            'code' => $this->normaliseCode($label, trim((string) ($payload['code'] ?? ''))),
            'label' => $label,
            'description' => trim((string) ($payload['description'] ?? '')),
            'sort_order' => (int) ($payload['sort_order'] ?? 1),
            'status' => trim((string) ($payload['status'] ?? 'active')) ?: 'active',
            'meta_json' => trim((string) ($payload['meta_json'] ?? '')) ?: null,
        ], true);

        return $this->response->setStatusCode(201)->setJSON([
            'message' => 'Master entry created successfully.',
            'entry' => $model->find($insertId),
        ]);
    }

    public function update(int $id): ResponseInterface
    {
        $model = new MasterEntryModel();
        $entry = $model->find($id);

        if (! is_array($entry)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Master entry not found.',
            ]);
        }

        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $updates = [];

        foreach (['master_type', 'label', 'description', 'status'] as $field) {
            if (isset($payload[$field])) {
                $updates[$field] = trim((string) $payload[$field]);
            }
        }

        if (isset($payload['code']) || isset($updates['label'])) {
            $updates['code'] = $this->normaliseCode((string) ($updates['label'] ?? $entry['label']), trim((string) ($payload['code'] ?? (string) ($entry['code'] ?? ''))));
        }

        if (isset($payload['sort_order'])) {
            $updates['sort_order'] = (int) $payload['sort_order'];
        }

        if (array_key_exists('meta_json', $payload)) {
            $updates['meta_json'] = trim((string) ($payload['meta_json'] ?? '')) ?: null;
        }

        if ($updates === []) {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'No master changes were provided.',
            ]);
        }

        $model->update($id, $updates);

        return $this->response->setJSON([
            'message' => 'Master entry updated successfully.',
            'entry' => $model->find($id),
        ]);
    }

    public function delete(int $id): ResponseInterface
    {
        $model = new MasterEntryModel();
        $entry = $model->find($id);

        if (! is_array($entry)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Master entry not found.',
            ]);
        }

        $model->delete($id);

        return $this->response->setJSON([
            'message' => 'Master entry deleted successfully.',
        ]);
    }

    private function groupOptions(array $rows): array
    {
        $grouped = [];

        foreach ($rows as $row) {
            $type = (string) ($row['master_type'] ?? 'general');
            $grouped[$type] ??= [];
            $meta = [];

            if (! empty($row['meta_json'])) {
                try {
                    $decoded = json_decode((string) $row['meta_json'], true, 512, JSON_THROW_ON_ERROR);
                    if (is_array($decoded)) {
                        $meta = $decoded;
                    }
                } catch (\Throwable) {
                    $meta = [];
                }
            }

            $grouped[$type][] = [
                'id' => (int) ($row['id'] ?? 0),
                'code' => $row['code'] ?? null,
                'label' => $row['label'] ?? '',
                'value' => $row['label'] ?? '',
                'description' => $row['description'] ?? null,
                'sort_order' => (int) ($row['sort_order'] ?? 1),
                'meta_json' => $row['meta_json'] ?? null,
                'parent_value' => $meta['parent_value'] ?? null,
                'note' => $meta['note'] ?? null,
                'next_value' => $meta['next_value'] ?? null,
                'year_order' => isset($meta['year_order']) ? (int) $meta['year_order'] : null,
            ];
        }

        return $grouped;
    }

    private function normaliseCode(string $label, string $preferred = ''): string
    {
        $source = trim($preferred !== '' ? $preferred : $label);
        $code = preg_replace('/[^A-Za-z0-9]+/', '_', strtoupper($source)) ?? '';

        return trim($code, '_');
    }
}
