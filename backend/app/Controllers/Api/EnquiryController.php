<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\AdmissionModel;
use App\Models\EnquiryModel;
use CodeIgniter\HTTP\ResponseInterface;

class EnquiryController extends BaseController
{
    public function summary(?int $instituteId = null): ResponseInterface
    {
        $db = db_connect();
        $builder = $db->table('enquiries');

        if ($instituteId !== null) {
            $builder->where('institute_id', $instituteId);
        }

        $enquiries = $builder->get()->getResultArray();
        $total = count($enquiries);
        $converted = count(array_filter($enquiries, static fn (array $row): bool => ($row['status'] ?? '') === 'converted'));
        $newCount = count(array_filter($enquiries, static fn (array $row): bool => in_array(($row['status'] ?? ''), ['new', 'contacted'], true)));
        $followUp = count(array_filter($enquiries, static fn (array $row): bool => ($row['status'] ?? '') === 'follow-up'));

        return $this->response->setJSON([
            'total' => $total,
            'converted' => $converted,
            'new' => $newCount,
            'followUp' => $followUp,
            'conversionRate' => $total > 0 ? round(($converted / $total) * 100, 1) : 0,
        ]);
    }

    public function index(?int $instituteId = null): ResponseInterface
    {
        $model = new EnquiryModel();
        $builder = $model->orderBy('id', 'DESC');

        if ($instituteId !== null) {
            $builder->where('institute_id', $instituteId);
        }

        return $this->response->setJSON([
            'enquiries' => $builder->findAll(),
        ]);
    }

    public function convert(int $id): ResponseInterface
    {
        $enquiryModel = new EnquiryModel();
        $admissionModel = new AdmissionModel();

        $enquiry = $enquiryModel->find($id);

        if (! is_array($enquiry)) {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'Enquiry not found.']);
        }

        $existingAdmission = $admissionModel->where('enquiry_id', $id)->first();

        if (! is_array($existingAdmission)) {
            $admissionNumber = 'ADM-' . date('Y') . '-' . str_pad((string) ($id), 4, '0', STR_PAD_LEFT);

            $admissionModel->insert([
                'enquiry_id' => $id,
                'student_id' => null,
                'institute_id' => $enquiry['institute_id'],
                'academic_year_id' => $enquiry['academic_year_id'],
                'admission_number' => $admissionNumber,
                'status' => 'confirmed',
                'admitted_on' => date('Y-m-d'),
                'remarks' => 'Converted from enquiry via admissions dashboard.',
            ]);
        }

        $enquiryModel->update($id, ['status' => 'converted']);

        return $this->response->setJSON([
            'message' => 'Enquiry converted to admission successfully.',
            'enquiry' => $enquiryModel->find($id),
        ]);
    }
}
