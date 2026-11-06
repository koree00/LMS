<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
    Schema::create('activities', function (Blueprint $table) {
    $table->id();
    $table->foreignId('level_id')->constrained()->cascadeOnDelete();
    $table->enum('type', ['multiple_choice', 'drag_match', 'tap_count', 'trace_letter']);
    $table->jsonb('content');
    $table->enum('status', ['draft', 'approved', 'rejected'])->default('draft');
    $table->boolean('ai_generated')->default(false);
    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('TABLE_NAME');
    }
};