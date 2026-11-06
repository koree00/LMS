<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
    Schema::create('lessons', function (Blueprint $table) {
    $table->id();
    $table->foreignId('subject_id')->constrained();
    $table->foreignId('teacher_id')->constrained('users');
    $table->string('title');
    $table->string('source_path')->nullable();   // the uploaded photo or PDF
    $table->enum('status', ['uploaded', 'processing', 'draft', 'approved', 'failed'])
          ->default('uploaded');
    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('TABLE_NAME');
    }
};