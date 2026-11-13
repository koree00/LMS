<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\AdminReportController;



// ICT Portal Routes (Protected by auth and IT/admin role middleware as needed)
Route::middleware(['auth'])->prefix('it')->group(function () {
    
    // Overview / Dashboard
    Route::get('/overview', function () {
        return Inertia::render('ICTOverview');
    })->name('it.overview');

    // Accounts & User Management / Invitations
    Route::get('/accounts', function () {
        return Inertia::render('ICTInviteUser');
    })->name('it.accounts');

    Route::post('/accounts', [\App\Http\Controllers\ICT\AccountController::class, 'store'])
        ->name('it.accounts.store');

    // Security Settings
    Route::get('/security', function () {
        return Inertia::render('ICTSecurity');
    })->name('it.security');

    Route::post('/security', [\App\Http\Controllers\ICT\SecurityController::class, 'update'])
        ->name('it.security.update');

    // Activity Log
    Route::get('/activity-log', function () {
        return Inertia::render('ICTActivityLog');
    })->name('it.activity-log');
});

/*
|--------------------------------------------------------------------------
| IT & Infrastructure Portal Routes
|--------------------------------------------------------------------------
*/
Route::prefix('it')->name('it.')->group(function () {
    // Pointing to IT/ITOverview inside resources/js/Pages/IT/
    Route::get('/overview', function () {
        return Inertia::render('IT/ITOverview', [
            'stats' => [
                'serviceHealth' => '99.8%',
                'activeAccounts' => 260,
                'pendingInvites' => 12,
                'accessAlerts' => 2,
                'lastBackupTime' => 'Today · 2:00 AM · Complete',
            ],
            'roleStats' => [
                ['role' => 'Students (Grade 1 / SNED)', 'accounts' => 115, 'accessScope' => 'Gamified learning paths & telemetry'],
                ['role' => 'Inclusive teachers', 'accounts' => 24, 'accessScope' => 'Classes and lessons'],
                ['role' => 'SNED coordinators', 'accounts' => 4, 'accessScope' => 'Validation and trends'],
                ['role' => 'Principals', 'accounts' => 2, 'accessScope' => 'School reports'],
                ['role' => 'Parents / guardians', 'accounts' => 115, 'accessScope' => 'Approved progress only'],
            ]
        ]);
    })->name('overview');
    
    // Pointing to IT/ICTInviteUser inside resources/js/Pages/IT/
    Route::get('/accounts', fn () => Inertia::render('IT/ICTInviteUser'))->name('accounts');
    
    // Handle invitation form post
    Route::post('/accounts', function (Request $request) {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'role' => ['required', 'string'],
            'access_scope' => ['required', 'string'],
        ]);

        return redirect()->back()->with('success', 'Invitation sent successfully.');
    })->name('accounts.store');

    Route::get('/network', fn () => Inertia::render('IT/ITNetwork'))->name('network');
    Route::get('/security', fn () => Inertia::render('IT/ICTSecurity'))->name('security');
    // Activity Log Route
    Route::get('/activity-log', fn () => Inertia::render('IT/ICTActivityLog'))->name('activity-log');
    Route::get('/account-settings', fn () => Inertia::render('IT/ICTAccountSettings'))->name('account-settings');
    Route::get('/messages', fn () => Inertia::render('IT/ICTMessages'))->name('messages');

});
/*
|--------------------------------------------------------------------------
| Authentication & Landing Routes
|--------------------------------------------------------------------------
*/

Route::inertia('/', 'Auth/Login')->name('login');
Route::inertia('/login', 'Auth/Login')->name('login');

// Handle Unified Staff & Workspace Login (POST)
Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (Auth::attempt($credentials, $request->boolean('remember'))) {
        $request->session()->regenerate();
        
        $user = Auth::user();
        return match($user->role ?? 'teacher') {
            'teacher' => redirect()->route('teacher.overview'),
            'admin' => redirect()->route('admin.overview'),
            'sned' => redirect()->route('sned.overview'),
            'parent' => redirect()->route('parent.overview'),
            'it' => redirect()->route('it.overview'),
            default => redirect()->route('teacher.overview')
        };
    }

    return back()->withErrors([
        'email' => 'The provided credentials do not match our records.',
    ]);
})->name('login.store');

