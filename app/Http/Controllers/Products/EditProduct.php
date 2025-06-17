<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Utils\Report;

class EditProducts extends Controller
{
    public const ROUTE = "products";

    public function edit(Request $request)
    {
        $id = $request->id;
        $object = Product::find($id);

        if (!$object) {
            return Report::error('Producto no encontrado.');
        }

        $request->validate([
            'code' => 'required|string|max:100|unique:products,code,' . $id,
            'name' => 'required|string|max:255',
            'picture' => 'nullable|string',
            'unit_id' => 'required|string',
            'categorie_id' => 'required|string',
        ]);

        $object->update([
            'code' => $request->code,
            'name' => $request->name,
            'picture' => $request->picture,
            'unit_id' => $request->unit_id,
            'categorie_id' => $request->categorie_id,
        ]);

        return Report::success(self::ROUTE, 'Producto actualizado correctamente.', [
            'updatedRecord' => $object->toArray()
        ]);
    }
}
