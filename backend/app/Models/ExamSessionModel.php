<?php

namespace App\Models;

use CodeIgniter\Model;

class ExamSessionModel extends Model
{
    protected $table = 'exam_sessions';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'institute_id',
        'academic_year_id',
        'exam_name',
        'class_name',
        'subject_name',
        'max_marks',
        'exam_date',
        'status',
    ];
}
