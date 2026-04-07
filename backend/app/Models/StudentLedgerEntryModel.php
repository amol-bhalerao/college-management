<?php

namespace App\Models;

use CodeIgniter\Model;

class StudentLedgerEntryModel extends Model
{
    protected $table = 'student_ledger_entries';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'student_id',
        'institute_id',
        'academic_year_id',
        'entry_date',
        'reference',
        'mode',
        'debit',
        'credit',
        'balance',
        'note',
    ];
}
