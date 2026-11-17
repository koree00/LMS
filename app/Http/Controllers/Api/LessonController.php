<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class LessonController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            Lesson::where('teacher_id', $request->user()->id)
                ->with('subject')
                ->withCount('levels')
                ->latest()
                ->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'title' => ['required', 'string', 'max:255'],
            'levels' => ['required', 'array', 'min:1', 'max:10'],
            'levels.*.title' => ['required', 'string', 'max:255'],
            'levels.*.activities' => ['required', 'array', 'min:1', 'max:10'],
            'levels.*.activities.*.type' => [
                'required',
                Rule::in(['multiple_choice', 'drag_match', 'tap_count', 'trace_letter']),
            ],
            'levels.*.activities.*.content' => ['required', 'array'],
        ]);

        $lesson = DB::transaction(function () use ($request, $data) {
            $lesson = Lesson::create([
                'subject_id' => $data['subject_id'],
                'teacher_id' => $request->user()->id,
                'title' => $data['title'],
                'status' => 'draft',
            ]);

            foreach ($data['levels'] as $index => $levelData) {
                $level = $lesson->levels()->create([
                    'order' => $index + 1,
                    'title' => $levelData['title'],
                ]);

                foreach ($levelData['activities'] as $activity) {
                    $level->activities()->create([
                        'type' => $activity['type'],
                        'content' => $activity['content'],
                        'status' => 'draft',
                        'ai_generated' => false,
                    ]);
                }
            }

            return $lesson;
        });

        return response()->json($lesson->load('subject', 'levels.activities'), 201);
    }

    // Teacher review step: nothing reaches a student until this is called
    public function approve(Request $request, int $id)
    {
        $lesson = Lesson::where('teacher_id', $request->user()->id)->findOrFail($id);

        DB::transaction(function () use ($lesson) {
            $lesson->update(['status' => 'approved']);

            Activity::whereIn('level_id', $lesson->levels()->pluck('id'))
                ->update(['status' => 'approved']);
        });

        return response()->json($lesson->fresh()->load('subject', 'levels.activities'));
    }
}