export default function Table({
    columns = [],
    records = [],
    className = "",
    loading = false,
    actions = null, 
    ...props
}) {
    return (
        <div className={`w-full overflow-auto rounded-md border border-gray-200 shadow-sm ${className}`} {...props}>
            <table className="w-full table-auto text-sm text-left text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.id}
                                className="px-4 py-2 font-medium text-gray-600"
                            >
                                {col.name}
                            </th>
                        ))}
                        {actions && <th className="px-4 py-2">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-4 text-center text-gray-500">
                                Cargando datos...
                            </td>
                        </tr>
                    ) : records.length > 0 ? (
                        records.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50">
                                {columns.map((col) => (
                                    <td
                                        key={col.id}
                                        className="px-4 py-2 whitespace-nowrap"
                                    >
                                        {record[col.id]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {typeof actions === "function"
                                            ? actions(record)
                                            : actions}
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + (actions ? 1 : 0)}
                                className="px-4 py-4 text-center text-gray-400"
                            >
                                No hay registros disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