// Handle Logout
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect()->route('login');
})->name('logout');

// Student Portal Dedicated PIN/Name Login
Route::inertia('/student/login', 'Auth/StudentLogin')->name('student.login');
Route::post('/student/login', function (Request $request) {
    $request->validate([
        'student_name' => ['required', 'string'],
        'pin' => ['required', 'string', 'size:4'],
    ]);

    return redirect()->route('student.dashboard');
})->name('student.login.store');

// Forgot Password Flow
Route::inertia('/forgot-password', 'Auth/ForgotPassword')->name('password.request');
Route::post('/forgot-password', function (Request $request) {
    $request->validate([
        'email' => ['required', 'email'],
    ]);

    return redirect()->route('password.status');
});
Route::inertia('/forgot-password/status', 'Auth/ForgotPasswordStatus')->name('password.status');

// Account Activation Flow
Route::inertia('/activate-account', 'Auth/ActivateAccount')->name('account.activate');
Route::post('/activate-account', function (Request $request) {
    $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required', 'string', 'min:8', 'confirmed'],
    ]);

    return redirect()->route('login')->with('success', 'Account activated successfully!');
});

// Account Verification Flow (6-digit PIN)
Route::inertia('/verify-account', 'Auth/VerifyAccount')->name('verification.notice');
Route::post('/verify-account', function (Request $request) {
    $request->validate([
        'code' => ['required', 'string', 'size:6'],
    ]);

    return redirect()->route('student.dashboard');
});

// Password Reset Flow
Route::inertia('/reset-password', 'Auth/ResetPassword')->name('password.reset');
Route::post('/reset-password', function (Request $request) {
    $request->validate([
        'token' => ['required'],
        'email' => ['required', 'email'],
        'password' => ['required', 'string', 'min:8', 'confirmed'],
    ]);

    return redirect()->route('login')->with('success', 'Password reset successfully!');
});


/*
|--------------------------------------------------------------------------
| Admin & Principal Portal Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/overview', fn () => Inertia::render('Admin/AdminOverview'))->name('overview');
    Route::get('/users', fn () => Inertia::render('Admin/AdminUsers'))->name('users');
    Route::get('/school-report', fn () => Inertia::render('Admin/AdminSchoolReport'))->name('school-report');
    Route::get('/reports', fn () => Inertia::render('Admin/AdminReports'))->name('reports');
    Route::get('/settings', fn () => Inertia::render('Admin/UserSettings'))->name('settings');
    Route::get('/messages', fn () => Inertia::render('Admin/AdminMessages'))->name('messages');

    // Signed secure download routes
    Route::get('/reports/download-pdf', [AdminReportController::class, 'downloadPdf'])->name('reports.pdf')->middleware('signed');
    Route::get('/reports/download-csv', [AdminReportController::class, 'downloadCsv'])->name('reports.csv')->middleware('signed');
});

// Fallback user settings route to support both /admin/settings and /user/settings
Route::inertia('/user/settings', 'UserSettings')->name('user.settings');



/*
|--------------------------------------------------------------------------
| Teacher Portal Routes
|--------------------------------------------------------------------------
*/
Route::prefix('teacher')->name('teacher.')->group(function () {
    Route::get('/overview', fn () => Inertia::render('Teacher/Overview'))->name('overview');
    Route::get('/learners', fn () => Inertia::render('Teacher/Learners'))->name('learners');
    Route::get('/learner-record', fn () => Inertia::render('Teacher/LearnerRecord'))->name('learner-record');
    
    Route::get('/lessons', fn () => Inertia::render('Teacher/LessonStudio'))->name('lessons');
    Route::get('/lessons/create', fn () => Inertia::render('Teacher/LessonStudio'))->name('lessons.create');
    Route::get('/lessons/draft-saved', fn () => Inertia::render('Teacher/LessonDraftSaved'))->name('lessons.draft');
    
    Route::get('/observations', fn () => Inertia::render('Teacher/Observations'))->name('observations');
    Route::get('/schedule', fn () => Inertia::render('Teacher/Schedule'))->name('schedule');
    Route::get('/reports', fn () => Inertia::render('Teacher/Reports'))->name('reports');
});


