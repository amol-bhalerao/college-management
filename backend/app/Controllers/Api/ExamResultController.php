<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\ExamMarkModel;
use App\Models\ExamSessionModel;
use CodeIgniter\HTTP\ResponseInterface;

class ExamResultController extends BaseController
{
    public function summary(?int $instituteId = null): ResponseInterface
    {
        $examBuilder = db_connect()->table('exam_sessions');
        if ($instituteId !== null) {
            $examBuilder->where('institute_id', $instituteId);
        }
        $examRows = $examBuilder->get()->getResultArray();

        $markBuilder = db_connect()->table('exam_marks em')
            ->select('em.result_status')
            ->join('exam_sessions es', 'es.id = em.exam_id', 'left');

        if ($instituteId !== null) {
            $markBuilder->where('es.institute_id', $instituteId);
        }

        $markRows = $markBuilder->get()->getResultArray();
        $passed = count(array_filter($markRows, static fn (array $row): bool => (string) ($row['result_status'] ?? '') === 'pass'));
        $marksCount = count($markRows);

        return $this->response->setJSON([
            'totalExams' => count($examRows),
            'publishedResults' => count(array_filter($examRows, static fn (array $row): bool => (string) ($row['status'] ?? '') === 'published')),
            'draftResults' => count(array_filter($examRows, static fn (array $row): bool => (string) ($row['status'] ?? '') !== 'published')),
            'marksEntered' => $marksCount,
            'passPercentage' => $marksCount > 0 ? round(($passed * 100) / $marksCount, 1) : 0,
        ]);
    }

    public function index(?int $instituteId = null): ResponseInterface
    {
        $builder = db_connect()->table('exam_sessions es')
            ->select("es.id, es.institute_id, es.academic_year_id, es.exam_name, es.class_name, es.subject_name, es.max_marks, es.exam_date, es.status, i.name AS institute_name, COUNT(em.id) AS marks_entered, SUM(CASE WHEN em.result_status = 'pass' THEN 1 ELSE 0 END) AS pass_count, COALESCE(ROUND(AVG(em.obtained_marks), 2), 0) AS average_score", false)
            ->join('institutes i', 'i.id = es.institute_id', 'left')
            ->join('exam_marks em', 'em.exam_id = es.id', 'left')
            ->groupBy('es.id, es.institute_id, es.academic_year_id, es.exam_name, es.class_name, es.subject_name, es.max_marks, es.exam_date, es.status, i.name')
            ->orderBy('es.id', 'DESC');

        if ($instituteId !== null) {
            $builder->where('es.institute_id', $instituteId);
        }

        return $this->response->setJSON([
            'exams' => $builder->get()->getResultArray(),
        ]);
    }

