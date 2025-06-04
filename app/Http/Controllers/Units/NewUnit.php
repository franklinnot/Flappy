<?php

namespace App\Http\Controllers\Units;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Utils\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewUnit extends Controller
{
    public const COMPONENT = "Units/NewUnit";
    public const ROUTE = "units.new";

    public function show(Request $request)
    {
        return Inertia::render(self::COMPONENT, [
            'report' => $request->session()->get('report')
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:24',
            'code' => 'required|string|max:8|uppercase|unique:units,code',
        ]);

        $unit = Unit::create([
            'name' => $request->name,
            'code' => $request->code,
            'status' => Status::ENABLED->value,
        ]);

        if (!$unit) {
            Report::error('Error al registrar una nueva unidad de medida');
        }

        return Report::success(self::ROUTE, 'Unidad de medida registrada correctamente');
    }
}
