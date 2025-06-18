<?php

namespace App\Http\Controllers\Categories;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Enums\Status;
use App\Utils\Report;

class ListCategories extends Controller
{
    public const COMPONENT = "Categories/ListCategories";
    public const MODULE = "categories";
    public const ROUTE = "categories";

    public function show(Request $request)
    {
        return Inertia::render(self::COMPONENT, [
            'records' => $this->getCategories(),
            'properties' => $this->getColumns(),
            'module' => self::MODULE,
            'status' => $request->session()->get('status') ?? Status::ENABLED->value,
        ]);
    }

    private function getCategories()
    {
        return Categorie::orderBy('created_at', 'desc')
            ->select(['id', 'name', 'status'])
            ->get();
    }

    private function getColumns()
    {
        return [
            ['name' => 'name', 'tag' => 'Nombre'],
        ];
    }
}
