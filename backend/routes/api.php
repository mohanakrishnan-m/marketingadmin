<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\OpenTrackingController;
use App\Http\Controllers\Api\TestMailController;
use Illuminate\Support\Facades\Route;

// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::get('/track/open/{token}', OpenTrackingController::class);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Clients
    Route::get('/clients',       [ClientController::class, 'index']);
    Route::post('/clients',      [ClientController::class, 'store']);
    Route::get('/clients/{id}',  [ClientController::class, 'show']);
    Route::put('/clients/{id}',  [ClientController::class, 'update']);
    Route::delete('/clients/{id}', [ClientController::class, 'destroy']);

    // Templates
    Route::get('/templates',       [TemplateController::class, 'index']);
    Route::post('/templates',      [TemplateController::class, 'store']);
    Route::get('/templates/{id}',  [TemplateController::class, 'show']);
    Route::put('/templates/{id}',  [TemplateController::class, 'update']);
    Route::delete('/templates/{id}', [TemplateController::class, 'destroy']);

    // Campaigns
    Route::get('/campaigns',       [CampaignController::class, 'index']);
    Route::post('/campaigns',      [CampaignController::class, 'store']);
    Route::get('/campaigns/{id}',  [CampaignController::class, 'show']);
    Route::delete('/campaigns/{id}', [CampaignController::class, 'destroy']);

    // Settings
    Route::get('/settings',  [SettingController::class, 'show']);
    Route::put('/settings',  [SettingController::class, 'update']);

    // Mail test & debug
    Route::post('/mail/test',  [TestMailController::class, 'send']);
    Route::post('/mail/debug', [TestMailController::class, 'debug']);
});
