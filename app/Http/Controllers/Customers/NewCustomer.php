<?php

namespace App\Http\Controllers\Customers;

use App\Utils\Report;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Enums\Status;
use App\Models\Customer;

class NewCustomer extends Controller
{
    public const COMPONENT = "Customers/NewCustomer";
    public const ROUTE = "customers.new";

    public function show(Request $request)
    {
        return Inertia::render(self::COMPONENT, [
            'report' => $request->session()->get('report')
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'dni' => 'required|digits:8|unique:customers,dni',
            'phone' => 'nullable|digits:9',
        ]);

        $customer = Customer::create([
            'name' => $request->name,
            'dni' => $request->dni,
            'phone' => $request->phone,
            'status' => Status::ENABLED->value,
        ]);

        if (!$customer) {
            Report::error('Error al registrar un nuevo cliente');
        }
        return Report::success(self::ROUTE, 'Cliente registrado correctamente');
    }
}
