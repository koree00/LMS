<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
    Schema::create('accessibility_profiles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('student_id')->unique()->constrained()->cascadeOnDelete();
    $table->string('theme')->default('soft_pastel');
    $table->decimal('font_scale', 3, 1)->default(1.2);
    $table->unsignedSmallInteger('max_activity_seconds')->default(180);
    $table->boolean('reduce_motion')->default(true);
    $table->boolean('sound_enabled')->default(false);
    $table->boolean('is_safe_mode')->default(false);
    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('TABLE_NAME');
    }
};