<?php

namespace App\Models;

use CodeIgniter\Model;

class InstituteModel extends Model
{
    protected $table = 'institutes';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'organization_id',
        'name',
        'code',
        'type',
        'contact_email',
        'contact_phone',
        'receipt_prefix',
        'header_title',
        'header_subtitle',
        'header_address',
        'principal_name',
        'footer_note',
        'website_url',
        'logo_url',
        'status',
    ];
}
