<?php

namespace App\Models;

use CodeIgniter\Model;

class ScholarshipApplicationModel extends Model
{
    protected $table = 'scholarship_applications';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'student_id',
        'institute_id',
        'academic_year_id',
        'scheme_name',
        'status',
        'is_eligible',
        'expected_amount',
    ];
}