    public function marks(int $examId): ResponseInterface
    {
        $exam = db_connect()->table('exam_sessions')->where('id', $examId)->get()->getRowArray();

        if (! is_array($exam)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Exam session not found.',
            ]);
        }

        $marks = db_connect()->table('exam_marks em')
            ->select('em.id, em.exam_id, em.student_id, em.obtained_marks, em.grade, em.result_status, em.remarks, s.gr_number, s.first_name, s.last_name, s.current_class, s.division')
            ->join('students s', 's.id = em.student_id', 'left')
            ->where('em.exam_id', $examId)
            ->orderBy('s.gr_number', 'ASC')
            ->get()
            ->getResultArray();

        return $this->response->setJSON([
            'exam' => $exam,
            'marks' => $marks,
        ]);
    }

    public function create(): ResponseInterface
    {
        $model = new ExamSessionModel();
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $instituteId = (int) ($payload['institute_id'] ?? 1);
        $examName = trim((string) ($payload['exam_name'] ?? ''));
        $className = trim((string) ($payload['class_name'] ?? ''));
        $subjectName = trim((string) ($payload['subject_name'] ?? ''));

        if ($examName === '' || $className === '' || $subjectName === '') {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'Exam name, class, and subject are required.',
            ]);
        }

        $insertId = $model->insert([
            'institute_id' => $instituteId,
            'academic_year_id' => $this->resolveAcademicYearId($instituteId, isset($payload['academic_year_id']) ? (int) $payload['academic_year_id'] : null),
            'exam_name' => $examName,
            'class_name' => $className,
            'subject_name' => $subjectName,
            'max_marks' => (float) ($payload['max_marks'] ?? 100),
            'exam_date' => ($payload['exam_date'] ?? '') !== '' ? (string) $payload['exam_date'] : null,
            'status' => trim((string) ($payload['status'] ?? 'draft')) ?: 'draft',
        ], true);

        return $this->response->setStatusCode(201)->setJSON([
            'message' => 'Exam session created successfully.',
            'exam' => $model->find($insertId),
        ]);
    }

    public function update(int $id): ResponseInterface
    {
        $model = new ExamSessionModel();
        $exam = $model->find($id);

        if (! is_array($exam)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Exam session not found.',
            ]);
        }

        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $updates = [];

        foreach (['exam_name', 'class_name', 'subject_name', 'status'] as $field) {
            if (isset($payload[$field])) {
                $updates[$field] = trim((string) $payload[$field]);
            }
        }

        if (isset($payload['max_marks'])) {
            $updates['max_marks'] = (float) $payload['max_marks'];
        }

        if (array_key_exists('exam_date', $payload)) {
            $updates['exam_date'] = ($payload['exam_date'] ?? '') !== '' ? (string) $payload['exam_date'] : null;
        }

        if (isset($payload['academic_year_id']) || isset($payload['institute_id'])) {
            $updates['academic_year_id'] = $this->resolveAcademicYearId(
                isset($payload['institute_id']) ? (int) $payload['institute_id'] : (int) $exam['institute_id'],
                isset($payload['academic_year_id']) ? (int) $payload['academic_year_id'] : (int) $exam['academic_year_id'],
            );
        }

        if ($updates === []) {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'No exam changes were provided.',
            ]);
        }

        $model->update($id, $updates);

        return $this->response->setJSON([
            'message' => 'Exam session updated successfully.',
            'exam' => $model->find($id),
        ]);
    }

    public function delete(int $id): ResponseInterface
    {
        $model = new ExamSessionModel();
        $exam = $model->find($id);

        if (! is_array($exam)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Exam session not found.',
            ]);
        }

        $hasMarks = db_connect()->table('exam_marks')->where('exam_id', $id)->countAllResults() > 0;
        if ($hasMarks) {
            return $this->response->setStatusCode(409)->setJSON([
                'message' => 'Marks are already entered for this exam. Clear the result register first or keep the exam as published.',
            ]);
        }

        $model->delete($id);

        return $this->response->setJSON([
            'message' => 'Exam session deleted successfully.',
        ]);
    }

    public function saveMark(): ResponseInterface
    {
        $markModel = new ExamMarkModel();
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $examId = (int) ($payload['exam_id'] ?? 0);
        $studentId = (int) ($payload['student_id'] ?? 0);

        if ($examId <= 0 || $studentId <= 0) {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'Exam and student are required to save marks.',
            ]);
        }

        $exam = db_connect()->table('exam_sessions')
            ->select('id, max_marks')
            ->where('id', $examId)
            ->get()
            ->getRowArray();

        if (! is_array($exam)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Exam session not found.',
            ]);
        }

        $student = db_connect()->table('students')
            ->select('id')
            ->where('id', $studentId)
            ->get()
            ->getRowArray();

        if (! is_array($student)) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => 'Student record not found.',
            ]);
        }

        $maxMarks = (float) ($exam['max_marks'] ?? 100);
        $obtainedMarks = (float) ($payload['obtained_marks'] ?? 0);

        if ($obtainedMarks > $maxMarks) {
            return $this->response->setStatusCode(422)->setJSON([
                'message' => 'Obtained marks cannot be greater than the exam max marks.',
            ]);
        }

        $resultStatus = trim((string) ($payload['result_status'] ?? ''));
        if ($resultStatus === '') {
            $resultStatus = $obtainedMarks >= ($maxMarks * 0.35) ? 'pass' : 'fail';
        }

        $grade = trim((string) ($payload['grade'] ?? ''));
        if ($resultStatus === 'absent') {
            $grade = 'AB';
            $obtainedMarks = 0;
        } elseif ($grade === '') {
            $percentage = $maxMarks > 0 ? ($obtainedMarks / $maxMarks) * 100 : 0;
            $grade = $this->calculateGrade($percentage);
        }

        $data = [
            'exam_id' => $examId,
            'student_id' => $studentId,
            'obtained_marks' => $obtainedMarks,
            'grade' => $grade,
            'result_status' => $resultStatus,
            'remarks' => trim((string) ($payload['remarks'] ?? '')),
        ];

        $existing = $markModel->where('exam_id', $examId)->where('student_id', $studentId)->first();

        if (is_array($existing)) {
            $markModel->update((int) $existing['id'], $data);
            $markId = (int) $existing['id'];
            $message = 'Marks updated successfully.';
        } else {
            $markId = (int) $markModel->insert($data, true);
            $message = 'Marks saved successfully.';
        }

        return $this->response->setJSON([
            'message' => $message,
            'mark' => $markModel->find($markId),
        ]);
    }

    private function resolveAcademicYearId(int $instituteId, ?int $academicYearId = null): int
    {
        if (($academicYearId ?? 0) > 0) {
            return (int) $academicYearId;
        }

        $row = db_connect()->table('academic_years')
            ->select('id')
            ->where('institute_id', $instituteId)
            ->orderBy('is_current', 'DESC')
            ->orderBy('id', 'DESC')
            ->get()
            ->getRowArray();

        return (int) ($row['id'] ?? 1);
    }

    private function calculateGrade(float $percentage): string
    {
        if ($percentage >= 75) {
            return 'A+';
        }

        if ($percentage >= 60) {
            return 'A';
        }

        if ($percentage >= 50) {
            return 'B+';
        }

        if ($percentage >= 40) {
            return 'B';
        }

        if ($percentage >= 35) {
            return 'C';
        }

        return 'F';
    }
}
