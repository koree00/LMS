<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
    Schema::create('student_level_progress', function (Blueprint $table) {
    $table->id();
    $table->foreignId('student_id')->constrained()->cascadeOnDelete();
    $table->foreignId('level_id')->constrained()->cascadeOnDelete();
    $table->enum('status', ['locked', 'unlocked', 'completed'])->default('locked');
    $table->boolean('teacher_locked')->default(false);
    $table->timestamp('completed_at')->nullable();
    $table->timestamps();
    $table->unique(['student_id', 'level_id']);
});
    }

    public function down(): void
    {
        Schema::dropIfExists('TABLE_NAME');
    }
};