<?php

namespace App\Http\Controllers\Operations;

use App\Http\Controllers\Controller;
use App\Models\Operation;
use Inertia\Inertia;

class ListOperations extends Controller
{
    public const COMPONENT = "Operations/ListOperations";
    public const MODULE = "operations";

    public function show()
    {
        return Inertia::render(self::COMPONENT, [
            'records' => $this->getOperations(),
            'properties' => $this->getColumns(),
            'module' => self::MODULE,
        ]);
    }

    private function getOperations()
    {
        return Operation::with(['lot', 'supplier', 'user'])
            ->orderBy('created_at', 'desc')
            ->select([
                'id',
                'type',
                'quantity',
                'status',
                'user_id',
                'supplier_id',
                'lot_id',
                'created_at'
            ])
            ->get()
            ->map(function ($obj) {
                $formattedCreatedAt = $obj->formatted_created_at;

                $lot = $obj->lot;
                $lot_code = $lot->code;
                $product_name = $lot->product->name;
                $supplier_name = $obj->supplier->name ?? null;
                return [
                    'id' => $obj->id,
                    'lot' => "$lot_code - $product_name",
                    'type' => $obj->type,
                    'quantity' => $obj->quantity,
                    'user' => $obj->user->name,
                    'supplier' => $supplier_name,
                    'created_at' => $formattedCreatedAt,
                    'status' => $obj->status,
                ];
            });
    }

    private function getColumns()
    {
        return [
            ['name' => 'created_at', 'tag' => 'Fecha'],
            ['name' => 'lot', 'tag' => 'Lote'],
            ['name' => 'type', 'tag' => 'Tipo de operación'],
            ['name' => 'quantity', 'tag' => 'Cantidad'],
            ['name' => 'supplier', 'tag' => 'Proveedor'],
            ['name' => 'user', 'tag' => 'Usuario'],
        ];
    }
}
