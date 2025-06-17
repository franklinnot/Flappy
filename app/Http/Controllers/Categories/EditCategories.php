<?php

namespace App\Http\Controllers\Categories;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use Illuminate\Http\Request;
use App\Utils\Report;

class EditCategories extends Controller
{
    public const ROUTE = "categories";

    public function edit(Request $request)
    {
        $id = $request->id;
        $object = Categorie::find($id);

        if (!$object) {
            return Report::error('Categoria no encontrada.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $object->update([
            'name' => $request->name,
        ]);

        return Report::success(self::ROUTE, 'Categoria actualizada correctamente', [
            'updatedRecord' => $object->toArray()
        ]);
    }
}
