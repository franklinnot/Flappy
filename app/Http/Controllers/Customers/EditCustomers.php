<?php

namespace App\Http\Controllers\Customers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Utils\Report;

class EditCustomers extends Controller
{
    public const ROUTE = "customers";

    public function edit(Request $request)
    {
        $id = $request->id;
        $customer = Customer::find($id);

        if (!$customer) {
            return Report::error('Cliente no encontrado.');
        }

        $request->validate([
            'dni' => 'required|digits:8|unique:customers,dni,' . $id,
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
        ]);

        $customer->dni = $request->dni;
        $customer->name = $request->name;
        $customer->phone = $request->phone;
        $customer->save();

        return Report::success(self::ROUTE, 'Cliente actualizado correctamente', [
            'updatedRecord' => $customer->toArray()
        ]);
    }
}