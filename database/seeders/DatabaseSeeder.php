<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\Section;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $section = Section::firstOrCreate([
            'name' => 'Grade 1 - Mabini',
            'school_year' => '2026-2027',
        ]);

        User::firstOrCreate(['email' => 'ict@example.com'], [
            'name' => 'ICT Coordinator',
            'password' => 'password123',
            'role' => Role::IctCoordinator,
        ]);

        User::firstOrCreate(['email' => 'teacher@example.com'], [
            'name' => 'Test Teacher',
            'password' => 'password123',
            'role' => Role::Teacher,
            'section_id' => $section->id,
        ]);

        foreach (['Mathematics', 'Mother Tongue', 'English', 'Araling Panlipunan', 'MAPEH'] as $name) {
            Subject::firstOrCreate(['name' => $name]);
        }
    }
}