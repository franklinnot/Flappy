<?php

namespace App\Http\Controllers\Lots;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lot;
use App\Enums\Status;
use App\Models\Product;
use Inertia\Inertia;
use App\Utils\Report;

class NewLot extends Controller
{
    public const ROUTE = "lots.new";

    public function show(Request $request)
    {
        return Inertia::render('Lots/NewLot', [
            'products' => Product::select('_id', 'name', 'code')->get(),
            'report' => $request->session()->get('report'),
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:lots,code',
            'initial_stock' => 'required|numeric|min:1',
            'price' => 'required|numeric|min:0.01',
            'exp_alert' => 'boolean',
            'exp_date' => 'nullable|date',
        ]);

        if ($request->exp_alert) {
            if (!$request->exp_date) {
                return response()->json([
                    'errors' => ['exp_date' => 'Debe ingresar una fecha.']
                ], 422);
            }

            $minDate = now()->addDays(30);
            if (strtotime($request->exp_date) < strtotime($minDate)) {
                return response()->json([
                    'errors' => ['exp_date' => 'La fecha debe ser mayor a 30 días desde hoy.']
                ], 422);
            }
        }

        $lot = Lot::create([
            'code'           => $request->code,
            'initial_stock'  => $request->initial_stock,
            'stock'          => $request->initial_stock,
            'price'          => $request->price,
            'exp_alert'      => $request->exp_alert,
            'exp_date'       => $request->exp_alert ? $request->exp_date : null,
            'exp_status'     => false,
            'status' => Status::ENABLED->value,
        ]);

        return Report::success(self::ROUTE, 'Lote registrado correctamente');
    }
}
