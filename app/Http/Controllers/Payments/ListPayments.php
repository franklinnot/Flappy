<?php

namespace App\Http\Controllers\Payments;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Enums\Status;
use App\Utils\Report;

class ListPayments extends Controller
{
    public const COMPONENT = "Payments/ListPayments";
    public const MODULE = "payments";
    public const ROUTE = "payments";

    public function show(Request $request)
    {
        return Inertia::render(self::COMPONENT, [
            'records' => $this->getPayments(),
            'properties' => $this->getColumns(),
            'module' => self::MODULE,
            'report' => $request->session()->get('report'),
            'status' => $request->session()->get('status') ?? Status::ENABLED->value,
        ]);
    }

    public function edit() {}

    public function enable($id)
    {
        $object = Payment::find($id);
        $enabled_value = Status::ENABLED->value;

        if (!$object) {
            return Report::error('Método de pago no encontrado.');
        } elseif ($object->status == $enabled_value) {
            return Report::error('El método de pago ya está habilitado.');
        }

        $old_status = $object->status;
        $object->status = $enabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Método de pago habilitado correctamente.', [
            'status' => $old_status,
        ]);
    }

    public function disable($id)
    {
        $object = Payment::find($id);
        $disabled_value = Status::DISABLED->value;

        if (!$object) {
            return Report::error('Método de pago no encontrado.');
        } elseif ($object->status == $disabled_value) {
            return Report::error('El método de pago ya está deshabilitado.');
        }

        $old_status = $object->status;
        $object->status = $disabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Método de pago deshabilitado correctamente.', [
            'status' => $old_status,
        ]);
    }

    private function getPayments()
    {
        return Payment::orderBy('created_at', 'desc')
            ->select(['id', 'name', 'status'])
            ->get();
    }

    private function getColumns()
    {
        return [
            ['name' => 'name', 'tag' => 'Nombre del método'],
        ];
    }
}
