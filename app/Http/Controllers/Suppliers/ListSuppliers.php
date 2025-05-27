<?php

namespace App\Http\Controllers\Suppliers;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Inertia\Inertia;

class ListSuppliers extends Controller
{
    public const COMPONENT = "Suppliers/ListSuppliers";

    public function show()
    {
        return Inertia::render(self::COMPONENT, [
            'records' => $this->getSuppliers(),
            'properties' => $this->getColumns(),
        ]);
    }

    private function getSuppliers()
    {
        return Supplier::orderBy('created_at', 'desc')
            ->select(['id', 'ruc', 'name', 'phone', 'email', 'address', 'status'])
            ->get();
    }

    private function getColumns()
    {
        return [
            ['name' => 'ruc', 'tag' => 'RUC'],
            ['name' => 'name', 'tag' => 'Nombre'],
            ['name' => 'phone', 'tag' => 'Teléfono'],
            ['name' => 'email', 'tag' => 'Correo'],
            ['name' => 'address', 'tag' => 'Dirección'],
        ];
    }
}
