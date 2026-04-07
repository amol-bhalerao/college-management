<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class SettingsController extends BaseController
{
    public function app(): ResponseInterface
    {
        return $this->response->setJSON([
            'applicationName' => 'College Management Application',
            'organizationName' => 'Demo Education Trust',
            'defaultInstitute' => 'Junior College',
            'academicYear' => '2025-26',
            'features' => [
                'multi-institute',
                'theme-studio',
                'iqac-naac',
                'student-ledger',
                'qr-verification',
                'whatsapp-ready',
            ],
        ]);
    }

    public function theme(): ResponseInterface
    {
        return $this->response->setJSON([
            'theme' => [
                'primaryColor' => '#4f46e5',
                'secondaryColor' => '#0f172a',
                'accentColor' => '#14b8a6',
                'backgroundColor' => '#f4f7fb',
                'surfaceColor' => '#ffffff',
                'textColor' => '#0f172a',
                'headerStart' => '#1d4ed8',
                'headerEnd' => '#0f766e',
                'fontFamily' => 'Inter, sans-serif',
                'radius' => 18,
                'shadowStrength' => 18,
            ],
            'editableBy' => 'super-admin',
            'mode' => 'graphical-ui-only',
        ]);
    }
}
