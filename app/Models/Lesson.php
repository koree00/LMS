<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = ['subject_id', 'teacher_id', 'title', 'source_path', 'status'];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function levels()
    {
        return $this->hasMany(Level::class)->orderBy('order');
    }
}