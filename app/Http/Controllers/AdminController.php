<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function overview()
    {
        return Inertia::render('Admin/AdminOverview', [
            'stats' => [
                'totalEnrolled' => 0,
                'inclusionLearners' => 0,
                'activeFaculty' => 0,
                'systemCompliance' => '0%',
            ],
            'sections' => [],
            'notifications' => [],
        ]);
    }
}