<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class StudentAuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'login_code' => ['required', 'string', 'max:12'],
            'pin' => ['required', 'digits:4'],
        ]);

        $code = strtoupper(trim($data['login_code']));
        $key = 'student-login:'.$code;

        // Limit guesses per code, so one class sharing school wifi isn't locked out together
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json([
                'message' => 'Too many tries. Please ask your teacher for help.',
            ], 429);
        }

        $student = Student::where('login_code', $code)->first();

        if (! $student || ! Hash::check($data['pin'], $student->login_pin_hash)) {
            RateLimiter::hit($key, 300);

            throw ValidationException::withMessages([
                'login_code' => ['The code or PIN is incorrect.'],
            ]);
        }

        RateLimiter::clear($key);

        $student->tokens()->delete(); // one active session per student

        return response()->json([
            'student' => [
                'id' => $student->id,
                'nickname' => $student->nickname,
                'section_id' => $student->section_id,
                'profile' => $student->profile,
            ],
            'token' => $student->createToken('student-token', ['student'], now()->addHours(4))
                ->plainTextToken,
        ]);
    }

    public function me(Request $request)
    {
        $student = $request->user();

        return response()->json([
            'id' => $student->id,
            'nickname' => $student->nickname,
            'section_id' => $student->section_id,
            'profile' => $student->profile,
        ]);
    }
}