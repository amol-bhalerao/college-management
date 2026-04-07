<?php

namespace App\Models;

use CodeIgniter\Model;

class StudentModel extends Model
{
    protected $table = 'students';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'institute_id',
        'academic_year_id',
        'gr_number',
        'first_name',
        'last_name',
        'guardian_name',
        'gender',
        'category',
        'current_class',
        'division',
        'mobile_number',
        'email',
        'dob',
        'address',
        'status',
        'admission_status',
    ];
}
