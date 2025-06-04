<?php

namespace App\Http\Controllers\Categories;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Models\Categorie;
use App\Utils\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewCategory extends Controller
{
    public const COMPONENT = 'Categories/NewCategory';
    public const ROUTE = "categories.new";

    public function show(Request $request)
    {
        return Inertia::render(self::COMPONENT, [
            'report' => $request->session()->get('report')
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:64',
        ]);

        $category = Categorie::create([
            'name' => $request->name,
            'status' => Status::ENABLED->value,
        ]);

        if (!$category) {
            Report::error('Error al registrar nueva categoría');
        }

        return Report::success(self::ROUTE, 'Categoría registrada correctamente');
    }
}
