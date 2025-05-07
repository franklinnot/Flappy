<?php

namespace App\Http\Middleware;

use App\Enums\UserRol;
use App\Helpers\SellerRoutes;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class VerifyRol
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        $rol = $user->rol;

        if ($rol == UserRol::SELLER->value) {
            $path = $request->path();
            $routes = SellerRoutes::getRoutes();
            $allowed = false;
            foreach ($routes as $route) {
                if (Str::is($route, $path)) {
                    $allowed = true;
                    break;
                }
            }
            if (!$allowed) {
                return Inertia::location(route('sales'));
            }
        }

        return $next($request);
    }
}
