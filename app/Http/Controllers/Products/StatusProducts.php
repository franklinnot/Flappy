<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Enums\Status;
use App\Utils\Report;

class StatusProducts extends Controller
{
    public const ROUTE = "products";

    public function enable($id)
    {
        $object = Product::find($id);
        $enabled_value = Status::ENABLED->value;

        if (!$object) {
            return Report::error('Producto no encontrado.');
        } else if ($object->status == $enabled_value) {
            return Report::error('El producto ya está habilitado.');
        }

        $object->status = $enabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Producto habilitado correctamente.', [
            'updatedRecord' => $object->toArray()
        ]);
    }

    public function disable($id)
    {
        $object = Product::find($id);
        $disabled_value = Status::DISABLED->value;

        if (!$object) {
            return Report::error('Producto no encontrado.');
        } else if ($object->status == $disabled_value) {
            return Report::error('El producto ya está deshabilitado.');
        }

        $object->status = $disabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Producto deshabilitado correctamente.', [
            'updatedRecord' => $object->toArray()
        ]);
    }
}
