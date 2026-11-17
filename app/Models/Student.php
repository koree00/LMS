<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class Student extends Model
{
    use HasApiTokens, SoftDeletes;

    protected $fillable = [
        'teacher_id', 'section_id', 'nickname', 'login_code',
        'full_name', 'developmental_notes', 'login_pin_hash',
    ];

    protected $hidden = ['login_pin_hash'];

    protected function casts(): array
    {
        return [
            'full_name' => 'encrypted',
            'developmental_notes' => 'encrypted',
        ];
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function profile()
    {
        return $this->hasOne(AccessibilityProfile::class);
    }

    public function progress()
    {
        return $this->hasMany(StudentLevelProgress::class);
    }

    public function attempts()
    {
        return $this->hasMany(Attempt::class);
    }

    public function badges()
    {
        return $this->belongsToMany(Badge::class, 'student_badges')->withTimestamps();
    }
}