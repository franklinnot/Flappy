<?php

namespace App\Http\Controllers\Operations;

use App\Http\Controllers\Controller;
use App\Enums\Status;
use App\Enums\TypesOperation;
use App\Models\Operation;
use App\Utils\Report;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatusOperations extends Controller
{
    public const ROUTE = "operations";

    public function disable($id)
    {
        $operation = Operation::with('lot')->find($id);
        $disabled_value = Status::DISABLED->value;

        if (!$operation) {
            return Report::error('Operación no encontrada.');
        } else if ($operation->status == $disabled_value) {
            return Report::error('La operación ya está deshabilitada.');
        }

        $operationCreatedAt = $operation->created_at;

        $sevenDaysAgo = Carbon::now()->subDays(7);
        if ($operationCreatedAt->lt($sevenDaysAgo)) {
            return Report::error('No es posible anular la operación, ya han pasado más de 7 días.');
        }

        $lot = $operation->lot;
        $quantity = $operation->quantity;

        if ($operation->type == TypesOperation::INPUT->value) {
            if ($lot->stock < $quantity) {
                return Report::error("No hay stock suficiente en el lote {$lot->code} para anular la entrada. Stock actual: {$lot->stock}, Cantidad a anular: {$quantity}.");
            }
        }

        DB::beginTransaction();

        try {
            if ($operation->type == TypesOperation::INPUT->value) {
                $lot->stock -= $quantity;
            } elseif ($operation->type == TypesOperation::OUTPUT->value) {
                $lot->stock += $quantity;
            }

            $lot->save();

            $operation->status = $disabled_value;
            $operation->save();

            DB::commit();

            return Report::success(self::ROUTE, 'Operación anulada correctamente.', [
                'updatedRecord' => $operation->toArray(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return Report::error('Ocurrió un error al anular la operación y ajustar el stock. Por favor, inténtelo de nuevo.');
        }
    }
}
