<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;

class AuthController extends BaseController
{
    public function login(): ResponseInterface
    {
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();

        $username = trim((string) ($payload['username'] ?? ''));
        $password = (string) ($payload['password'] ?? '');

        if ($username === '' || $password === '') {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'Username and password are required.',
            ]);
        }

        $userModel = new UserModel();
        $user = $userModel->where('username', $username)->first();

        if (! is_array($user) || empty($user['password_hash']) || ! password_verify($password, $user['password_hash'])) {
            return $this->response->setStatusCode(401)->setJSON([
                'message' => 'Invalid credentials.',
            ]);
        }

        $db = db_connect();
        $institutesBuilder = $db->table('institutes')->select('id, code, name, type');

        if (($user['role_code'] ?? '') !== 'SUPER_ADMIN' && ! empty($user['institute_id'])) {
            $institutesBuilder->where('id', $user['institute_id']);
        }

        $institutes = $institutesBuilder->orderBy('id', 'ASC')->get()->getResultArray();
        $primaryInstituteId = $institutes[0]['id'] ?? $user['institute_id'] ?? null;

        $academicYears = [];
        if ($primaryInstituteId !== null) {
            $academicYears = $db->table('academic_years')
                ->select('id, label, is_current')
                ->where('institute_id', $primaryInstituteId)
                ->orderBy('id', 'ASC')
                ->get()
                ->getResultArray();
        }

        return $this->response->setJSON([
            'message' => 'Login successful.',
            'token' => $this->createToken($user),
            'user' => [
                'id' => (int) $user['id'],
                'username' => $user['username'],
                'fullName' => $user['full_name'],
                'email' => $user['email'],
                'role' => $user['role_code'],
                'instituteId' => $user['institute_id'] ? (int) $user['institute_id'] : null,
            ],
            'institutes' => $institutes,
            'academicYears' => $academicYears,
        ]);
    }

    private function createToken(array $user): string
    {
        return base64_encode(json_encode([
            'uid' => (int) $user['id'],
            'username' => $user['username'],
            'role' => $user['role_code'],
            'time' => time(),
        ], JSON_THROW_ON_ERROR));
    }
}
