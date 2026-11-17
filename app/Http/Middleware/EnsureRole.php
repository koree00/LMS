<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        // Only staff accounts can pass a role check. Students never do.
        if (! $user instanceof User) {
            return response()->json(['message' => 'You do not have access to this.'], 403);
        }

        $role = $user->role instanceof \BackedEnum ? $user->role->value : $user->role;

        if (! in_array($role, $roles, true)) {
            return response()->json(['message' => 'You do not have access to this.'], 403);
        }

        return $next($request);
    }
}