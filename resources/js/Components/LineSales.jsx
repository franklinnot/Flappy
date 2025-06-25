import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export default function LineSales({ data }) {
    const noData = !data || data.length === 0;

    return (
        <div className="bg-white rounded-xl shadow p-6 select-none cursor-default">
            <h3 className="text-lg font-bold mb-6 text-gray-700">Ventas por Mes</h3>

            {noData ? (
                <p className="text-center text-gray-500">No hay datos de ventas.</p>
            ) : (
                <div className="h-80 w-full sm:w-[600px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="mes"
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                angle={-25}
                                textAnchor="end"
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    padding: '6px 10px',
                                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
                                }}
                                labelStyle={{
                                    fontWeight: 500,
                                    color: '#4b5563',
                                    fontSize: '12px',
                                    marginBottom: '4px',
                                }}
                                itemStyle={{
                                    color: '#6b7280',
                                    fontSize: '12px',
                                }}
                                formatter={(value) => `${value} venta${value !== 1 ? 's' : ''}`}
                            />

                            <Line
                                type="monotone"
                                dataKey="cantidad"
                                stroke="#547f92"
                                strokeWidth={2}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
