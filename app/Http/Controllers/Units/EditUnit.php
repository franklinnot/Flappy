<?php


namespace App\Http\Controllers\Units;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Unit;
use App\Utils\Report;

class EditUnit extends Controller
{
    public const ROUTE = "units";

    public function edit(Request $request)
    {
        $id = $request->id;
        $unit = Unit::find($id);

        if (!$unit) {
            return Report::error('Unidad no encontrada.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10',
        ]);

        $unit->name = $request->name;
        $unit->code = $request->code;
        $unit->save();

        return Report::success(self::ROUTE, 'Unidad actualizada correctamente', [
            'updatedRecord' => $unit->toArray()
        ]);
    }
}