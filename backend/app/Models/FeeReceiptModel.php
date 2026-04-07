<?php

namespace App\Models;

use CodeIgniter\Model;

class FeeReceiptModel extends Model
{
    protected $table = 'fee_receipts';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'student_id',
        'ledger_entry_id',
        'institute_id',
        'academic_year_id',
        'receipt_number',
        'receipt_date',
        'amount',
        'payment_mode',
        'received_by',
        'remarks',
        'verification_token',
    ];
}
