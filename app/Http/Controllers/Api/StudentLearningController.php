<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Attempt;
use App\Models\Lesson;
use App\Models\Level;
use App\Models\StudentLevelProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentLearningController extends Controller
{
    // Subject hub: approved lessons from teachers in the student's section
    public function lessons(Request $request)
    {
        $student = $request->user();

        $lessons = $this->playableLessons($student)
            ->when($request->query('subject_id'), fn ($q, $id) => $q->where('subject_id', $id))
            ->with('subject', 'levels')
            ->get();

        return response()->json($lessons->map(function (Lesson $lesson) use ($student) {
            $statuses = $this->levelStatuses($student, $lesson);

            return [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'subject' => $lesson->subject->name,
                'levels' => $lesson->levels->map(fn (Level $level) => [
                    'id' => $level->id,
                    'order' => $level->order,
                    'title' => $level->title,
                    'status' => $statuses[$level->id],
                ])->values(),
            ];
        }));
    }

    // The activities of one level, WITHOUT the correct answers
    public function activities(Request $request, Level $level)
    {
        $student = $request->user();
        $lesson = $this->playableLessons($student)->with('levels')->find($level->lesson_id);

        abort_if(! $lesson, 404);
        abort_if($this->levelStatuses($student, $lesson)[$level->id] === 'locked', 403, 'This level is locked.');

        return response()->json([
            'level' => ['id' => $level->id, 'title' => $level->title],
            'activities' => $level->activities()->where('status', 'approved')->get()
                ->map(fn (Activity $a) => [
                    'id' => $a->id,
                    'type' => $a->type,
                    'content' => collect($a->content)->except('answer')->all(),
                ])->values(),
        ]);
    }

    // The server checks the answer, records the attempt, and unlocks the next level
    public function answer(Request $request, Activity $activity)
    {
        $student = $request->user();

        $data = $request->validate([
            'answer' => ['required'],
            'duration_ms' => ['required', 'integer', 'min:0', 'max:3600000'],
        ]);

        $level = $activity->level;
        $lesson = $this->playableLessons($student)->with('levels')->find($level->lesson_id);

        abort_if(! $lesson || $activity->status !== 'approved', 404);
        abort_if($this->levelStatuses($student, $lesson)[$level->id] === 'locked', 403, 'This level is locked.');

        $correct = $this->isCorrect($data['answer'], $activity->content['answer'] ?? null);

        [$levelCompleted, $nextUnlocked] = DB::transaction(function () use ($student, $activity, $level, $lesson, $data, $correct) {
            $previousTries = Attempt::where('student_id', $student->id)
                ->where('activity_id', $activity->id)
                ->count();

            Attempt::create([
                'student_id' => $student->id,
                'activity_id' => $activity->id,
                'is_correct' => $correct,
                'retry_count' => $previousTries,
                'duration_ms' => $data['duration_ms'],
            ]);

            return $correct ? $this->advance($student, $level, $lesson) : [false, false];
        });

        return response()->json([
            'correct' => $correct,
            'level_completed' => $levelCompleted,
            'next_level_unlocked' => $nextUnlocked,
        ]);
    }

    private function playableLessons($student)
    {
        return Lesson::where('status', 'approved')
            ->whereHas('teacher', fn ($q) => $q->where('section_id', $student->section_id));
    }

    // Creates missing progress rows (level 1 unlocked, the rest locked)
    // and returns the status each level shows. A teacher lock always wins.
    private function levelStatuses($student, Lesson $lesson): array
    {
        $levels = $lesson->levels;

        $rows = StudentLevelProgress::where('student_id', $student->id)
            ->whereIn('level_id', $levels->pluck('id'))
            ->get()
            ->keyBy('level_id');

        $result = [];

        foreach ($levels->values() as $index => $level) {
            $row = $rows->get($level->id) ?? StudentLevelProgress::create([
                'student_id' => $student->id,
                'level_id' => $level->id,
                'status' => $index === 0 ? 'unlocked' : 'locked',
            ]);

            $result[$level->id] = $row->teacher_locked ? 'locked' : $row->status;
        }

        return $result;
    }

    // If every activity in the level is solved, complete it and unlock the next one
    private function advance($student, Level $level, Lesson $lesson): array
    {
        $activityIds = $level->activities()->where('status', 'approved')->pluck('id');

        $solved = Attempt::where('student_id', $student->id)
            ->whereIn('activity_id', $activityIds)
            ->where('is_correct', true)
            ->distinct()
            ->count('activity_id');

        if ($solved < $activityIds->count()) {
            return [false, false];
        }

        $progress = StudentLevelProgress::where('student_id', $student->id)
            ->where('level_id', $level->id)
            ->first();

        if (! $progress || $progress->status === 'completed') {
            return [false, false];
        }

        $progress->update(['status' => 'completed', 'completed_at' => now()]);

        $nextLevel = $lesson->levels->firstWhere('order', $level->order + 1);
        $nextUnlocked = false;

        if ($nextLevel) {
            $nextProgress = StudentLevelProgress::where('student_id', $student->id)
                ->where('level_id', $nextLevel->id)
                ->first();

            if ($nextProgress && $nextProgress->status === 'locked') {
                $nextProgress->update(['status' => 'unlocked']);
                $nextUnlocked = ! $nextProgress->teacher_locked;
            }
        }

        return [true, $nextUnlocked];
    }

    private function isCorrect(mixed $given, mixed $expected): bool
    {
        if ($expected === null) {
            return false;
        }

        $normalize = fn ($v) => is_array($v) ? json_encode($v) : mb_strtolower(trim((string) $v));

        return $normalize($given) === $normalize($expected);
    }
}