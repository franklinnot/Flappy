import { router } from '@inertiajs/react';
import { IconCalendar } from './Icons';

export default function ExpiringLotsCard({ cantidad }) {
    const goToLots = () => router.visit('/lots');

    return (
        <div
            onClick={goToLots}
            className="cursor-pointer select-none bg-[#547f92] hover:bg-[#476b7b] transition rounded-xl shadow p-4 flex flex-col items-center justify-center text-center space-y-3"
        >
            {/* Título */}
            <p className="text-sm text-white font-medium">
                Lotes próximos a vencer
            </p>

            {/* Icono y número lado a lado */}
            <div className="flex items-center space-x-4">
                <IconCalendar size={48} className="text-white" />
                <span className="text-4xl font-bold text-white">
                    {cantidad}
                </span>
            </div>
        </div>
    );
}
