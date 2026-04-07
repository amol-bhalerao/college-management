<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\StaffAttendanceModel;
use App\Models\StaffModel;
use CodeIgniter\HTTP\ResponseInterface;

class StaffHrController extends BaseController
{
    public function summary(?int $instituteId = null): ResponseInterface
    {
        $date = $this->resolveDate((string) ($this->request->getGet('date') ?? ''));
        $staffBuilder = db_connect()->table('staff_profiles');

        if ($instituteId !== null) {
            $staffBuilder->where('institute_id', $instituteId);
        }

        $staffRows = $staffBuilder->get()->getResultArray();
        $attendanceBuilder = db_connect()->table('staff_attendance')->where('attendance_date', $date);

        if ($instituteId !== null) {
            $attendanceBuilder->where('institute_id', $instituteId);
        }

        $attendanceRows = $attendanceBuilder->get()->getResultArray();

        return $this->response->setJSON([
            'totalStaff' => count($staffRows),
            'activeStaff' => count(array_filter($staffRows, static fn (array $row): bool => (string) ($row['status'] ?? 'active') === 'active')),
            'presentToday' => count(array_filter($attendanceRows, static fn (array $row): bool => in_array((string) ($row['status'] ?? ''), ['present', 'half-day', 'on-duty'], true))),
            'onLeave' => count(array_filter($attendanceRows, static fn (array $row): bool => (string) ($row['status'] ?? '') === 'leave')),
            'absentToday' => count(array_filter($attendanceRows, static fn (array $row): bool => (string) ($row['status'] ?? '') === 'absent')),
        ]);
    }

    public function index(?int $instituteId = null): ResponseInterface
    {
        $db = db_connect();
        $date = $this->resolveDate((string) ($this->request->getGet('date') ?? ''));
        $builder = $db->table('staff_profiles sp')
            ->select('sp.id, sp.institute_id, sp.employee_code, sp.full_name, sp.department, sp.designation, sp.mobile_number, sp.email, sp.joining_date, sp.employment_type, sp.status, sa.id AS attendance_id, sa.academic_year_id, sa.attendance_date, sa.status AS attendance_status, sa.check_in_time, sa.check_out_time, sa.remarks')
            ->join('staff_attendance sa', 'sa.staff_id = sp.id AND sa.attendance_date = ' . $db->escape($date), 'left', false)
            ->orderBy('sp.id', 'DESC');

        if ($instituteId !== null) {
            $builder->where('sp.institute_id', $instituteId);
        }

        return $this->response->setJSON([
            'staff' => $builder->get()->getResultArray(),
        ]);
    }

