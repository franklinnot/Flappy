<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Unit;
use App\Models\Categorie;
use App\Utils\Report;
use App\Enums\Status;

class NewProduct extends Controller
{
    public const COMPONENT = "Products/NewProduct";

    public function show()
    {
        return inertia(self::COMPONENT, [
            "units" => $this->getUnits(),
            "categories" => $this->getCategories(),
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:24|unique:products,code',
            'name' => 'required|string|max:255',
            'picture' => [
                'nullable',
                'url',
                'regex:/\.(jpeg|jpg|png|gif|bmp|webp)$/i',
            ],
            'unit' => 'required|exists:units,_id',
            'categorie' => 'required|exists:categories,_id',
        ]);

        $product = Product::create([
            'code' => $request->code,
            'name' => $request->name,
            'picture' => $request->picture,
            'status' => Status::ENABLED->value,
            'unit_id' => $request->unit,
            'categorie_id' => $request->categorie,
        ]);

        if (!$product) {
            Report::error('Error al registrar un nuevo producto');
        }

        return inertia(self::COMPONENT, Report::success(
            'Producto registrado correctamente',
            [
                "units" => $this->getUnits(),
                "categories" => $this->getCategories(),
            ]
        ));
    }

    private function getUnits()
    {
        return Unit::where('status', Status::ENABLED->value)->get();
    }

    private function getCategories()
    {
        return Categorie::where('status', Status::ENABLED->value)->get();
    }
}
