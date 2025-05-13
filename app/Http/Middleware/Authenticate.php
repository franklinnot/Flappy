<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Enums\Status;

class Authenticate
{
    /**
     * Verify that the user is authenticated and their status is 'Habilitado'
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        if (!$user || $user->status != Status::ENABLED->value) {
            return Inertia::location(route('login'));
        } else {
            return $next($request);
        }
    }
}
