<?php

namespace App\Http\Controllers\Users;

use App\Enums\Status;
use App\Enums\Roles;
use App\Utils\Report;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Utils\EnumHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class NewUser extends Controller
{
    public const COMPONENT = "Users/NewUser";

    public function show()
    {
        return Inertia::render(self::COMPONENT, [
            'roles' => $this->getRoles(),
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'dni' => 'required|digits:8|unique:users,dni',
            'rol' => ['required', Rule::in(Roles::names())],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'dni' => $request->dni,
            'password' => Hash::make($request->password),
            'rol' => EnumHelper::getValue(Roles::class, $request->rol),
            'status' => Status::ENABLED->value,
        ]);

        if (!$user) {
            Report::error('Error al registrar un nuevo usuario');
        }

        return inertia(self::COMPONENT, Report::success('Usuario registrado correctamente', [
            'roles' => $this->getRoles()
        ]));
    }

    private function getRoles()
    {
        return Roles::valuesWithId();
    }

}
