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

export default function Dashboard({ totalVentas, totalClientes, ingresosMes, topVendedor, inventarioMovimientos, ventasPorMes }) {
    const title = 'Dashboard';

    return (
        <AuthenticatedLayout title={title} className="bg-[#f9fbff] ">
            <Head title={title} />
            <LineSales data={ventasPorMes} />

            {/* <PieInventory data={inventarioMovimientos} /> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                <Card
                    title="Ventas realizadas"
                    value={totalVentas}
                    icon={IconCart}
                    iconColor="text-purple-600"
                />
                <Card
                    title="Ingresos del mes"
                    value={`S/ ${ingresosMes.toFixed(2)}`}
                    icon={IconDollar}
                    iconColor="text-green-600"
                />
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
                    iconColor="text-yellow-500 fill-yellow-400" // relleno para la estrella
                />
            </div>
        </AuthenticatedLayout>
    );
}
