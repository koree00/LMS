<?php

use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// ICT Coordinator: account provisioning
Route::middleware(['auth:sanctum', 'role:ict_coordinator'])
    ->prefix('admin')
    ->group(function () {
        Route::post('/users', [UserController::class, 'store']);
    });

// Staff: students in their section
Route::middleware(['auth:sanctum', 'role:teacher,sned_coordinator,ict_coordinator'])
    ->prefix('teacher')
    ->group(function () {
        Route::get('/ping', fn () => ['message' => 'Staff area OK']);
        Route::get('/students', [StudentController::class, 'index']);
    });

// Only teachers can add students to their classroom
Route::middleware(['auth:sanctum', 'role:teacher'])
    ->prefix('teacher')
    ->group(function () {
        Route::post('/students', [StudentController::class, 'store']);
    });