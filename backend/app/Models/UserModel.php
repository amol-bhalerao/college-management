<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'institute_id',
        'username',
        'full_name',
        'email',
        'role_code',
        'password_hash',
        'whatsapp_number',
        'status',
    ];
}
