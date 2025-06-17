<?php
namespace App\Http\Controllers\Categories;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use App\Enums\Status;
use App\Utils\Report;

class StatusCategorie extends Controller
{
    public const ROUTE = 'categories';

public function enable($id)
    {
        $object = Categorie::find($id);
        $enabled_value = Status::ENABLED->value;

        if (!$object) {
            return Report::error('Categoría no encontrada.');
        }
        else if ($object->status == $enabled_value) {
            return Report::error('La categoría ya está habilitada.');
        }

        $old_status = $object->status;
        $object->status = $enabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Categoría habilitada correctamente.', [
            'status' => $old_status
        ]);
    }

    public function disable($id)
    {
        $object = Categorie::find($id);
        $disabled_value = Status::DISABLED->value;

        if (!$object) {
            return Report::error('Categoría no encontrada.');
        } else if ($object->status == $disabled_value) {
            return Report::error('La categoría ya está deshabilitada.');
        }

        $old_status = $object->status;
        $object->status = $disabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Categoría deshabilitada correctamente.', [
            'status' => $old_status
        ]);
    }
}
