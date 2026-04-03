<?php

$envOrigins = array_filter(array_map('trim', explode(',', (string) env('FRONTEND_URLS', ''))));

$defaultOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
];

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_values(array_unique(array_merge($defaultOrigins, $envOrigins, array_filter([
        env('FRONTEND_URL'),
        env('FRONTEND_URL_DEV'),
        env('FRONTEND_URL_PROD'),
    ])))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
