<?php

namespace App\Http\Controllers\Lots;

use App\Enums\ExpirationStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lot;
use App\Enums\Status;
use App\Enums\TypesOperation;
use App\Models\Operation;
use App\Models\Product;
use Inertia\Inertia;
use App\Utils\Report;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NewLot extends Controller
{
    public const COMPONENT = "Lots/NewLot";
    public const ROUTE = "lots.new";

    public function show()
    {
        return Inertia::render(self::COMPONENT, [
            'products' => $this->getProducts(),
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

        $stock = (int) $request->initial_stock;

        try {

            DB::beginTransaction();

            $lot = Lot::create([
                'code'           => $request->code,
                'product_id'     => $request->product,
                'stock'          => $stock,
                'price'          => (float) $request->price,
                'exp_alert'      => $request->exp_alert,
                'exp_date'       => $exp_alert ? $exp_date : null,
                'exp_status' => $exp_alert ? ExpirationStatus::calculateFromDate($exp_date) : null,
                'status' => Status::ENABLED->value,
            ]);

            Operation::create([
                'user_id' => Auth::user()->id,
                'lot_id' => $lot->id,
                'type' => TypesOperation::INPUT->value,
                'quantity' => $stock,
                'status' => Status::ENABLED->value,
            ]);

            DB::commit();

            return Report::success(self::ROUTE, 'Lote registrado correctamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return Report::error('Error al registrar un nuevo lote.');
        }
    }
}
