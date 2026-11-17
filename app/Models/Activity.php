<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = ['level_id', 'type', 'content', 'status', 'ai_generated'];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'ai_generated' => 'boolean',
        ];
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }
}