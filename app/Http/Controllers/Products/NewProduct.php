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
    public const ROUTE = "products.new";

    public function show(Request $request)
    {
        return inertia(self::COMPONENT, [
            "units" => $this->getUnits(),
            "categories" => $this->getCategories(),
            'report' => $request->session()->get('report')
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:24|uppercase|unique:products,code',
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

        return Report::success(self::ROUTE, 'Producto registrado correctamente');
    }

    private function getUnits()
    {
        return Unit::select(['id', 'name'])
            ->where('status', Status::ENABLED->value)
            ->get();
    }

    private function getCategories()
    {
        return Categorie::select(['id', 'name'])
            ->where('status', Status::ENABLED->value)
            ->get();
    }
}
