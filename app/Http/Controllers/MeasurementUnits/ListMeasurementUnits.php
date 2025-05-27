<?php

namespace App\Http\Controllers\MeasurementUnits;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Inertia\Inertia;

class ListMeasurementUnits extends Controller
{
    public const COMPONENT = "MeasurementUnits/ListMeasurementUnits";

    public function show()
    {
        return Inertia::render(self::COMPONENT, [
            'records' => $this->getMeasurementUnits(),
            'properties' => $this->getColumns(),
        ]);
    }

    private function getMeasurementUnits()
    {
        return Unit::orderBy('created_at', 'desc')
            ->select(['id', 'name', 'code', 'status'])
            ->get();
    }

    private function getColumns()
    {
        return [
            ['name' => 'name', 'tag' => 'Nombre'],
            ['name' => 'code', 'tag' => 'Código'],
        ];
    }
}
