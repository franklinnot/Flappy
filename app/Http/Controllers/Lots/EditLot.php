<?php

namespace App\Http\Controllers\Lots;

use App\Enums\ExpirationStatus;
use App\Http\Controllers\Controller;
use App\Models\Lot;
use Illuminate\Http\Request;
use App\Utils\Report;

class EditLot extends Controller
{
    public const ROUTE = "lots";

    public function edit(Request $request)
    {
        $id = $request->id;
        $object = Lot::find($id);

        if (!$object) {
            return Report::error('Lote no encontrado.');
        }

        $request->validate([
            'price' => 'required|numeric|min:0.1',
            'exp_alert' => 'required|boolean',
        ]);

        $exp_alert = $request->exp_alert;
        $exp_date = $request->exp_date;
        $exp_status = $object->exp_status;

        // Si antes no tenía alerta y ahora sí, se valida la fecha
        if (!$object->exp_alert && $exp_alert) {
            $request->validate([
                'exp_date' => 'required|date|after:' . now()->addDays(6)->format('Y-m-d'),
            ]);
        }
        if ($exp_alert) {
            $exp_status = ExpirationStatus::calculateFromDate($exp_date);
        }

        $object->update([
            'price'       => (float) $request->price,
            'exp_alert'   => $exp_alert,
            'exp_date'    => (!$object->exp_alert && $exp_alert) ? $exp_date : $object->exp_date,
            'exp_status'  => $exp_status,
        ]);

        return Report::success(self::ROUTE, 'Lote actualizado correctamente.', [
            'updatedRecord' => $object->load('product')->toArray(),
        ]);
    }
}
