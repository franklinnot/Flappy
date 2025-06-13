import { useState, useEffect } from "react";

export default function SlideButton({
    id = "slide-button",
    labelTrue = "Registros habilitados",
    labelFalse = "Registros deshabilitados",
    onChange,
    value = false,
    disabled = false,
    className = "",
}) {
    const [checked, setChecked] = useState(value);

    // Sincroniza el estado interno cuando cambia la prop value
    useEffect(() => {
        setChecked(value);
    }, [value]);

    return (
        <div className={className}>
            <label className="inline-flex items-center cursor-pointer">
                <span className="mr-3 text-sm font-normal text-gray-500">
                    {checked ? labelTrue : labelFalse}
                </span>
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    className="sr-only peer"
                    disabled={disabled}
                    onChange={(e) => {
                        setChecked(e.target.checked);
                        onChange(e.target.checked);
                    }}
                />
                <div
                    className="relative w-11 h-6 peer-focus:outline-none rounded-full
                               peer-focus:ring-2 peer-focus:ring-blue-300 peer 
                               bg-gray-700 peer-checked:after:translate-x-full 
                               rtl:peer-checked:after:-translate-x-full 
                               peer-checked:after:border-white after:content-[''] 
                               after:absolute after:top-[2px] after:start-[2px] 
                               after:bg-white after:border-gray-300 after:border 
                               after:rounded-full after:h-5 after:w-5 after:transition-all
                               border-gray-600 peer-checked:bg-blue-600"
                ></div>
            </label>
        </div>
    );
}