    public function create(): ResponseInterface
    {
        $model = new StaffModel();
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $instituteId = (int) ($payload['institute_id'] ?? 1);
        $fullName = trim((string) ($payload['full_name'] ?? ''));

        if ($fullName === '') {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'Staff name is required.',
            ]);
        }

        $employeeCode = trim((string) ($payload['employee_code'] ?? ''));
        if ($employeeCode === '') {
            $employeeCode = $this->generateEmployeeCode($instituteId);
        }

        $existing = $model->where('employee_code', $employeeCode)->first();
        if (is_array($existing)) {
            return $this->response->setStatusCode(409)->setJSON([
                'message' => 'Another staff profile already uses this employee code.',
            ]);
        }

        $insertId = $model->insert([
            'institute_id' => $instituteId,
            'employee_code' => $employeeCode,
            'full_name' => $fullName,
            'department' => trim((string) ($payload['department'] ?? '')),
            'designation' => trim((string) ($payload['designation'] ?? '')),
            'mobile_number' => trim((string) ($payload['mobile_number'] ?? '')),
            'email' => trim((string) ($payload['email'] ?? '')),
            'joining_date' => ($payload['joining_date'] ?? '') !== '' ? (string) $payload['joining_date'] : null,
            'employment_type' => trim((string) ($payload['employment_type'] ?? 'full-time')) ?: 'full-time',
            'status' => trim((string) ($payload['status'] ?? 'active')) ?: 'active',
        ], true);

        return $this->response->setStatusCode(201)->setJSON([
            'message' => 'Staff profile created successfully.',
            'staff' => $model->find($insertId),
        ]);
    }

    public function update(int $id): ResponseInterface
    {
        $model = new StaffModel();
        $staff = $model->find($id);

        if (! is_array($staff)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Staff profile not found.',
            ]);
        }

        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $updates = [];

        foreach (['employee_code', 'full_name', 'department', 'designation', 'mobile_number', 'email', 'employment_type', 'status'] as $field) {
            if (isset($payload[$field])) {
                $updates[$field] = trim((string) $payload[$field]);
            }
        }

        if (array_key_exists('joining_date', $payload)) {
            $updates['joining_date'] = ($payload['joining_date'] ?? '') !== '' ? (string) $payload['joining_date'] : null;
        }

        if (isset($updates['employee_code']) && $updates['employee_code'] !== '') {
            $existing = $model->where('employee_code', $updates['employee_code'])->where('id !=', $id)->first();
            if (is_array($existing)) {
                return $this->response->setStatusCode(409)->setJSON([
                    'message' => 'Another staff profile already uses this employee code.',
                ]);
            }
        }

        if ($updates === []) {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'No staff changes were provided.',
            ]);
        }

        $model->update($id, $updates);

        return $this->response->setJSON([
            'message' => 'Staff profile updated successfully.',
            'staff' => $model->find($id),
        ]);
    }

    public function delete(int $id): ResponseInterface
    {
        $model = new StaffModel();
        $staff = $model->find($id);

        if (! is_array($staff)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Staff profile not found.',
            ]);
        }

        $hasAttendance = db_connect()->table('staff_attendance')->where('staff_id', $id)->countAllResults() > 0;
        if ($hasAttendance) {
            return $this->response->setStatusCode(409)->setJSON([
                'message' => 'Attendance entries already exist for this staff member. Mark the profile inactive instead of deleting it.',
            ]);
        }

        $model->delete($id);

        return $this->response->setJSON([
            'message' => 'Staff profile deleted successfully.',
        ]);
    }

    public function saveAttendance(): ResponseInterface
    {
        $attendanceModel = new StaffAttendanceModel();
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $staffId = (int) ($payload['staff_id'] ?? 0);
        $attendanceDate = $this->resolveDate((string) ($payload['attendance_date'] ?? ''));

        if ($staffId <= 0) {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'Please select a staff member first.',
            ]);
        }

        $staff = db_connect()->table('staff_profiles')
            ->select('id, institute_id')
            ->where('id', $staffId)
            ->get()
            ->getRowArray();

        if (! is_array($staff)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Staff profile not found.',
            ]);
        }

        $attendanceState = trim((string) ($payload['status'] ?? 'present')) ?: 'present';
        $data = [
            'staff_id' => $staffId,
            'institute_id' => (int) $staff['institute_id'],
            'academic_year_id' => $this->resolveAcademicYearId((int) $staff['institute_id']),
            'attendance_date' => $attendanceDate,
            'status' => $attendanceState,
            'check_in_time' => trim((string) ($payload['check_in_time'] ?? '')) ?: null,
            'check_out_time' => trim((string) ($payload['check_out_time'] ?? '')) ?: null,
            'remarks' => trim((string) ($payload['remarks'] ?? '')),
        ];

        $existing = $attendanceModel->where('staff_id', $staffId)->where('attendance_date', $attendanceDate)->first();

        if (is_array($existing)) {
            $attendanceModel->update((int) $existing['id'], $data);
            $attendanceId = (int) $existing['id'];
            $message = 'Attendance updated successfully.';
        } else {
            $attendanceId = (int) $attendanceModel->insert($data, true);
            $message = 'Attendance marked successfully.';
        }

        return $this->response->setJSON([
            'message' => $message,
            'attendance' => $attendanceModel->find($attendanceId),
        ]);
    }

    private function resolveAcademicYearId(int $instituteId): int
    {
        $row = db_connect()->table('academic_years')
            ->select('id')
            ->where('institute_id', $instituteId)
            ->orderBy('is_current', 'DESC')
            ->orderBy('id', 'DESC')
            ->get()
            ->getRowArray();

        return (int) ($row['id'] ?? 1);
    }

    private function generateEmployeeCode(int $instituteId): string
    {
        $db = db_connect();
        $instituteCode = $db->table('institutes')->select('code')->where('id', $instituteId)->get()->getRowArray()['code'] ?? 'STF';
        $sequence = $db->table('staff_profiles')->where('institute_id', $instituteId)->countAllResults() + 1;

        return sprintf('%s-STF-%03d', strtoupper($instituteCode), $sequence);
    }

    private function resolveDate(string $date): string
    {
        return $date !== '' ? $date : date('Y-m-d');
    }
}
