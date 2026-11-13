use Illuminate\Http\Request;
use Inertia\Inertia;

public function edit(Request $request)
{
    $user = $request->user();

    return Inertia::render('UserSettings', [
        'user' => [
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'assignedSection' => $user->assigned_section ?? 'School-wide',
        ],
        'notifications' => $user->unreadNotifications ?? []
    ]);
}