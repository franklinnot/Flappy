<?php

namespace App\Http\Controllers\Suppliers;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Utils\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewSupplier extends Controller
{
    public const COMPONENT = "Suppliers/NewSupplier";
    public const ROUTE = "suppliers.new";

    public function show()
    {
        return Inertia::render(self::COMPONENT);
    }

    public function create(Request $request)
    {
        $request->validate([
            'ruc' => 'required|digits:11|unique:suppliers,ruc',
            'name' => 'required|string|max:255',
            'phone' => 'required|digits:9|unique:suppliers,phone',
            'email' => 'nullable|email|max:255|unique:suppliers,email',
            'address' => 'nullable|string|max:255',
        ]);

        $supplier = Supplier::create([
            'name' => $request->name,
            'ruc' => $request->ruc,
            'address' => $request->address,
            'email' => $request->email,
            'phone' => $request->phone,
            'status' => Status::ENABLED->value,
        ]);

        if (!$supplier) {
            Report::error('Error al registrar un nuevo proveedor');
        }
        
        return Report::success(self::ROUTE, 'Proveedor registrado correctamente');
    }
}
