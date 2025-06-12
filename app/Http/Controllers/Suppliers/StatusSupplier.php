<?php

namespace App\Http\Controllers\Suppliers;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Enums\Status;
use App\Utils\Report;

class StatusSupplier extends Controller
{
    public const ROUTE = "suppliers";

    public function enable($id)
    {
        $object = Supplier::find($id);
        $enabled_value = Status::ENABLED->value;

        if (!$object) {
            return Report::error('Proveedor no encontrado.');
        }
        else if ($object->status == $enabled_value) {
            return Report::error('El proveedor ya está habilitado.');
        }

        $object->status = $enabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Proveedor habilitado correctamente.', [
            'updatedRecord' => $object->toArray(),
        ]);
    }

    public function disable($id)
    {
        $object = Supplier::find($id);
        $disabled_value = Status::DISABLED->value;

        if (!$object) {
            return Report::error('Proveedor no encontrado.');
        } else if ($object->status == $disabled_value) {
            return Report::error('El proveedor ya está deshabilitado.');
        }
        
        $old_status = $object->status;
        $object->status = $disabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Proveedor deshabilitado correctamente.', [
            'updatedRecord' => $object->toArray(), 
        ]);
    }

}
