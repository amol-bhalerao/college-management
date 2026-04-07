<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', static function ($routes): void {
    $routes->get('health', 'Api\HealthController::index');
    $routes->post('auth/login', 'Api\AuthController::login');
    $routes->get('dashboard/summary', 'Api\DashboardController::summary');
    $routes->get('dashboard/summary/(:num)', 'Api\DashboardController::summary/$1');
    $routes->get('settings/app', 'Api\SettingsController::app');
    $routes->get('settings/theme', 'Api\SettingsController::theme');
    $routes->get('students/(:segment)/ledger', 'Api\StudentFinanceController::ledger/$1');
    $routes->get('verify/receipt/(:segment)', 'Api\VerifyController::receipt/$1');
    $routes->get('verify/certificate/(:segment)', 'Api\VerifyController::certificate/$1');
});
