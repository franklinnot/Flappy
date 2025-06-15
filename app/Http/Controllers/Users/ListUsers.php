<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Enums\Status;
use App\Utils\Report;

class ListUsers extends Controller
{
    public const COMPONENT = "Users/ListUsers";
    public const MODULE = "users";
    public const ROUTE = "users";

    public function show(Request $request)
    {
        return Inertia::render(self::COMPONENT, [
            'records' => $this->getUsers(),
            'properties' => $this->getColumns(),
            'module' => self::MODULE,
            'status' => $request->session()->get('status') ?? Status::ENABLED->value,
        ]);
    }

    public function edit() {}

    public function enable($id)
    {
        $object = User::find($id);
        $enabled_value = Status::ENABLED->value;

        if (!$object) {
            return Report::error('Usuario no encontrado.');
        } elseif ($object->status == $enabled_value) {
            return Report::error('El usuario ya está habilitado.');
        }

        $old_status = $object->status;
        $object->status = $enabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Usuario habilitado correctamente.', [
            'status' => $old_status
        ]);
    }

    public function disable($id)
    {
        $object = User::find($id);
        $disabled_value = Status::DISABLED->value;

        if (!$object) {
            return Report::error('Usuario no encontrado.');
        } 
        elseif ($object->status == $disabled_value) {
            return Report::error('El usuario ya está deshabilitado.');
        }

        $old_status = $object->status;
        $object->status = $disabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Usuario deshabilitado correctamente.', [
            'status' => $old_status
        ]);
    }

    private function getUsers()
    {
        return User::orderBy('created_at', 'desc')
            ->select(['id', 'dni', 'name', 'rol', 'status'])
            ->get();
    }

    private function getColumns()
    {
        return [
            ['name' => 'dni', 'tag' => 'DNI'],
            ['name' => 'name', 'tag' => 'Nombre'],
            ['name' => 'rol', 'tag' => 'Rol'],
        ];
    }
}
