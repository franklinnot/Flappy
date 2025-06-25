export default function ProductsRanking({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Productos más vendidos</h3>
                <p className="text-center text-gray-500">No hay datos disponibles.</p>
            </div>
        );
    }

    const maxCantidad = Math.max(...data.map(p => p.cantidad));

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Productos más vendidos</h3>
            <ul className="space-y-4">
                {data.map((item, index) => (
                    <li key={index} className="flex items-center space-x-4">
                        <span className="w-32 truncate text-sm text-gray-700">{item.nombre}</span>
                        <div className="flex-1 bg-gray-200 rounded h-4 relative">
                            <div
                                className="bg-blue-500 h-4 rounded"
                                style={{ width: `${(item.cantidad / maxCantidad) * 100}%` }}
                            />
                        </div>
                        <span className="w-8 text-sm text-gray-600 text-right">{item.cantidad}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
