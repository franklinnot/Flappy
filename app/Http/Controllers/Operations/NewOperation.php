<?php

namespace App\Http\Controllers\Operations;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lot;
use App\Enums\Status;
use App\Enums\TypesOperation;
use App\Models\Operation;
use App\Models\Supplier;
use App\Utils\EnumHelper;
use Inertia\Inertia;
use App\Utils\Report;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class NewOperation extends Controller
{
    public const COMPONENT = "Operations/NewOperation";
    public const ROUTE = "operations.new";

    public function show()
    {
        return Inertia::render(self::COMPONENT, [
            'types' => TypesOperation::valuesWithId(),
            'suppliers' => $this->getSuppliers(),
            'lots' => $this->getLots(),
        ]);
    }

    private function getSuppliers()
    {
        return Supplier::select(['id', 'name'])
            ->where('status', Status::ENABLED->value)
            ->get();
    }

    private function getLots()
    {
        return Lot::with('product:id,name')
            ->where('status', Status::ENABLED->value)
            ->get()
            ->map(function ($lot) {
                return [
                    'id' => $lot->id,
                    'name' => "{$lot->code} - " . ($lot->product->name ?? ''),
                ];
            });
    }

    public function create(Request $request)
    {
        $request->validate([
            'type' => ['required', Rule::in(TypesOperation::names())],
            'supplier' => 'nullable|exists:suppliers,id',
            'quantity' => 'required|numeric|min:1',
        ]);

        // validamos el lote aqui para evitar una consulta doble
        $lot = Lot::find($request->lot);

        if (!$lot) {
            Report::error("Lote no encontrado.", "lot");
        }

        // datos de la request
        $type = EnumHelper::getValue(TypesOperation::class, $request->type);
        $type_output = TypesOperation::OUTPUT->value;

        $quantity = (int)$request->quantity;

        // si es una salida y el stock es mas bajo que la cantidad a retirar
        if ($type == $type_output && $lot->stock < $quantity) {
            return Report::error("No hay stock suficiente en el lote $lot->code.", "quantity");
        }

        // Una vez realizdas las validaciones
        $new_stock = 0;
        if ($type == $type_output) { // si es una salida
            $new_stock = $lot->stock - $quantity;
        } else { // si es una entrada
            $new_stock = $lot->stock + $quantity;
        }

        try {

            DB::beginTransaction();

            $lot->update([
                'stock' => (int)$new_stock
            ]);

            Operation::create([
                'user_id' => Auth::user()->id,
                'lot_id' => $request->lot,
                'type' => $type,
                'supplier_id' => $request->supplier,
                'quantity' => $quantity,
                'status' => Status::ENABLED->value,
            ]);

            DB::commit();

            return Report::success(self::ROUTE, 'Operación registrada correctamente');
        } catch (\Exception $e) {
            DB::rollBack();
            Report::error('Error al registrar una nueva operación.');
        }
    }
}
