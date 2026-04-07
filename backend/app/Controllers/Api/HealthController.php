<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class HealthController extends BaseController
{
    public function index(): ResponseInterface
    {
        return $this->response->setJSON([
            'status' => 'ok',
            'application' => 'College Management API',
            'timestamp' => date(DATE_ATOM),
            'modules' => [
                'institutes',
                'admissions',
                'fees',
                'scholarship',
                'iqac',
                'theme-studio',
            ],
        ]);
    }
}
