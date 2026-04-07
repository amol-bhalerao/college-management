<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\InstituteModel;
use CodeIgniter\HTTP\ResponseInterface;

class InstituteController extends BaseController
{
    public function index(): ResponseInterface
    {
        $model = new InstituteModel();

        return $this->response->setJSON([
            'institutes' => $model->orderBy('id', 'ASC')->findAll(),
        ]);
    }

    public function settings(int $id): ResponseInterface
    {
        $model = new InstituteModel();
        $institute = $model->find($id);

        if (! is_array($institute)) {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'Institute not found.']);
        }

        return $this->response->setJSON([
            'institute' => $institute,
        ]);
    }

    public function updateSettings(int $id): ResponseInterface
    {
        $model = new InstituteModel();
        $institute = $model->find($id);

        if (! is_array($institute)) {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'Institute not found.']);
        }

        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $allowedFields = [
            'name',
            'contact_email',
            'contact_phone',
            'receipt_prefix',
            'header_title',
            'header_subtitle',
            'header_address',
            'principal_name',
            'footer_note',
            'website_url',
            'logo_url',
        ];

        $updates = array_intersect_key($payload, array_flip($allowedFields));

        if ($updates === []) {
            return $this->response->setStatusCode(422)->setJSON(['message' => 'No settings provided to update.']);
        }

        $model->update($id, $updates);

        return $this->response->setJSON([
            'message' => 'Institute header settings updated successfully.',
            'institute' => $model->find($id),
        ]);
    }
}
