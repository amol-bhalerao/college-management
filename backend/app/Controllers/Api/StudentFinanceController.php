<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\FeeReceiptModel;
use App\Models\StudentLedgerEntryModel;
use App\Models\StudentModel;
use CodeIgniter\HTTP\ResponseInterface;

class StudentFinanceController extends BaseController
{
    public function ledger(string $studentId): ResponseInterface
    {
        $student = $this->findStudent($studentId);

        if (! is_array($student)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Student ledger not found.',
            ]);
        }

        return $this->response->setJSON($this->buildLedgerResponse($student));
    }

    public function counterSummary(?int $instituteId = null): ResponseInterface
    {
        return $this->response->setJSON($this->buildCounterSummary($instituteId));
    }

    public function collect(string $studentId): ResponseInterface
    {
        $student = $this->findStudent($studentId);

        if (! is_array($student)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Student ledger not found.',
            ]);
        }

        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $amount = (float) ($payload['amount'] ?? 0);
        $mode = trim((string) ($payload['mode'] ?? 'Cash'));
        $remarks = trim((string) ($payload['remarks'] ?? ''));
        $receivedBy = trim((string) ($payload['receivedBy'] ?? 'Account Office'));

        if ($amount <= 0) {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'Please enter a valid payment amount.',
            ]);
        }

        $db = db_connect();
        $ledgerModel = new StudentLedgerEntryModel();
        $receiptModel = new FeeReceiptModel();

        $latestEntry = $ledgerModel
            ->where('student_id', $student['id'])
            ->orderBy('entry_date', 'DESC')
            ->orderBy('id', 'DESC')
            ->first();

        $currentBalance = (float) ($latestEntry['balance'] ?? 0);
        $newBalance = max(0, $currentBalance - $amount);
        $postedOn = date('Y-m-d');

        if (! empty($latestEntry['entry_date']) && (string) $latestEntry['entry_date'] > $postedOn) {
            $postedOn = (string) $latestEntry['entry_date'];
        }

        $institute = $db->table('institutes')
            ->select('receipt_prefix')
            ->where('id', $student['institute_id'])
            ->get()
            ->getRowArray();

        $receiptPrefix = $institute['receipt_prefix'] ?? 'RCPT';
        $receiptSequence = $receiptModel->where('institute_id', $student['institute_id'])->countAllResults() + 1;
        $receiptNumber = sprintf('%s-%04d', $receiptPrefix, $receiptSequence);
        $token = 'RCPT-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(4)));

        $db->transStart();

        $ledgerModel->insert([
            'student_id' => $student['id'],
            'institute_id' => $student['institute_id'],
            'academic_year_id' => $student['academic_year_id'],
            'entry_date' => $postedOn,
            'reference' => 'Fee receipt ' . $receiptNumber,
            'mode' => $mode,
            'debit' => 0,
            'credit' => $amount,
            'balance' => $newBalance,
            'note' => $remarks !== '' ? $remarks : 'Collected via fee counter',
        ]);

        $ledgerEntryId = (int) $ledgerModel->getInsertID();

        $receiptModel->insert([
            'student_id' => $student['id'],
            'ledger_entry_id' => $ledgerEntryId,
            'institute_id' => $student['institute_id'],
            'academic_year_id' => $student['academic_year_id'],
            'receipt_number' => $receiptNumber,
            'receipt_date' => $postedOn,
            'amount' => $amount,
            'payment_mode' => $mode,
            'received_by' => $receivedBy,
            'remarks' => $remarks,
            'verification_token' => $token,
        ]);

        $receipt = $receiptModel->find((int) $receiptModel->getInsertID());

        $db->transComplete();

        if (! $db->transStatus()) {
            return $this->response->setStatusCode(500)->setJSON([
                'message' => 'Unable to post the payment right now.',
            ]);
        }

        return $this->response->setJSON([
            'message' => 'Fee payment collected successfully.',
            'receipt' => $this->formatReceipt($receipt ?: []),
            'ledger' => $this->buildLedgerResponse($student),
        ]);
    }

    private function findStudent(string $studentId): ?array
    {
        $studentModel = new StudentModel();
        $student = $studentModel
            ->where('gr_number', $studentId)
            ->orWhere('id', $studentId)
            ->first();

        return is_array($student) ? $student : null;
    }

    private function buildLedgerResponse(array $student): array
    {
        $db = db_connect();
        $ledgerModel = new StudentLedgerEntryModel();
        $receiptModel = new FeeReceiptModel();

        $entries = $ledgerModel
            ->where('student_id', $student['id'])
            ->orderBy('entry_date', 'ASC')
            ->orderBy('id', 'ASC')
            ->findAll();

        $grossFee = (float) array_sum(array_map(static fn (array $entry): float => (float) $entry['debit'], $entries));
        $paidAmount = (float) array_sum(array_map(static fn (array $entry): float => (float) $entry['credit'], $entries));
        $outstandingAmount = (float) ($entries[count($entries) - 1]['balance'] ?? 0);

        $instituteName = $db->table('institutes')->select('name')->where('id', $student['institute_id'])->get()->getRowArray()['name'] ?? 'Institute';
        $academicYear = $db->table('academic_years')->select('label')->where('id', $student['academic_year_id'])->get()->getRowArray()['label'] ?? '2025-26';

        $receipts = $receiptModel
            ->where('student_id', $student['id'])
            ->orderBy('receipt_date', 'DESC')
            ->orderBy('id', 'DESC')
            ->findAll();

        return [
            'studentId' => $student['gr_number'],
            'studentName' => trim(($student['first_name'] ?? '') . ' ' . ($student['last_name'] ?? '')),
            'institute' => $instituteName,
            'academicYear' => $academicYear,
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
            'receipts' => array_map(fn (array $receipt): array => $this->formatReceipt($receipt), $receipts),
        ];
    }

    private function buildCounterSummary(?int $instituteId = null): array
    {
        $db = db_connect();
        $builder = $db->table('fee_receipts r')
            ->select('r.receipt_number, r.receipt_date, r.amount, r.payment_mode, r.received_by, r.remarks, r.verification_token, s.gr_number, s.first_name, s.last_name')
            ->join('students s', 's.id = r.student_id', 'left')
            ->orderBy('r.receipt_date', 'DESC')
            ->orderBy('r.id', 'DESC');

        if ($instituteId !== null) {
            $builder->where('r.institute_id', $instituteId);
        }

        $receipts = $builder->get()->getResultArray();
        $totalCollected = (float) array_sum(array_map(static fn (array $row): float => (float) ($row['amount'] ?? 0), $receipts));
        $cashCollected = (float) array_sum(array_map(static fn (array $row): float => (($row['payment_mode'] ?? '') === 'Cash') ? (float) ($row['amount'] ?? 0) : 0.0, $receipts));
        $digitalCollected = $totalCollected - $cashCollected;

        $studentBuilder = $db->table('students')->select('id');
        if ($instituteId !== null) {
            $studentBuilder->where('institute_id', $instituteId);
        }

        $studentIds = array_map(static fn (array $row): int => (int) $row['id'], $studentBuilder->get()->getResultArray());
        $pendingAmount = 0.0;

        foreach ($studentIds as $studentId) {
            $latest = $db->table('student_ledger_entries')
                ->select('balance')
                ->where('student_id', $studentId)
                ->orderBy('entry_date', 'DESC')
                ->orderBy('id', 'DESC')
                ->get()
                ->getRowArray();

            $pendingAmount += (float) ($latest['balance'] ?? 0);
        }

        return [
            'totalCollected' => $totalCollected,
            'receiptCount' => count($receipts),
            'cashCollected' => $cashCollected,
            'digitalCollected' => $digitalCollected,
            'pendingAmount' => $pendingAmount,
            'recentReceipts' => array_map(fn (array $row): array => $this->formatCounterReceipt($row), array_slice($receipts, 0, 8)),
        ];
    }

    private function formatReceipt(array $receipt): array
    {
        return [
            'receiptNumber' => $receipt['receipt_number'] ?? '',
            'receiptDate' => $receipt['receipt_date'] ?? '',
            'amount' => (float) ($receipt['amount'] ?? 0),
            'paymentMode' => $receipt['payment_mode'] ?? '',
            'receivedBy' => $receipt['received_by'] ?? null,
            'remarks' => $receipt['remarks'] ?? null,
            'verificationToken' => $receipt['verification_token'] ?? null,
        ];
    }

    private function formatCounterReceipt(array $receipt): array
    {
        return [
            'receiptNumber' => $receipt['receipt_number'] ?? '',
            'receiptDate' => $receipt['receipt_date'] ?? '',
            'amount' => (float) ($receipt['amount'] ?? 0),
            'paymentMode' => $receipt['payment_mode'] ?? '',
            'receivedBy' => $receipt['received_by'] ?? null,
            'studentName' => trim(($receipt['first_name'] ?? '') . ' ' . ($receipt['last_name'] ?? '')),
            'studentId' => $receipt['gr_number'] ?? '',
            'verificationToken' => $receipt['verification_token'] ?? null,
        ];
    }
}
