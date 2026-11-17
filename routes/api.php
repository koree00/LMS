<?php

use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\StudentAuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\StudentLearningController;
use App\Models\Subject;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/student-login', [StudentAuthController::class, 'login'])->middleware('throttle:60,1');

    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

    Route::get('/me', [AuthController::class, 'me'])
        ->middleware(['auth:sanctum', 'role:teacher,sned_coordinator,ict_coordinator,principal,parent']);
});

// Any logged-in user (staff or student) can see the subject list
Route::get('/subjects', fn () => Subject::orderBy('name')->get(['id', 'name']))
    ->middleware('auth:sanctum');

// Student area
Route::middleware(['auth:sanctum', 'student'])
    ->prefix('student')
    ->group(function () {
        Route::get('/me', [StudentAuthController::class, 'me']);

        Route::get('/lessons', [StudentLearningController::class, 'lessons']);
        Route::get('/levels/{level}/activities', [StudentLearningController::class, 'activities']);
        Route::post('/activities/{activity}/answer', [StudentLearningController::class, 'answer']);
    });

// ICT coordinator: account provisioning
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

// Teachers only: students and lessons
Route::middleware(['auth:sanctum', 'role:teacher'])
    ->prefix('teacher')
    ->group(function () {
        Route::post('/students', [StudentController::class, 'store']);

        Route::get('/lessons', [LessonController::class, 'index']);
        Route::post('/lessons', [LessonController::class, 'store']);
        Route::post('/lessons/{id}/approve', [LessonController::class, 'approve']);
    });

// Teachers and ICT: reset a student's PIN
Route::middleware(['auth:sanctum', 'role:teacher,ict_coordinator'])
    ->prefix('teacher')
    ->group(function () {
        Route::post('/students/{id}/reset-pin', [StudentController::class, 'resetPin']);
    });