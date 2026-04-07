<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class DashboardController extends BaseController
{
    public function summary(?int $instituteId = null): ResponseInterface
    {
        $db = db_connect();

        $targetBuilder = $db->table('dashboard_targets')->select('module, target, achieved, pending, owner, trend');
        $studentBuilder = $db->table('students');
        $eligibleBuilder = $db->table('scholarship_applications')->where('is_eligible', 1);
        $submittedBuilder = $db->table('scholarship_applications')->where('status !=', 'pending');

        if ($instituteId !== null) {
            $targetBuilder->where('institute_id', $instituteId);
            $studentBuilder->where('institute_id', $instituteId);
            $eligibleBuilder->where('institute_id', $instituteId);
            $submittedBuilder->where('institute_id', $instituteId);
        }

        return $this->response->setJSON([
            'totalStudents' => $studentBuilder->countAllResults(),
            'eligibleScholarships' => $eligibleBuilder->countAllResults(),
            'submittedScholarships' => $submittedBuilder->countAllResults(),
            'targets' => $targetBuilder->orderBy('id', 'ASC')->get()->getResultArray(),
        ]);
    }
}
