<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class StudentFinanceController extends BaseController
{
    public function ledger(string $studentId): ResponseInterface
    {
        return $this->response->setJSON([
            'studentId' => $studentId,
            'studentName' => 'A*** P****',
            'institute' => 'Junior College',
            'academicYear' => '2025-26',
            'grossFee' => 54000,
            'paidAmount' => 35500,
            'outstandingAmount' => 18500,
            'entries' => [
                ['date' => '2026-04-05', 'reference' => 'Admission fee receipt', 'mode' => 'Cash', 'debit' => 0, 'credit' => 12000, 'balance' => 42000],
                ['date' => '2026-04-10', 'reference' => 'Scholarship expected', 'mode' => 'MahaDBT', 'debit' => 0, 'credit' => 8000, 'balance' => 34000],
                ['date' => '2026-04-17', 'reference' => 'Tuition fee receipt', 'mode' => 'UPI', 'debit' => 0, 'credit' => 15500, 'balance' => 18500],
            ],
        ]);
    }
}
