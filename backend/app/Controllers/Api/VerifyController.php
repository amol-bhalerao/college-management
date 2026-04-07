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
        $record = db_connect()
            ->table('certificate_requests c')
            ->select('c.request_number, c.certificate_type, c.issued_on, c.status, s.first_name, s.last_name, i.name AS institute_name')
            ->join('students s', 's.id = c.student_id', 'left')
            ->join('institutes i', 'i.id = c.institute_id', 'left')
            ->where('c.verification_token', $token)
            ->get()
            ->getRowArray();

        if (! is_array($record)) {
            return $this->response->setStatusCode(404)->setJSON([
                'documentType' => 'certificate',
                'token' => $token,
                'valid' => false,
                'message' => 'Certificate record not found.',
            ]);
        }

        return $this->response->setJSON([
            'documentType' => 'certificate',
            'token' => $token,
            'valid' => true,
            'documentNumber' => $record['request_number'],
            'studentName' => trim(($record['first_name'] ?? '') . ' ' . ($record['last_name'] ?? '')),
            'certificateType' => $record['certificate_type'],
            'institute' => $record['institute_name'],
            'issuedOn' => $record['issued_on'],
            'status' => $record['status'],
        ]);
    }
}
