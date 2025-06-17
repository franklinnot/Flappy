<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Enums\Status;
use App\Utils\Report;

class ListProducts extends Controller
{
    public const COMPONENT = "Products/ListProducts";
    public const MODULE = "products";
    public const ROUTE = "products";

    public function show(Request $request)
    {
        return Inertia::render(self::COMPONENT, [
            'records' => $this->getProducts(),
            'properties' => $this->getColumns(),
            'module' => self::MODULE,
            'status' => $request->session()->get('status') ?? Status::ENABLED->value,
        ]);
    }

    public function edit() {}

    public function enable($id)
    {
        $object = Product::find($id);
        $enabled_value = Status::ENABLED->value;

        if (!$object) {
            return Report::error('Producto no encontrado.');
        } else if ($object->status == $enabled_value) {
            return Report::error('El producto ya está habilitado.');
        }

        $old_status = $object->status;
        $object->status = $enabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Producto habilitado correctamente.', [
            'status' => $old_status
        ]);
    }

    public function disable($id)
    {
        $object = Product::find($id);
        $disabled_value = Status::DISABLED->value;

        if (!$object) {
            return Report::error('Producto no encontrado.');
        } else if ($object->status == $disabled_value) {
            return Report::error('El producto ya está deshabilitado.');
        }

        $old_status = $object->status;
        $object->status = $disabled_value;
        $object->save();

        return Report::success(self::ROUTE, 'Producto deshabilitado correctamente.', [
            'status' => $old_status
        ]);
    }

    private function getProducts()
    {
        return Product::with(['unit', 'categorie'])
            ->orderBy('created_at', 'desc')
            ->select(['id', 'code', 'name', 'picture', 'status', 'unit_id', 'categorie_id'])
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'code' => $product->code,
                    'name' => $product->name,
                    'picture' => $product->picture,
                    'status' => $product->status,
                    'unit' => $product->unit->name ?? '',
                    'categorie' => $product->categorie->name ?? '',
                ];
            });
    }

    private function getColumns()
    {
        return [
            ['name' => 'picture', 'tag' => 'Imagen'],
            ['name' => 'code', 'tag' => 'Código'],
            ['name' => 'name', 'tag' => 'Nombre'],
            ['name' => 'unit', 'tag' => 'Unidad de medida'],
            ['name' => 'categorie', 'tag' => 'Categoría'],
        ];
    }
}
