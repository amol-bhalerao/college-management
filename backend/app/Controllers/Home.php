<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index(): string
    {
        return <<<HTML
        <!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>College Management API</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 32px; background: #f4f7fb; color: #0f172a; }
                .card { max-width: 760px; margin: 0 auto; padding: 24px; background: #fff; border-radius: 16px; box-shadow: 0 16px 36px rgba(15,23,42,0.12); }
                code { background: #eef2ff; padding: 2px 6px; border-radius: 6px; }
                ul { line-height: 1.8; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>College Management API Foundation</h1>
                <p>The backend is now scaffolded for the multi-institute ERP and website application.</p>
                <ul>
                    <li><code>/api/health</code> — service health check</li>
                    <li><code>/api/settings/app</code> — app and institute settings</li>
                    <li><code>/api/settings/theme</code> — graphical theme profile payload</li>
                    <li><code>/api/verify/receipt/{token}</code> — QR/public receipt validation</li>
                    <li><code>/api/verify/certificate/{token}</code> — QR/public certificate validation</li>
                </ul>
            </div>
        </body>
        </html>
        HTML;
    }
}
