<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\StudentLedgerEntryModel;
use App\Models\StudentModel;
use CodeIgniter\HTTP\ResponseInterface;

class StudentFinanceController extends BaseController
{
    public function ledger(string $studentId): ResponseInterface
    {
        $studentModel = new StudentModel();
        $ledgerModel = new StudentLedgerEntryModel();

        $student = $studentModel
            ->where('gr_number', $studentId)
            ->orWhere('id', $studentId)
            ->first();

        if (! is_array($student)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Student ledger not found.',
            ]);
        }

        $entries = $ledgerModel
            ->where('student_id', $student['id'])
            ->orderBy('entry_date', 'ASC')
            ->findAll();

        $grossFee = 0;
        $paidAmount = 0;
        $outstandingAmount = 0;

        if ($entries !== []) {
            $grossFee = (float) array_sum(array_map(static fn (array $entry): float => (float) $entry['debit'], $entries));
            $paidAmount = (float) array_sum(array_map(static fn (array $entry): float => (float) $entry['credit'], $entries));
            $outstandingAmount = (float) ($entries[count($entries) - 1]['balance'] ?? 0);
        }

        $instituteName = db_connect()->table('institutes')->select('name')->where('id', $student['institute_id'])->get()->getRowArray()['name'] ?? 'Institute';

        return $this->response->setJSON([
            'studentId' => $student['gr_number'],
            'studentName' => trim($student['first_name'] . ' ' . $student['last_name']),
            'institute' => $instituteName,
            'academicYear' => '2025-26',
            'grossFee' => $grossFee,
            'paidAmount' => $paidAmount,
            'outstandingAmount' => $outstandingAmount,
            'entries' => array_map(static fn (array $entry): array => [
                'date' => $entry['entry_date'],
                'reference' => $entry['reference'],
                'mode' => $entry['mode'],
                'debit' => (float) $entry['debit'],
                'credit' => (float) $entry['credit'],
                'balance' => (float) $entry['balance'],
            ], $entries),
        ]);
    }
}
