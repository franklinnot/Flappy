import React from "react";
import { IconRotated } from "./Icons";

export default function Card({
    title,
    value,
    icon: Icon,
    iconSize = 30,
    iconColor = 'text-gray-700',
    isToggleCard = false,
}) {
    return (
        <div
            className="relative flex justify-between items-center p-4 rounded-xl bg-white border border-gray-200 shadow-sm
                       transition-transform duration-200 hover:scale-105 hover:shadow-md select-none"
        >
            {/* Icono que aparece en la esquina superior derecha */}
            {isToggleCard && (
                <IconRotated
                    size={16}
                    className="absolute top-2 right-2 text-gray-400 animate-spin-slow"
                    title="Haz clic para alternar"
                />
            )}

            <div className="p-3 rounded-md">
                <Icon size={iconSize} className={iconColor} />
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-700">{value}</span>
                <span className="text-sm font-medium text-gray-500">{title}</span>
            </div>
        </div>
    );
}