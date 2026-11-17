<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentLevelProgress extends Model
{
    protected $table = 'student_level_progress';

    protected $fillable = ['student_id', 'level_id', 'status', 'teacher_locked', 'completed_at'];

    protected function casts(): array
    {
        return [
            'teacher_locked' => 'boolean',
            'completed_at' => 'datetime',
        ];
    }
}