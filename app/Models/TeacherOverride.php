<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherOverride extends Model
{
    protected $fillable = ['teacher_id', 'student_id', 'action', 'payload', 'reason'];

    protected function casts(): array
    {
        return ['payload' => 'array'];
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}