/*
|--------------------------------------------------------------------------
| SNED Coordinator Portal Routes
|--------------------------------------------------------------------------
*/
Route::prefix('sned-coordinator')->name('sned.')->group(function () {
    Route::get('/overview', fn () => Inertia::render('SnedCoordinator/SnedOverview'))->name('overview');
    Route::get('/validation-queue', fn () => Inertia::render('SnedCoordinator/SnedValidationQueue'))->name('validation-queue');
    Route::get('/messages', fn () => Inertia::render('SnedCoordinator/SnedMessages'))->name('messages');
    Route::get('/intervention-logs', fn () => Inertia::render('SnedCoordinator/SnedInterventionLogs'))->name('intervention-logs');
    Route::get('/settings', fn () => Inertia::render('SnedCoordinator/SnedSettings'))->name('settings');
        Route::get('/learners', fn () => Inertia::render('SnedCoordinator/SnedLearners'))->name('learners');

    });



/*
|--------------------------------------------------------------------------
| Parent Portal Routes
|--------------------------------------------------------------------------
*/
Route::prefix('parent')->name('parent.')->group(function () {
    Route::get('/overview', fn () => Inertia::render('Parent/ParentOverview'))->name('overview');
        Route::get('/progress', fn () => Inertia::render('Parent/ChildProgress'))->name('progress');
    Route::get('/feedback', fn () => Inertia::render('Parent/ParentFeedback'))->name('feedback');
    Route::get('/activities', fn () => Inertia::render('Parent/HomeActivities'))->name('activities');
    Route::get('/messages', fn () => Inertia::render('Parent/Messages'))->name('messages');
        Route::get('/account', fn () => Inertia::render('Parent/MyAccount'))->name('account');
        Route::get('/feedback', fn () => Inertia::render('Parent/ActivityFeedbackCard'))->name('feedback');

});





/*
|--------------------------------------------------------------------------
| Student Portal Routes (Gamified Learning for SNED Learners)
|--------------------------------------------------------------------------
*/
Route::prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Student/StudentDashboard'))->name('dashboard');
    Route::get('/subjects', fn () => Inertia::render('Student/SubjectsIndex'))->name('subjects');
    Route::get('/activity', fn () => Inertia::render('Student/StudentActivity'))->name('activity');
    Route::get('/rewards', fn () => Inertia::render('Student/StudentRewards'))->name('rewards');
});

// Individual Subject Levels Dynamic Route
Route::get('/student/subject/{subject}', function ($subject) {
    $data = [
        'math' => [
            'name' => 'Math',
            'icon' => '🔢',
            'levels' => [
                ['id' => 1, 'title' => 'Level 1: Counting to 5', 'desc' => 'Count apples and stars', 'status' => 'unlocked'],
                ['id' => 2, 'title' => 'Level 2: Number Recognition', 'desc' => 'Match numbers 1 through 5', 'status' => 'unlocked'],
                ['id' => 3, 'title' => 'Level 3: Simple Addition', 'desc' => 'Put groups together', 'status' => 'locked'],
            ]
        ],
        'reading' => [
            'name' => 'Reading',
            'icon' => '📖',
            'levels' => [
                ['id' => 1, 'title' => 'Level 1: Letter Sounds A-E', 'desc' => 'Discover basic phonics', 'status' => 'unlocked'],
                ['id' => 2, 'title' => 'Level 2: Short Words', 'desc' => 'Read 3-letter words', 'status' => 'locked'],
            ]
        ],
        'science' => [
            'name' => 'Science',
            'icon' => '🌱',
            'levels' => [
                ['id' => 1, 'title' => 'Level 1: Animals Around Us', 'desc' => 'Learn farm and wild animals', 'status' => 'unlocked'],
            ]
        ]
    ];

    $subjectData = $data[$subject] ?? $data['math'];

    return Inertia::render('Student/SubjectLevels', [
        'subject' => $subjectData
    ]);
})->name('student.subject.levels');