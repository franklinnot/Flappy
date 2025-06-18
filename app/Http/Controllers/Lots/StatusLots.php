<?php

namespace App\Http\Controllers\Lots;

use App\Http\Controllers\Controller;
use App\Models\Lot;
use App\Enums\Status;
use App\Utils\Report;

class StatusLots extends Controller
{
    public const ROUTE = "lots";

    public function enable($id)
    {
        $object = Lot::find($id);
        $enabled_value = Status::ENABLED->value;

        if (!$object) {
            return Report::error('Lote no encontrado.');
        } else if ($object->status == $enabled_value) {
            return Report::error('El lote ya está habilitado.');
        }

        $object->status = $enabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Lote habilitado correctamente.', [
            'updatedRecord' => $object->toArray(),
        ]);
    }

    public function disable($id)
    {
        $object = Lot::find($id);
        $disabled_value = Status::DISABLED->value;

        if (!$object) {
            return Report::error('Lote no encontrado.');
        } else if ($object->status == $disabled_value) {
            return Report::error('El lote ya está deshabilitado.');
        }

        $object->status = $disabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Lote deshabilitado correctamente.', [
            'updatedRecord' => $object->toArray(),
        ]);
    }
}
