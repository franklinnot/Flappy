import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    IconCart,
    IconDollar,
    IconStar,
    IconUsers
} from '@/Components/Icons';
import Card from '@/Components/Card';
import PieInventory from '@/Components/PieInventory';
import LineSales from '@/Components/LineSales';
import ProductsRanking from '@/Components/ProductsRanking';
import ExpiringLotsCard from '@/Components/ExpiringLotsCard';
import { useState } from 'react';

export default function Dashboard({
    totalVentas,
    totalClientes,
    ingresosMes,
    ingresosTotales,
    topVendedor,
    inventarioMovimientos,
    ventasPorMes,
    productosMasVendidos,
    proximosAVencer
}) {
    const title = 'Dashboard';
    const [mostrarTotal, setMostrarTotal] = useState(false);

    return (
        <AuthenticatedLayout title={title} className="bg-[#f9fbff]">
            <Head title={title} />

            <div className="space-y-6 px-6 py-8 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card
                        title="Ventas realizadas"
                        value={totalVentas}
                        icon={IconCart}
                        iconColor="text-purple-600"
                    />
                    <div
                        onClick={() => setMostrarTotal(!mostrarTotal)}
                        className="cursor-pointer"

                    >
                        <Card
                            title={mostrarTotal ? "Ingresos totales" : "Ingresos del mes"}
                            value={`S/ ${mostrarTotal ? ingresosTotales.toFixed(2) : ingresosMes.toFixed(2)}`}
                            icon={IconDollar}
                            iconColor="text-green-600"
                            isToggleCard
                        />
                    </div>

                    <Card
                        title="Clientes registrados"
                        value={totalClientes}
                        icon={IconUsers}
                        iconColor="text-blue-600"
                    />
                    <Card
                        title="Top vendedor"
                        value={topVendedor ? `${topVendedor.name} (${topVendedor.total})` : '—'}
                        icon={IconStar}
                        iconColor="text-yellow-500 fill-yellow-400"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6">
                    <ProductsRanking data={productosMasVendidos} />

                    <LineSales data={ventasPorMes} />

                    <div className="space-y-4">
                        <ExpiringLotsCard cantidad={proximosAVencer} />
                        <PieInventory data={inventarioMovimientos} />
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
