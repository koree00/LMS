<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    protected $fillable = ['lesson_id', 'order', 'title'];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }
}