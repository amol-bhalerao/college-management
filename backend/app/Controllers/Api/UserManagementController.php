<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;

class UserManagementController extends BaseController
{
    public function index(): ResponseInterface
    {
        $db = db_connect();
        $users = $db->table('users u')
            ->select('u.id, u.institute_id, u.username, u.full_name, u.email, u.role_code, u.whatsapp_number, u.status, i.name AS institute_name')
            ->join('institutes i', 'i.id = u.institute_id', 'left')
            ->orderBy('u.id', 'ASC')
            ->get()
            ->getResultArray();

        return $this->response->setJSON([
            'users' => $users,
        ]);
    }

    public function create(): ResponseInterface
    {
        $model = new UserModel();
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();

        $username = trim((string) ($payload['username'] ?? ''));
        $email = trim((string) ($payload['email'] ?? ''));

        if ($username === '' || $email === '' || empty($payload['full_name']) || empty($payload['role_code'])) {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'Institute, full name, username, email, and role are required.',
            ]);
        }

        if ($model->where('username', $username)->first() || $model->where('email', $email)->first()) {
            return $this->response->setStatusCode(409)->setJSON([
                'message' => 'A user with the same username or email already exists.',
            ]);
        }

        $insertId = $model->insert([
            'institute_id' => (int) ($payload['institute_id'] ?? 1),
            'username' => $username,
            'full_name' => trim((string) $payload['full_name']),
            'email' => $email,
            'role_code' => trim((string) $payload['role_code']),
            'password_hash' => password_hash((string) ($payload['password'] ?? 'Password@123'), PASSWORD_DEFAULT),
            'whatsapp_number' => trim((string) ($payload['whatsapp_number'] ?? '')),
            'status' => trim((string) ($payload['status'] ?? 'active')),
        ], true);

        return $this->response->setStatusCode(201)->setJSON([
            'message' => 'User created successfully.',
            'user' => $model->find($insertId),
        ]);
    }

    public function update(int $id): ResponseInterface
    {
        $model = new UserModel();
        $user = $model->find($id);

        if (! is_array($user)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'User not found.',
            ]);
        }

        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $updates = array_filter([
            'institute_id' => isset($payload['institute_id']) ? (int) $payload['institute_id'] : null,
            'full_name' => isset($payload['full_name']) ? trim((string) $payload['full_name']) : null,
            'email' => isset($payload['email']) ? trim((string) $payload['email']) : null,
            'role_code' => isset($payload['role_code']) ? trim((string) $payload['role_code']) : null,
            'whatsapp_number' => isset($payload['whatsapp_number']) ? trim((string) $payload['whatsapp_number']) : null,
            'status' => isset($payload['status']) ? trim((string) $payload['status']) : null,
        ], static fn ($value) => $value !== null && $value !== '');

        if (! empty($payload['password'])) {
            $updates['password_hash'] = password_hash((string) $payload['password'], PASSWORD_DEFAULT);
        }

        if ($updates === []) {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'No updates provided.',
            ]);
        }

        $model->update($id, $updates);

        return $this->response->setJSON([
            'message' => 'User updated successfully.',
            'user' => $model->find($id),
        ]);
    }

    public function delete(int $id): ResponseInterface
    {
        $model = new UserModel();
        $user = $model->find($id);

        if (! is_array($user)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'User not found.',
            ]);
        }

        if (($user['role_code'] ?? '') === 'SUPER_ADMIN') {
            $superAdminCount = $model->where('role_code', 'SUPER_ADMIN')->countAllResults();

            if ($superAdminCount <= 1) {
                return $this->response->setStatusCode(409)->setJSON([
                    'message' => 'At least one super admin account must remain active.',
                ]);
            }
        }

        $model->delete($id);

        return $this->response->setJSON([
            'message' => 'User deleted successfully.',
        ]);
    }
}
