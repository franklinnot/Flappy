<?php

namespace App\Http\Controllers\Payments;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Utils\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewPayment extends Controller
{
    public const COMPONENT = "Payments/NewPayment";
    public const ROUTE = "payment.new";

    public function show(Request $request)
    {
        return Inertia::render(self::COMPONENT, [
            'report' => $request->session()->get('report')
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:64|unique:payments,name',
        ]);

        $method = Payment::create([
            'name' => $request->name,
            'status' => Status::ENABLED->value,
        ]);

        if (!$method) {
            Report::error('Error al registrar un nuevo metodo de pago');
        }

        return redirect()
            ->route(SELF::ROUTE)
            ->with(Report::success('Método de pago registrado correctamente'));
    }
}
