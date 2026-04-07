<?php

namespace App\Models;

use CodeIgniter\Model;

class ExamMarkModel extends Model
{
    protected $table = 'exam_marks';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'exam_id',
        'student_id',
        'obtained_marks',
        'grade',
        'result_status',
        'remarks',
    ];
}
