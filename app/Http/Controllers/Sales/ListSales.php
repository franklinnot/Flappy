<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleDetail;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Enums\Status;
use App\Utils\Report;

class ListSales extends Controller
{
    public const COMPONENT = "Sales/ListSales";
    public const MODULE = "sales";
    public const ROUTE = "sales";

    public function show(Request $request)
    {
        return Inertia::render(self::COMPONENT, [
            'records' => $this->getSales(),
            'properties' => $this->getColumns(),
            'module' => self::MODULE,
            'status' => $request->session()->get('status') ?? Status::ENABLED->value,
        ]);
    }

    private function getSales()
{
    return Sale::with(['customer', 'saleDetails.lot.product'])
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($sale) {
            return [
                'id' => $sale->id,
                'code' => $sale->code,
                'total' => $sale->total,
                'status' => $sale->status, 
                'customer' => $sale->customer?->name ?? null,
                'created_at' => $sale->created_at?->format('d/m/Y h:i A'),
                'user' => $sale->user?->name ?? 'No registrado', 
                'details' => $sale->saleDetails->map(function ($detail) {
                    return [
                        'product' => $detail->lot?->product?->name ?? 'Producto no encontrado',
                        'price' => $detail->price,
                        'quantity' => $detail->quantity,
                        'subtotal' => $detail->subtotal,
                    ];
                }),
            ];
        });
}



    private function getColumns()
    {
        return [
            ['name' => 'code', 'tag' => 'Código'],
            ['name' => 'customer', 'tag' => 'Cliente'],
            ['name' => 'total', 'tag' => 'Total'],
        ];
    }


public function enable($id)
{
    $sale = Sale::findOrFail($id);
    $sale->status = 'Habilitado';
    $sale->save();

    return Report::success(self::ROUTE, 'Venta habilitada correctamente.');
}

public function disable($id)
{
    $sale = Sale::findOrFail($id);
    $sale->status = 'Deshabilitado';
    $sale->save();

    return Report::success(self::ROUTE, 'Venta deshabilitada correctamente.');
}
   

}
