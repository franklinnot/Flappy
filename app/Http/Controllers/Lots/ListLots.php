<?php

namespace App\Http\Controllers\Lots;

use App\Http\Controllers\Controller;
use App\Models\Lot;
use Inertia\Inertia;

class ListLots extends Controller
{
    public const COMPONENT = "Lots/ListLots";
    public const MODULE = "lots";

    public function show()
    {
        return Inertia::render(self::COMPONENT, [
            'records' => $this->getLots(),
            'properties' => $this->getColumns(),
            'module' => self::MODULE,
        ]);
    }

    private function getLots()
    {
        return Lot::with('product')
            ->orderBy('created_at', 'desc')
            ->select([
                'id',
                'code',
                'exp_alert',
                'exp_date',
                'stock',
                'price',
                'exp_status',
                'status',
                'product_id',
            ])
            ->get()
            ->map(function ($lot) {
                return [
                    'id' => $lot->id,
                    'code' => $lot->code,
                    'exp_alert' => $lot->exp_alert,
                    'exp_date' => $lot->exp_date,
                    'stock' => $lot->stock,
                    'price' => $lot->price,
                    'exp_status' => $lot->exp_status,
                    'status' => $lot->status,
                    'product' => $lot->product->name ?? 'Sin producto',
                ];
            });
    }

    private function getColumns()
    {
        return [
            ['name' => 'code', 'tag' => 'Código'],
            ['name' => 'product', 'tag' => 'Producto'],
            ['name' => 'price', 'tag' => 'Precio'],
            ['name' => 'stock', 'tag' => 'Stock'],
            ['name' => 'exp_status', 'tag' => 'Estado Vencimiento'],
            ['name' => 'exp_date', 'tag' => 'Fecha Vencimiento'],
        ];
    }
}
