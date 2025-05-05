<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class Authenticate
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        // Verificar si el usuario está autenticado
        if (!$user) {
            return Inertia::location(route('login'));
        } else {
            return $next($request);
        }
    }
}
