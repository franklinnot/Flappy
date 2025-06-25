import React from "react";

export default function Card({
    title,
    value,
    icon: Icon,
    iconSize = 26,
    iconColor = 'text-gray-700',
}) {
    return (
        <div
            className="flex justify-between items-center p-4 rounded-xl bg-white border border-gray-200 shadow-sm
                       transition-transform duration-200 hover:scale-105 hover:shadow-md select-none cursor-default"
        >
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
