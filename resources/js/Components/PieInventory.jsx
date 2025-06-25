import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#547f92', '#b8cedc']; // Entrada, Salida
const LABEL_COLORS = ['#f9fbff', '#374151']; // Texto sobre fondo azul oscuro y fondo claro

export default function PieInventory({ data }) {
    const ingresos = Number(data?.ingresos) || 0;
    const salidas = Number(data?.salidas) || 0;

    const chartData = [
        { name: 'Entrada', value: ingresos },
        { name: 'Salida', value: salidas },
    ];

    const noData = ingresos === 0 && salidas === 0;

    const renderLabel = (props) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill={LABEL_COLORS[index]}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={13}
                fontWeight="500"
            >
                {(percent * 100).toFixed(0)}%
            </text>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white text-sm text-gray-700 border border-gray-200 shadow px-3 py-2 rounded-md">
                    <p className="font-medium">{payload[0].name}</p>
                    <p className="text-gray-500">Cantidad: {payload[0].value}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 select-none cursor-default">
            <h3 className="text-lg font-bold mb-6 text-gray-700">
                Operaciones de Inventario
            </h3>

            {noData ? (
                <p className="text-center text-gray-500">No hay movimientos registrados.</p>
            ) : (
                <div className="flex items-center justify-center">
                    {/* Gráfico circular */}
                    <div className="w-48 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderLabel}
                                    outerRadius={70}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Leyenda a la derecha */}
                    <div className="ml-6 space-y-3">
                        {chartData.map((entry, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <span
                                    className="inline-block w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                ></span>
                                <span className="text-sm font-medium text-gray-500">
                                    {entry.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}