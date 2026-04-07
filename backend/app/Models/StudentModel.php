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
        'mother_name',
        'gender',
        'category',
        'nationality',
        'religion',
        'caste_subcaste',
        'current_class',
        'division',
        'mobile_number',
        'email',
        'dob',
        'date_of_birth_words',
        'place_of_birth',
        'birth_taluka',
        'birth_district',
        'birth_state',
        'previous_school',
        'date_of_admission',
        'date_of_leaving',
        'class_last_attended',
        'progress_status',
        'conduct',
        'reason_for_leaving',
        'tc_remarks',
        'address',
        'status',
        'admission_status',
    ];
}
