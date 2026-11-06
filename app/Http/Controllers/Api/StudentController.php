<?php

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;


class StudentController extends Controller
{
    public function index(Request $request)
    {
        $students = $this->visibleStudents($request)
            ->with('profile')
            ->orderBy('nickname')
            ->get()
            ->map(fn (Student $s) => [
                'id' => $s->id,
                'nickname' => $s->nickname,
                'login_code' => $s->login_code,
                'section_id' => $s->section_id,
                'full_name' => $s->full_name,
                'profile' => $s->profile,
            ]);

        return response()->json($students);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (! $user->section_id) {
            return response()->json(['message' => 'Your account has no section assigned.'], 422);
        }

        $data = $request->validate([
            'nickname' => ['required', 'string', 'max:50'],
            'full_name' => ['required', 'string', 'max:255'],
            'developmental_notes' => ['nullable', 'string'],
        ]);

        $pin = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);

        $student = DB::transaction(function () use ($user, $data, $pin) {
            $student = Student::create([
                'teacher_id' => $user->id,
                'section_id' => $user->section_id,
                'nickname' => $data['nickname'],
                'full_name' => $data['full_name'],
                'developmental_notes' => $data['developmental_notes'] ?? null,
                'login_code' => $this->uniqueLoginCode(),
                'login_pin_hash' => Hash::make($pin),
            ]);

            $student->profile()->create([]);

            return $student;
        });

        return response()->json([
            'student' => $student->load('profile'),
            'login_code' => $student->login_code,
            'pin' => $pin, // shown only this once
        ], 201);
    }

    // Teachers see only their own section. Other staff roles see all students.
    private function visibleStudents(Request $request)
    {
        $user = $request->user();

        return $user->role === Role::Teacher
            ? Student::where('section_id', $user->section_id)
            : Student::query();
    }

    private function uniqueLoginCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (Student::withTrashed()->where('login_code', $code)->exists());

        return $code;
    }
}  