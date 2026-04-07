<?php

namespace App\Models;

use CodeIgniter\Model;

class EnquiryModel extends Model
{
    protected $table = 'enquiries';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'institute_id',
        'academic_year_id',
        'enquiry_number',
        'student_name',
        'mobile_number',
        'email',
        'source',
        'desired_course',
        'current_class',
        'category',
        'status',
        'assigned_to',
        'follow_up_date',
        'notes',
    ];
}
