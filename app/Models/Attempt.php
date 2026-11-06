<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attempt extends Model
{
    public $timestamps = false;

    protected $fillable = ['student_id', 'activity_id', 'is_correct', 'retry_count', 'duration_ms'];

    protected function casts(): array
    {
        return ['is_correct' => 'boolean'];
    }
}