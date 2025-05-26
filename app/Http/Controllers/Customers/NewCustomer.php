<?php

namespace App\Http\Controllers\Customers;

use App\Enums\Roles;
use App\Utils\Report;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Utils\EnumHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use App\Enums\Status;
use App\Models\Customer;

class NewCustomer extends Controller
{
    public const COMPONENT = "Customers/NewCustomer";

    public function show()
    {
        return Inertia::render(self::COMPONENT);
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

        return inertia(self::COMPONENT, Report::success('Cliente registrado correctamente'));
    }


}
