<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Response as ResponseIlluminate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): ResponseIlluminate
    {
        $request->authenticate();

        $request->session()->regenerate();

        $referer = $request->headers->get('referer', '/');

        return Inertia::location($referer);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): ResponseIlluminate
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        $referer = $request->headers->get('referer', '/');

        return Inertia::location($referer);
    }
}
