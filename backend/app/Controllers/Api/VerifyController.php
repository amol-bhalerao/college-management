<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class VerifyController extends BaseController
{
    public function receipt(string $token): ResponseInterface
    {
        return $this->response->setJSON([
            'documentType' => 'receipt',
            'token' => $token,
            'valid' => true,
            'documentNumber' => 'RCPT-2025-00124',
            'studentName' => 'A*** P****',
            'institute' => 'Junior College',
            'issuedOn' => '2026-04-07',
        ]);
    }

    public function certificate(string $token): ResponseInterface
    {
        return $this->response->setJSON([
            'documentType' => 'certificate',
            'token' => $token,
            'valid' => true,
            'documentNumber' => 'CERT-2025-00018',
            'studentName' => 'A*** P****',
            'institute' => 'Degree College',
            'issuedOn' => '2026-04-07',
        ]);
    }
}
