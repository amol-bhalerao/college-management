<?php

namespace App\Models;

use CodeIgniter\Model;

class CertificateRequestModel extends Model
{
    protected $table = 'certificate_requests';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'student_id',
        'institute_id',
        'academic_year_id',
        'request_number',
        'certificate_type',
        'purpose',
        'status',
        'verification_token',
        'issued_on',
        'requested_by',
    ];
}
