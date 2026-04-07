<?php

namespace App\Models;

use CodeIgniter\Model;

class StaffModel extends Model
{
    protected $table = 'staff_profiles';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'institute_id',
        'employee_code',
        'full_name',
        'department',
        'designation',
        'mobile_number',
        'email',
        'joining_date',
        'employment_type',
        'status',
    ];
}
