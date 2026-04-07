<?php

namespace App\Models;

use CodeIgniter\Model;

class QualityMetricModel extends Model
{
    protected $table = 'quality_metrics';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'institute_id',
        'academic_year_id',
        'criterion_code',
        'title',
        'owner',
        'target_value',
        'achieved_value',
        'status',
        'evidence_status',
        'next_review_date',
        'notes',
    ];
}
