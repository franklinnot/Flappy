<?php


namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Utils\Report;

class EditUsers extends Controller
{
    public const ROUTE = "users";

    public function edit(Request $request)
    {
        $id = $request->id;
        $user = User::find($id);

        if (!$user) {
            return Report::error('Usuario no encontrado.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'dni' => 'required|digits:8|unique:users,dni,' . $id,
            'rol' => 'required|string',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->name = $request->name;
        $user->dni = $request->dni;
        $user->rol = $request->rol;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return Report::success(self::ROUTE, 'Usuario actualizado correctamente', [
            'updatedRecord' => $user->toArray()
        ]);
    }
}