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
    $routes->get('enquiries/summary', 'Api\EnquiryController::summary');
    $routes->get('enquiries/summary/(:num)', 'Api\EnquiryController::summary/$1');
    $routes->get('enquiries', 'Api\EnquiryController::index');
    $routes->get('enquiries/(:num)', 'Api\EnquiryController::index/$1');
    $routes->post('enquiries/(:num)/convert', 'Api\EnquiryController::convert/$1');
    $routes->get('certificates/summary', 'Api\CertificateController::summary');
    $routes->get('certificates/summary/(:num)', 'Api\CertificateController::summary/$1');
    $routes->get('certificates/(:num)', 'Api\CertificateController::index/$1');
    $routes->post('certificates/(:num)/issue', 'Api\CertificateController::issue/$1');
    $routes->get('settings/app', 'Api\SettingsController::app');
    $routes->get('settings/theme', 'Api\SettingsController::theme');
    $routes->get('students/(:segment)/ledger', 'Api\StudentFinanceController::ledger/$1');
    $routes->post('students/(:segment)/collect', 'Api\StudentFinanceController::collect/$1');
    $routes->get('verify/receipt/(:segment)', 'Api\VerifyController::receipt/$1');
    $routes->get('verify/certificate/(:segment)', 'Api\VerifyController::certificate/$1');
});
