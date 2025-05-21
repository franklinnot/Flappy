import React, { useEffect, useState } from "react";
import {
    IconClose,
    IconInformation,
    IconCheck,
    IconWarning,
    IconError,
} from "./Icons";

const bgColorMap = {
    success: "bg-emerald-500 text-white border-green-600",
    error: "bg-rose-500 text-white border-red-600",
    warning: "bg-orange-500 text-white border-orange-600",
    information: "bg-gray-900 text-gray-100 border-black",
};

export default function Toast({
    message,
    type = "information",
    duration = 5000,
    className = "",
}) {
    const [visible, setVisible] = useState(true); // Opacidad
    const [shouldRender, setShouldRender] = useState(true); // DOM

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false); // Dispara fade-out
            // Espera que termine la animación antes de desmontar
            setTimeout(() => setShouldRender(false), 300); // 300ms = duración del fade-out
        }, duration);
        return () => clearTimeout(timer);
    }, [duration]);

    // Botón cerrar manual
    const handleClose = () => {
        setVisible(false);
        setTimeout(() => setShouldRender(false), 300);
    };

    if (!shouldRender) return null;

    const styles = `${bgColorMap[type] || bgColorMap.information} ${className}`;

    return (
        <div
            className={`fixed top-16 right-4 w-auto max-w-[520px] rounded-lg shadow-lg overflow-hidden transition-opacity duration-300 ease-in-out border-b-[1px]
        ${visible ? "opacity-100" : "opacity-0"} ${styles}`}
        >
            <div className="relative flex flex-row items-center justify-between px-4 py-3 gap-3 top-[1px]">
                <div className="flex items-center gap-2">
                    <div>
                        {type === "success" ? (
                            <IconCheck
                                size={20}
                                strokeWidth={4}
                                className="text-emerald-500 rounded-full p-1 bg-white"
                            />
                        ) : type === "error" ? (
                            <IconError size={20} strokeWidth={2} />
                        ) : type === "warning" ? (
                            <IconWarning
                                size={20}
                                strokeWidth={2.8}
                                className="text-orange-500 rounded-full p-1 bg-white"
                            />
                        ) : (
                            <IconInformation size={20} strokeWidth={2} />
                        )}
                    </div>
                    <span className="text-sm text-wrap">{message}</span>
                </div>

                <button
                    onClick={handleClose}
                    className="h-full w-[20px] hover:bg-white/10 rounded-full"
                    aria-label="Cerrar"
                >
                    <IconClose size={20} strokeWidth={2.5} />
                </button>
            </div>

            {/* Barra inferior con animación */}
            <div
                className="h-[2px] bg-white/90 animate-progress-bar"
                style={{ "--progress-duration": `${duration}ms` }}
            />
        </div>
    );
}
