<?php

namespace App\Http\Controllers\Suppliers;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use App\Utils\Report;

class EditSuppliers extends Controller
{
    public const ROUTE = "suppliers";

    public function edit(Request $request)
    {
        $id = $request->id;
        $object = Supplier::find($id);

        if (!$object) {
            return Report::error('Proveedor no encontrado.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|digits:9|unique:suppliers,phone,' . $id,
            'email' => 'nullable|email|max:255|unique:suppliers,email,' . $id,
            'address' => 'nullable|string|max:255',
        ]);

        $object->update([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'address' => $request->address,
        ]);

        return Report::success(self::ROUTE, 'Proveedor actualizado correctamente', [
            'updatedRecord' => $object->toArray()
        ]);
    }
}
