<?php

namespace App\Http\Controllers\Lots;

use App\Enums\ExpirationStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lot;
use App\Enums\Status;
use App\Models\Product;
use Inertia\Inertia;
use App\Utils\Report;

class NewLot extends Controller
{
    public const COMPONENT = "Lots/NewLot";
    public const ROUTE = "lots.new";

    public function show(Request $request)
    {
        return Inertia::render(self::COMPONENT, [
            'products' => $this->getProducts(),
            'report' => $request->session()->get('report'),
        ]);
    }

    private function getProducts()
    {
        return Product::select(['id', 'name'])
            ->where('status', Status::ENABLED->value)
            ->get();
    }

    public function create(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:lots,code|uppercase|max:24',
            'product' => 'required|exists:products,id',
            'initial_stock' => 'required|numeric|min:1',
            'price' => 'required|numeric|min:0.1',
            'exp_alert' => 'required|boolean',
            'exp_date' => 'nullable|date|after:' . now()->addDays(6)->format('Y-m-d'),
        ]);

        $exp_alert = $request->exp_alert;
        $exp_date = $request->exp_date;
        if ($exp_alert && !$exp_date) {
            Report::error('Debe ingresar una fecha de vencimiento.', 'exp_date');
        }

        $lot = Lot::create([
            'code'           => $request->code,
            'product_id'     => $request->product,
            'stock'          => $request->initial_stock,
            'price'          => $request->price,
            'exp_alert'      => $request->exp_alert,
            'exp_date'       => $exp_alert ? $exp_date : null,
            'exp_status'     => $exp_alert ? ExpirationStatus::VALID->value : null,
            'status' => Status::ENABLED->value,
        ]);

        if (!$lot) {
            Report::error('Error al registrar un nuevo lote.');
        }

        return Report::success(self::ROUTE, 'Lote registrado correctamente');
    }
}
