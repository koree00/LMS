<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
    Schema::create('teacher_overrides', function (Blueprint $table) {
    $table->id();
    $table->foreignId('teacher_id')->constrained('users');
    $table->foreignId('student_id')->constrained();
    $table->string('action');            // lock_level, unlock_level, reset_safe_mode...
    $table->jsonb('payload')->nullable();
    $table->string('reason')->nullable();
    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('TABLE_NAME');
    }
};