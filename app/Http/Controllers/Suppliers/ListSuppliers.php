<?php

namespace App\Http\Controllers\Suppliers;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Enums\Status;
use App\Utils\Report;

class ListSuppliers extends Controller
{
    public const COMPONENT = "Suppliers/ListSuppliers";
    public const MODULE = "suppliers";
    public const ROUTE = "suppliers";

    public function show(Request $request)
    {
        return Inertia::render(self::COMPONENT, [
            'records' => $this->getSuppliers(),
            'properties' => $this->getColumns(),
            'module' => self::MODULE,
            'report' => $request->session()->get('report'),
            'status' => $request->session()->get('status')
        ]);
    }

    public function edit() {}

    public function enable($id)
    {
        $object = Supplier::find($id);
        $enabled_value = Status::ENABLED->value;

        if (!$object) {
            return Report::error(self::ROUTE, 'Proveedor no encontrado.');
        }
        else if ($object->status == $enabled_value) {
            return Report::error(self::ROUTE, 'El proveedor ya está habilitado.');
        }

        $old_status = $object->status;
        $object->status = $enabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Proveedor habilitado correctamente.', [
            'status' => $old_status
        ]);
    }

    public function disable($id)
    {
        $object = Supplier::find($id);
        $disabled_value = Status::DISABLED->value;

        if (!$object) {
            return Report::error(self::ROUTE, 'Proveedor no encontrado.');
        } else if ($object->status == $disabled_value) {
            return Report::error(self::ROUTE, 'El proveedor ya está deshabilitado.');
        }

        $object->status = $disabled_value;
        $object->save();

        $old_status = $object->status;
        return Report::success(self::ROUTE, 'Proveedor deshabilitado correctamente.', [
            'status' => $old_status
        ]);
    }

    private function getSuppliers()
    {
        return Supplier::orderBy('created_at', 'desc')
            ->select(['id', 'ruc', 'name', 'phone', 'email', 'address', 'status'])
            ->get();
    }

    private function getColumns()
    {
        return [
            ['name' => 'ruc', 'tag' => 'RUC'],
            ['name' => 'name', 'tag' => 'Nombre'],
            ['name' => 'phone', 'tag' => 'Teléfono'],
            ['name' => 'email', 'tag' => 'Correo'],
            ['name' => 'address', 'tag' => 'Dirección'],
        ];
    }
}
