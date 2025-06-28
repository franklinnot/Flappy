import { useEffect } from "react";
import { IconClose } from "@/Components/Icons";

export default function ShowSale({ onClose, sale }) {
    useEffect(() => {
        document.body.classList.add("overflow-hidden");
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            {/* Fondo difuminado */}
            <div className="fixed inset-0 z-20 bg-slate-700 bg-opacity-60 backdrop-blur-sm" />

            {/* Modal tipo boleta */}
            <div className="fixed inset-0 z-30 flex items-center justify-center">
                <div className="bg-white w-[380px] mx-4 rounded-2xl shadow-xl p-6 font-mono border border-gray-300">
                    {/* Encabezado boleta */}
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h3 className="text-lg font-bold text-gray-700">BOLETA DE VENTA</h3>
                        <button
                            onClick={onClose}
                            className="text-slate-700 hover:text-white hover:bg-slate-700 p-1 rounded-full transition-colors"
                            title="Cerrar"
                        >
                            <IconClose size={20} />
                        </button>
                    </div>

                    <div className="text-sm text-gray-800 space-y-1">
                        <p><strong>Código:</strong> {sale.code}</p>
                        <p><strong>Cliente:</strong> {sale.customer ?? "Sin cliente"}</p>
                        <p><strong>Estado:</strong> {sale.status}</p>
                        <p><strong>Fecha:</strong> {sale.created_at}</p>
                        <p><strong>Registrado por:</strong> {sale.user}</p>
                    </div>

                    <div className="mt-4">
                        <p className="font-semibold mb-2">Detalle de Productos:</p>
                        <table className="w-full text-sm text-left border-t border-b border-gray-300">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th className="text-right">Cant.</th>
                                    <th className="text-right">P.U.</th>
                                    <th className="text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sale.details.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.product}</td>
                                        <td className="text-right">{item.quantity}</td>
                                        <td className="text-right">S/.{item.price.toFixed(2)}</td>
                                        <td className="text-right">S/.{item.subtotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="text-right font-bold mt-2">
                            Total: S/. {sale.total.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
