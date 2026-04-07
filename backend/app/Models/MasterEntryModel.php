<?php

namespace App\Models;

use CodeIgniter\Model;

class MasterEntryModel extends Model
{
    protected $table = 'master_entries';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'institute_id',
        'master_type',
        'code',
        'label',
        'description',
        'sort_order',
        'status',
        'meta_json',
    ];
}
