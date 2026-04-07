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

    public function index(?int $instituteId = null): ResponseInterface
    {
        $db = db_connect();
        $builder = $db->table('certificate_requests c')
            ->select('c.id, c.request_number, c.certificate_type, c.purpose, c.status, c.verification_token, c.issued_on, c.requested_by, s.gr_number, s.first_name, s.last_name, i.name AS institute_name')
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

    public function issue(int $id): ResponseInterface
    {
        $model = new CertificateRequestModel();
        $request = $model->find($id);

        if (! is_array($request)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Certificate request not found.',
            ]);
        }

        $token = $request['verification_token'] ?: 'CERT-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(4)));

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
}
