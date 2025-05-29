<?php

namespace App\Http\Controllers\Payments;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Utils\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewMethod extends Controller
{
    public const COMPONENT = "Payments/NewMethod";

    public function show()
    {
        return Inertia::render(self::COMPONENT);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $method = Payment::create([
            'name' => $request->name,
            'status' => Status::ENABLED->value,
        ]);

        if (!$method) {
            Report::error('Error al registrar un nuevo metodo de pago');
        }

        return Inertia::render(self::COMPONENT, Report::success('Metodo de pago registrado correctamente'));
    }
}
