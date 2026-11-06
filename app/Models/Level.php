<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
    Schema::create('levels', function (Blueprint $table) {
    $table->id();
    $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
    $table->unsignedSmallInteger('order');
    $table->string('title');
    $table->timestamps();
    $table->unique(['lesson_id', 'order']);
});
    }

    public function down(): void
    {
        Schema::dropIfExists('TABLE_NAME');
    }
};