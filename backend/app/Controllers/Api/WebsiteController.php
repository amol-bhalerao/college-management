<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\InstituteModel;
use App\Models\WebsitePageModel;
use CodeIgniter\HTTP\ResponseInterface;

class WebsiteController extends BaseController
{
    public function pages(int $instituteId): ResponseInterface
    {
        $instituteModel = new InstituteModel();
        $pageModel = new WebsitePageModel();
        $institute = $instituteModel->find($instituteId);

        if (! is_array($institute)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Institute not found.',
            ]);
        }

        return $this->response->setJSON([
            'institute' => $institute,
            'pages' => $pageModel->where('institute_id', $instituteId)->orderBy('sort_order', 'ASC')->orderBy('id', 'ASC')->findAll(),
        ]);
    }

    public function create(): ResponseInterface
    {
        $model = new WebsitePageModel();
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $title = trim((string) ($payload['title'] ?? ''));
        $instituteId = (int) ($payload['institute_id'] ?? 1);

        if ($title === '') {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'Page title is required.',
            ]);
        }

        $slug = $this->buildSlug((string) ($payload['slug'] ?? $title));
        $existing = $model->where('institute_id', $instituteId)->where('slug', $slug)->first();
        if (is_array($existing)) {
            return $this->response->setStatusCode(409)->setJSON([
                'message' => 'A page with the same slug already exists for this institute.',
            ]);
        }

        $insertId = $model->insert([
            'institute_id' => $instituteId,
            'slug' => $slug,
            'nav_label' => trim((string) ($payload['nav_label'] ?? $title)),
            'menu_group' => trim((string) ($payload['menu_group'] ?? 'General')),
            'title' => $title,
            'hero_title' => trim((string) ($payload['hero_title'] ?? $title)),
            'hero_subtitle' => trim((string) ($payload['hero_subtitle'] ?? '')),
            'body_html' => (string) ($payload['body_html'] ?? ''),
            'seo_title' => trim((string) ($payload['seo_title'] ?? $title)),
            'seo_description' => trim((string) ($payload['seo_description'] ?? '')),
            'is_published' => (int) ($payload['is_published'] ?? 1) ? 1 : 0,
            'sort_order' => (int) ($payload['sort_order'] ?? 1),
        ], true);

        return $this->response->setStatusCode(201)->setJSON([
            'message' => 'Website page created successfully.',
            'page' => $model->find($insertId),
        ]);
    }

    public function update(int $id): ResponseInterface
    {
        $model = new WebsitePageModel();
        $page = $model->find($id);

        if (! is_array($page)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Website page not found.',
            ]);
        }

        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $updates = [];

        foreach (['nav_label', 'menu_group', 'title', 'hero_title', 'hero_subtitle', 'body_html', 'seo_title', 'seo_description'] as $field) {
            if (isset($payload[$field])) {
                $updates[$field] = is_string($payload[$field]) ? trim((string) $payload[$field]) : $payload[$field];
            }
        }

        if (isset($payload['slug'])) {
            $slug = $this->buildSlug((string) $payload['slug']);
            $existing = $model->where('institute_id', $page['institute_id'])->where('slug', $slug)->where('id !=', $id)->first();
            if (is_array($existing)) {
                return $this->response->setStatusCode(409)->setJSON([
                    'message' => 'Another page already uses this slug.',
                ]);
            }
            $updates['slug'] = $slug;
        }

        foreach (['is_published', 'sort_order'] as $field) {
            if (isset($payload[$field])) {
                $updates[$field] = (int) $payload[$field];
            }
        }

        if ($updates === []) {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'No website changes were provided.',
            ]);
        }

        $model->update($id, $updates);

        return $this->response->setJSON([
            'message' => 'Website page updated successfully.',
            'page' => $model->find($id),
        ]);
    }

    public function delete(int $id): ResponseInterface
    {
        $model = new WebsitePageModel();
        $page = $model->find($id);

        if (! is_array($page)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Website page not found.',
            ]);
        }

        $model->delete($id);

        return $this->response->setJSON([
            'message' => 'Website page deleted successfully.',
        ]);
    }

    public function publicSite(?string $code = null): ResponseInterface
    {
        $instituteModel = new InstituteModel();
        $pageModel = new WebsitePageModel();

        if ($code !== null && trim($code) !== '') {
            $institute = $instituteModel->where('LOWER(code)', strtolower($code))->first();
        } else {
            $institute = $instituteModel->where('status', 'active')->orderBy('id', 'ASC')->first();
        }

        if (! is_array($institute)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Public site not found.',
            ]);
        }

        return $this->response->setJSON([
            'institute' => $institute,
            'pages' => $pageModel
                ->where('institute_id', (int) $institute['id'])
                ->where('is_published', 1)
                ->orderBy('sort_order', 'ASC')
                ->orderBy('id', 'ASC')
                ->findAll(),
        ]);
    }

    private function buildSlug(string $value): string
    {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $value), '-'));

        return $slug !== '' ? $slug : 'page-' . date('His');
    }
}
