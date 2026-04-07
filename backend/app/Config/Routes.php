<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', static function ($routes): void {
    $routes->options('(:any)', static fn () => service('response')->setStatusCode(204));
    $routes->options('(:any)/(:any)', static fn () => service('response')->setStatusCode(204));
    $routes->options('(:any)/(:any)/(:any)', static fn () => service('response')->setStatusCode(204));

    $routes->get('health', 'Api\HealthController::index');
    $routes->post('auth/login', 'Api\AuthController::login');
    $routes->get('dashboard/summary', 'Api\DashboardController::summary');
    $routes->get('dashboard/summary/(:num)', 'Api\DashboardController::summary/$1');
    $routes->get('institutes', 'Api\InstituteController::index');
    $routes->get('institutes/(:num)/settings', 'Api\InstituteController::settings/$1');
    $routes->put('institutes/(:num)/settings', 'Api\InstituteController::updateSettings/$1');
    $routes->get('users', 'Api\UserManagementController::index');
    $routes->post('users', 'Api\UserManagementController::create');
    $routes->put('users/(:num)', 'Api\UserManagementController::update/$1');
    $routes->delete('users/(:num)', 'Api\UserManagementController::delete/$1');
    $routes->get('enquiries/summary', 'Api\EnquiryController::summary');
    $routes->get('enquiries/summary/(:num)', 'Api\EnquiryController::summary/$1');
    $routes->get('enquiries', 'Api\EnquiryController::index');
    $routes->get('enquiries/(:num)', 'Api\EnquiryController::index/$1');
    $routes->post('enquiries', 'Api\EnquiryController::create');
    $routes->put('enquiries/(:num)', 'Api\EnquiryController::update/$1');
    $routes->delete('enquiries/(:num)', 'Api\EnquiryController::delete/$1');
    $routes->post('enquiries/(:num)/convert', 'Api\EnquiryController::convert/$1');
    $routes->get('admissions/recent', 'Api\EnquiryController::recentAdmissions');
    $routes->get('admissions/recent/(:num)', 'Api\EnquiryController::recentAdmissions/$1');
    $routes->post('admissions/wizard', 'Api\EnquiryController::admitStudent');
    $routes->get('certificates/summary', 'Api\CertificateController::summary');
    $routes->get('certificates/summary/(:num)', 'Api\CertificateController::summary/$1');
    $routes->get('certificates/students/(:num)', 'Api\CertificateController::students/$1');
    $routes->get('certificates/(:num)', 'Api\CertificateController::index/$1');
    $routes->post('certificates', 'Api\CertificateController::create');
    $routes->put('certificates/(:num)', 'Api\CertificateController::update/$1');
    $routes->delete('certificates/(:num)', 'Api\CertificateController::delete/$1');
    $routes->post('certificates/(:num)/issue', 'Api\CertificateController::issue/$1');
    $routes->get('scholarships/summary', 'Api\ScholarshipController::summary');
    $routes->get('scholarships/summary/(:num)', 'Api\ScholarshipController::summary/$1');
    $routes->get('scholarships/(:num)', 'Api\ScholarshipController::index/$1');
    $routes->post('scholarships', 'Api\ScholarshipController::create');
    $routes->put('scholarships/(:num)', 'Api\ScholarshipController::update/$1');
    $routes->delete('scholarships/(:num)', 'Api\ScholarshipController::delete/$1');
    $routes->get('masters/summary/(:num)', 'Api\MasterDataController::summary/$1');
    $routes->get('masters/(:num)', 'Api\MasterDataController::index/$1');
    $routes->get('masters/options/(:num)', 'Api\MasterDataController::options/$1');
    $routes->post('masters', 'Api\MasterDataController::create');
    $routes->put('masters/(:num)', 'Api\MasterDataController::update/$1');
    $routes->delete('masters/(:num)', 'Api\MasterDataController::delete/$1');
    $routes->get('staff/summary/(:num)', 'Api\StaffHrController::summary/$1');
    $routes->get('staff/(:num)', 'Api\StaffHrController::index/$1');
    $routes->post('staff', 'Api\StaffHrController::create');
    $routes->put('staff/(:num)', 'Api\StaffHrController::update/$1');
    $routes->delete('staff/(:num)', 'Api\StaffHrController::delete/$1');
    $routes->post('staff/attendance', 'Api\StaffHrController::saveAttendance');
    $routes->get('exams/summary/(:num)', 'Api\ExamResultController::summary/$1');
    $routes->get('exams/(:num)', 'Api\ExamResultController::index/$1');
    $routes->get('exams/marks/(:num)', 'Api\ExamResultController::marks/$1');
    $routes->post('exams', 'Api\ExamResultController::create');
    $routes->put('exams/(:num)', 'Api\ExamResultController::update/$1');
    $routes->delete('exams/(:num)', 'Api\ExamResultController::delete/$1');
    $routes->post('exams/marks', 'Api\ExamResultController::saveMark');
    $routes->get('iqac/summary', 'Api\QualityTrackerController::summary');
    $routes->get('iqac/summary/(:num)', 'Api\QualityTrackerController::summary/$1');
    $routes->get('iqac/(:num)', 'Api\QualityTrackerController::index/$1');
    $routes->post('iqac', 'Api\QualityTrackerController::create');
    $routes->put('iqac/(:num)', 'Api\QualityTrackerController::update/$1');
    $routes->delete('iqac/(:num)', 'Api\QualityTrackerController::delete/$1');
    $routes->get('website/pages/(:num)', 'Api\WebsiteController::pages/$1');
    $routes->post('website/pages', 'Api\WebsiteController::create');
    $routes->put('website/pages/(:num)', 'Api\WebsiteController::update/$1');
    $routes->delete('website/pages/(:num)', 'Api\WebsiteController::delete/$1');
    $routes->get('public/site/(:segment)', 'Api\WebsiteController::publicSite/$1');
    $routes->get('settings/app', 'Api\SettingsController::app');
    $routes->get('settings/theme', 'Api\SettingsController::theme');
    $routes->get('fees/summary', 'Api\StudentFinanceController::counterSummary');
    $routes->get('fees/summary/(:num)', 'Api\StudentFinanceController::counterSummary/$1');
    $routes->get('students/master', 'Api\StudentController::index');
    $routes->get('students/master/(:num)', 'Api\StudentController::index/$1');
    $routes->post('students/master', 'Api\StudentController::create');
    $routes->put('students/master/(:num)', 'Api\StudentController::update/$1');
    $routes->delete('students/master/(:num)', 'Api\StudentController::delete/$1');
    $routes->get('students/(:segment)/ledger', 'Api\StudentFinanceController::ledger/$1');
    $routes->post('students/(:segment)/collect', 'Api\StudentFinanceController::collect/$1');
    $routes->get('verify/receipt/(:segment)', 'Api\VerifyController::receipt/$1');
    $routes->get('verify/certificate/(:segment)', 'Api\VerifyController::certificate/$1');
});
