<?php

namespace App\Http\Controllers\Units;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Inertia\Inertia;

class ListUnits extends Controller
{
    public const COMPONENT = "Units/ListUnits";

    public function show()
    {
        return Inertia::render(self::COMPONENT, [
            'records' => $this->getUnits(),
            'properties' => $this->getColumns(),
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
            ['name' => 'name', 'tag' => 'Nombre'],
            ['name' => 'code', 'tag' => 'Código'],
        ];
    }
}
