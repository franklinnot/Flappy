<?php

namespace App\Http\Controllers\MeasurementUnits;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Utils\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewMeasurementUnit extends Controller
{
    public const COMPONENT = "MeasurementUnits/NewMeasurementUnit";

    public function show()
    {
        return Inertia::render(self::COMPONENT);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:2',
        ]);

        $unit = Unit::create([
            'name' => $request->name,
            'code' => $request->code,
            'status' => Status::ENABLED->value,
        ]);

        if (!$unit) {
            Report::error('Error al registrar una nueva Unidad de Medida');
        }

        return Inertia::render(self::COMPONENT, Report::success('Unidad de Medida registrada correctamente'));
    }
}
