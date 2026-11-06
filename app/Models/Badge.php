<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    protected $fillable = ['name', 'description', 'icon', 'criteria'];

    protected function casts(): array
    {
        return ['criteria' => 'array'];
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_badges')->withTimestamps();
    }
}