<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\SaleDetails;
use App\Models\Lot;
use App\Models\Customer;
use App\Enums\Status;
use App\Utils\Report;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class NewSale extends Controller
{
    public const COMPONENT = "Sales/NewSale";
    public const ROUTE = "sales.new";

    // Mostrar formulario con lotes y clientes activos
    public function show()
    {
        $lots = Lot::with('product:id,name')
            ->where('status', Status::ENABLED->value)
            ->where('exp_status', 'En vigencia')
            ->get()
            ->filter(fn($lot) => (float) $lot->stock > 0) // Aceptar stock como número o string
            ->map(function ($lot) {
                return [
                    'id' => $lot->id,
                    'name' => "{$lot->code} - " . ($lot->product->name ?? ''),
                    'code' => $lot->code,
                    'stock' => (float) $lot->stock,   // ← Conversión aquí
                    'price' => (float) $lot->price,   // ← Conversión aquí
                ];
            })
            ->values(); // Reindexar array (clave 0, 1, 2...)

        $customers = Customer::where('status', Status::ENABLED->value)
            ->select(['_id', 'name'])
            ->get()
            ->map(fn($customer) => [
                'id' => $customer->id,
                'name' => $customer->name,
            ]);

        return inertia(self::COMPONENT, [
            'lots' => $lots,
            'customers' => $customers,
        ]);
    }

    // Crear venta con validaciones
    public function create(Request $request)
    {
        \Log::info('Create sale request', $request->all());

        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.lot_id' => ['required', 'string', 'exists:lots,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:1'],
            'customer.id' => ['nullable', 'string', 'exists:customers,id'],
        ]);

        $items = $validated['items'];
        $total = 0;

        foreach ($items as $item) {
            $lot = Lot::find($item['lot_id']);

            if (!$lot) {
                Report::error("Lote no encontrado: ID {$item['lot_id']}", "lot");
            }

            if ((float) $lot->stock < $item['quantity']) {
                Report::error("Stock insuficiente en el lote {$lot->code}.", "lot");
            }

            $subtotal = (float) $lot->price * $item['quantity'];
            $total += $subtotal;
        }

        // Validar cliente si el total excede 700
        if ($total > 700 && empty($request->input('customer.id'))) {
            throw ValidationException::withMessages([
                'customer' => ['Debe seleccionar un cliente para ventas mayores a S/.700.'],
            ]);
        }

        // Crear venta
        $sale = Sale::create([
            'code' => 'V-' . now()->format('YmdHis'),
            'customer_id' => $request->input('customer.id') ?? null,
            'total' => $total,
            'status' => Status::ENABLED->value,
            'user_id' => Auth::id(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if (!$sale) {
            Report::error('Error al registrar la venta.');
        }

        foreach ($items as $item) {
            $lot = Lot::find($item['lot_id']);

            SaleDetails::create([
                'sale_id' => $sale->id,
                'lot_id' => $lot->id,
                'quantity' => $item['quantity'],
                'price' => (float) $lot->price,
                'subtotal' => (float) $lot->price * $item['quantity'],
            ]);

            $lot->decrement('stock', $item['quantity']);
        }

        return Report::success(self::ROUTE, 'Venta registrada correctamente');
    }
}