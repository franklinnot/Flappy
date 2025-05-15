<?php

namespace App\Http\Controllers\Auth;

use App\Enums\Status;
use App\Enums\Roles;
use App\Utils\EnumHelper;
use App\Utils\Report;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public const COMPONENT = "Auth/Register";

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'dni' => 'required|digits:8|unique:users,dni',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'rol' => ['required', Rule::in(Roles::names())],
        ]);

        $user = User::create([
            'name' => $request->name,
            'dni' => $request->dni,
            'password' => Hash::make($request->password),
            'rol' => EnumHelper::getValue(Roles::class, $request->rol),// Convierte el nombre del caso al valor respaldado
            'status' => Status::ENABLED->value,
        ]);

        if (!$user) {
            Report::error('Error al registrar un nuevo usuario');
        }

        return Inertia::render(self::COMPONENT, Report::success('Usuario registrado correctamente'));
    }
}
