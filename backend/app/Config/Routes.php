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
