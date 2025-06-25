<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\SaleDetails;
use App\Models\Lot;
use App\Models\Customer;
use App\Models\Payment;
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
        $lots = Lot::with([
            'product' => function ($q) {
                $q->select('_id', 'name', 'picture', 'unit_id')->with('unit:id,name');
            }
        ])
            ->where('status', Status::ENABLED->value)
            ->get()
            ->filter(function ($lot) {
                $hasValidStock = $lot->stock > 0;

                $isValidExp = true;
                if (!empty($lot->exp_status)) {
                    $isValidExp = $lot->exp_status == 'En vigencia' || $lot->exp_status == 'Próximo a vencer';
                }

                return $hasValidStock && $isValidExp;
            })
            ->map(function ($lot) {
                return [
                    'id' => $lot->id,
                    'name' => "{$lot->code} - " . ($lot->product->name ?? ''),
                    'code' => $lot->code,
                    'stock' => $lot->stock,
                    'price' => $lot->price,
                    'product' => [
                        'id' => $lot->product->id ?? null,
                        'name' => $lot->product->name ?? null,
                        'picture' => $lot->product->picture ?? null,
                        'unit' => $lot->product->unit->name ?? null,
                    ],

                ];
            })

            ->values();
        $paymentMethods = Payment::where('status', Status::ENABLED->value)
            ->select(['_id', 'name']) // Asegúrate de que el campo sea 'name'
            ->get()
            ->map(fn($method) => [
                'id' => $method->id,
                'name' => $method->name,
            ]);
        $customers = Customer::where('status', Status::ENABLED->value)
            ->select(['_id', 'name', 'dni', 'phone'])
            ->get()
            ->map(fn($customer) => [
                'id' => $customer->id,
                'name' => $customer->name,
                'dni' => $customer->dni,
                'phone' => $customer->phone,
            ]);

        return inertia(self::COMPONENT, [
            'lots' => $lots,
            'customers' => $customers,
            'paymentMethods' => $paymentMethods,
        ]);
    }




    // Crear venta con validaciones
    public function create(Request $request)
    {

        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.lot_id' => ['required', 'string', 'exists:lots,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:1'],
            'customer.id' => ['nullable', 'string', 'exists:customers,id'],
            'payment.id' => ['required', 'string', 'exists:payments,id'],

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
            'payment_id' => $request->input('payment.id') ?? null,
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
