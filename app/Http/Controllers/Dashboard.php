<?php

namespace App\Http\Controllers;

use App\Enums\ExpirationStatus;
use App\Enums\Status;
use App\Models\Customer;
use App\Models\Lot;
use App\Models\Sale;
use App\Models\User;
use App\Enums\TypesOperation;
use App\Models\Operation;
use App\Models\SaleDetails;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class Dashboard extends Controller
{
    public const COMPONENT = 'Dashboard';

    public function show(): Response
    {
        // Total de ventas
        $totalVentas = Sale::count();

        // Total de clientes
        $totalClientes = Customer::count();

        // Ingresos del mes actual
        $ingresosMes = Sale::whereBetween('created_at', [
            Carbon::now()->startOfMonth(),
            Carbon::now()->endOfMonth()
        ])->sum('total');

        //Ingresos totales
        $ingresosTotales = Sale::sum('total');

        // Vendedor con más ventas
        $rankingVendedores = Sale::raw(function ($collection) {
            return $collection->aggregate([
                ['$group' => ['_id' => '$user_id', 'totalVentas' => ['$sum' => 1]]],
                ['$sort' => ['totalVentas' => -1]],
                ['$limit' => 1],
            ]);
        });

        $topVendedorId = $rankingVendedores[0]->_id ?? null;
        $topVendedor = $topVendedorId ? User::find($topVendedorId) : null;

        // Recuento de operaciones por tipo 
        $operaciones = Operation::raw(function ($collection) {
            return $collection->aggregate([
                ['$match' => ['status' => Status::ENABLED->value]],
                ['$group' => [
                    '_id' => '$type',
                    'cantidad' => ['$sum' => 1],
                ]],
            ]);
        });

        $ingresos = 0;
        $salidas = 0;

        foreach ($operaciones as $op) {
            if ($op->_id === TypesOperation::INPUT->value) {
                $ingresos = $op->cantidad;
            } elseif ($op->_id === TypesOperation::OUTPUT->value) {
                $salidas = $op->cantidad;
            }
        }

        // Ventas x mes
        $ventasPorMes = Sale::raw(function ($collection) {
            return $collection->aggregate([
                [
                    '$group' => [
                        '_id' => [
                            'year' => ['$year' => '$created_at'],
                            'month' => ['$month' => '$created_at'],
                        ],
                        'totalVentas' => ['$sum' => 1],
                    ],
                ],
                [
                    '$sort' => [
                        '_id.year' => 1,
                        '_id.month' => 1,
                    ],
                ],
            ]);
        });

        setlocale(LC_TIME, 'es_ES.UTF-8');

        $ventasMapeadas = collect($ventasPorMes)->keyBy(function ($item) {
            return (int)$item->_id['month'];
        });

        $ventasPorMesFormateadas = collect();
        $mesActual = Carbon::now()->month;

        for ($i = 1; $i <= $mesActual; $i++) {
            $item = $ventasMapeadas->get($i);
            $fecha = Carbon::create(null, $i, 1);
            $ventasPorMesFormateadas->push([
                'mes' => ucfirst($fecha->translatedFormat('F')), // Ej: Enero, Febrero
                'cantidad' => $item->totalVentas ?? 0,
            ]);
        }

        // Top 5 productos más vendidos
        $topProductos = SaleDetails::raw(function ($collection) {
            return $collection->aggregate([
                [
                    '$group' => [
                        '_id' => '$lot_id',
                        'totalVendidos' => ['$sum' => '$quantity']
                    ]
                ],
                [
                    '$sort' => ['totalVendidos' => -1]
                ],
                [
                    '$limit' => 6
                ]
            ]);
        });

        $productosVendidos = collect($topProductos)->map(function ($item) {
            $lot = Lot::find($item->_id);
            $producto = $lot?->product;

            return [
                'nombre' => $producto?->name ?? 'Producto eliminado',
                'cantidad' => $item->totalVendidos,
            ];
        });

        // Lotes Proximos a Vencer
        $proximosAVencer = Lot::where('exp_status', ExpirationStatus::ALERT->value)->count();

        return Inertia::render(self::COMPONENT, [
            'totalVentas' => $totalVentas,
            'totalClientes' => $totalClientes,
            'ingresosMes' => $ingresosMes,
            'ingresosTotales' => $ingresosTotales,
            'topVendedor' => $topVendedor ? [
                'name' => $topVendedor->name,
                'total' => $rankingVendedores[0]->totalVentas ?? 0,
            ] : null,
            'inventarioMovimientos' => [
                'ingresos' => $ingresos,
                'salidas' => $salidas,
            ],
            'ventasPorMes' => $ventasPorMesFormateadas,
            'productosMasVendidos' => $productosVendidos,
            'proximosAVencer' => $proximosAVencer,
        ]);
    }
}
