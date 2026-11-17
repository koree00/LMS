<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccessibilityProfile extends Model
{
    protected $fillable = [
        'student_id', 'theme', 'font_scale', 'max_activity_seconds',
        'reduce_motion', 'sound_enabled', 'is_safe_mode',
    ];

    protected function casts(): array
    {
        return [
            'reduce_motion' => 'boolean',
            'sound_enabled' => 'boolean',
            'is_safe_mode' => 'boolean',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}