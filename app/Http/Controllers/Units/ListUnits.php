<?php

namespace App\Http\Controllers\Units;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Enums\Status;
use App\Utils\Report;

class ListUnits extends Controller
{
    public const COMPONENT = "Units/ListUnits";
    public const MODULE = "units";
    public const ROUTE = "units";

    public function show(Request $request)
    {
        return Inertia::render(self::COMPONENT, [
            'records' => $this->getUnits(),
            'properties' => $this->getColumns(),
            'module' => self::MODULE,
            'report' => $request->session()->get('report'),
            'status' => $request->session()->get('status') ?? Status::ENABLED->value,
        ]);
    }

    public function edit() {}

    public function enable($id)
    {
        $object = Unit::find($id);
        $enabled_value = Status::ENABLED->value;

        if (!$object) {
            return Report::error('Unidad no encontrada.');
        } elseif ($object->status == $enabled_value) {
            return Report::error('La unidad ya está habilitada.');
        }

        $old_status = $object->status;
        $object->status = $enabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Unidad habilitada correctamente.', [
            'status' => $old_status,
        ]);
    }

    public function disable($id)
    {
        $object = Unit::find($id);
        $disabled_value = Status::DISABLED->value;

        if (!$object) {
            return Report::error('Unidad no encontrada.');
        } elseif ($object->status == $disabled_value) {
            return Report::error('La unidad ya está deshabilitada.');
        }

        $old_status = $object->status;
        $object->status = $disabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Unidad deshabilitada correctamente.', [
            'status' => $old_status,
        ]);
    }

    private function getUnits()
    {
        return Unit::orderBy('created_at', 'desc')
            ->select(['id', 'name', 'code', 'status'])
            ->get();
    }

    private function getColumns()
    {
        return [
            ['name' => 'code', 'tag' => 'Código'],
            ['name' => 'name', 'tag' => 'Nombre'],
        ];
    }
}
