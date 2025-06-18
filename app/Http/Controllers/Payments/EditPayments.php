<?php

namespace App\Http\Controllers\Payments;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Utils\Report;

class EditPayments extends Controller
{
    public const ROUTE = "payments";

    public function edit(Request $request)
    {
        $id = $request->id;
        $payment = Payment::find($id);

        if (!$payment) {
            return Report::error('Método de pago no encontrado.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $payment->name = $request->name;
        $payment->save();

        return Report::success(self::ROUTE, 'Método de pago actualizado correctamente', [
            'updatedRecord' => $payment->toArray()
        ]);
    }
}