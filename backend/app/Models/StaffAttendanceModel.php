<?php

namespace App\Models;

use CodeIgniter\Model;

class StaffAttendanceModel extends Model
{
    protected $table = 'staff_attendance';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'staff_id',
        'institute_id',
        'academic_year_id',
        'attendance_date',
        'status',
        'check_in_time',
        'check_out_time',
        'remarks',
    ];
}
