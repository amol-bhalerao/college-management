<?php

namespace App\Models;

use CodeIgniter\Model;

class AdmissionModel extends Model
{
    protected $table = 'admissions';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'enquiry_id',
        'student_id',
        'institute_id',
        'academic_year_id',
        'admission_number',
        'status',
        'admitted_on',
        'remarks',
    ];
}
