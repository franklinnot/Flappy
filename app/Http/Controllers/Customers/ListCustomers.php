<?php

namespace App\Http\Controllers\Customers;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Enums\Status;
use App\Utils\Report;

class ListCustomers extends Controller
{
    public const COMPONENT = "Customers/ListCustomers";
    public const MODULE = "customers";
    public const ROUTE = "customers";

    public function show(Request $request)
    {
        return Inertia::render(self::COMPONENT, [
            'records' => $this->getCustomers(),
            'properties' => $this->getColumns(),
            'module' => self::MODULE,
            'report' => $request->session()->get('report'),
            'status' => $request->session()->get('status') ?? Status::ENABLED->value,
        ]);
    }

    public function edit() {}

    public function enable($id)
    {
        $object = Customer::find($id);
        $enabled_value = Status::ENABLED->value;

        if (!$object) {
            return Report::error('Cliente no encontrado.');
        } 
        elseif ($object->status == $enabled_value) {
            return Report::error('El cliente ya está habilitado.');
        }

        $old_status = $object->status;
        $object->status = $enabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Cliente habilitado correctamente.', [
            'status' => $old_status,
        ]);
    }

    public function disable($id)
    {
        $object = Customer::find($id);
        $disabled_value = Status::DISABLED->value;

        if (!$object) {
            return Report::error('Cliente no encontrado.');
        } elseif ($object->status == $disabled_value) {
            return Report::error('El cliente ya está deshabilitado.');
        }

        $old_status = $object->status;
        $object->status = $disabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Cliente deshabilitado correctamente.', [
            'status' => $old_status,
        ]);
    }

    private function getCustomers()
    {
        return Customer::orderBy('created_at', 'desc')
            ->select(['id', 'dni', 'name', 'phone', 'status'])
            ->get();
    }

    private function getColumns()
    {
        return [
            ['name' => 'dni', 'tag' => 'DNI'],
            ['name' => 'name', 'tag' => 'Nombre'],
            ['name' => 'phone', 'tag' => 'Teléfono'],
        ];
    }
}
