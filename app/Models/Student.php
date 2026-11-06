<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use SoftDeletes;

    protected $fillable = ['teacher_id', 'nickname', 'full_name', 'developmental_notes', 'login_pin_hash'];

    protected $hidden = ['login_pin_hash'];

    protected function casts(): array
    {
        return [
            'full_name' => 'encrypted',
            'developmental_notes' => 'encrypted',
        ];
    }
    public function badges()
{
    return $this->belongsToMany(Badge::class, 'student_badges')->withTimestamps();
}
}