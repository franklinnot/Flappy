export default function ProductsRanking({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow p-6 w-full max-w-3xl mx-auto select-none">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Productos más vendidos</h3>
                <p className="text-center text-gray-500">No hay datos disponibles.</p>
            </div>
        );
    }

    const maxCantidad = Math.max(...data.map(p => p.cantidad));

    const colores = [
        'bg-[#547f92]',
        'bg-[#b8cedc]',
        'bg-[#7a9eab]',
        'bg-[#9dbec9]',
        'bg-[#c7dbe6]',
        'bg-[#6d9fae]',
        'bg-[#8eb5c2]',
        'bg-[#a1c7d3]',
    ];

    return (
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-3xl mx-auto select-none">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Productos más vendidos</h3>
            <ul className="space-y-4">
                {data.map((item, index) => {
                    const porcentaje = (item.cantidad / maxCantidad) * 100;
                    const bgColor = colores[index] || 'bg-gray-300';

                    return (
                        <li key={index} className="flex flex-col">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600 truncate max-w-[70%]">
                                    #{index + 1} {item.nombre}
                                </span>
                                <span className="text-sm text-gray-600">{item.cantidad}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                    className={`h-4 ${bgColor} transition-all duration-300`}
                                    style={{ width: `${porcentaje}%` }}
                                />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
