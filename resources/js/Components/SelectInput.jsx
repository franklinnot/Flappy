import { useState, useMemo, useRef, useEffect } from "react";
import { ArrowDown } from "./Icons";
import {
    Combobox,
    ComboboxButton, // Added
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from "@headlessui/react";

export default function SelectInput({
    id,
    placeholder = "Selecciona una opción...",
    className = "",
    items = [], // Se asume que cada item es { id: string|number, name: string }
    value, // Se asume que el valor es un objeto { id: ..., name: ... } o null
    onChange,
    disabled = false,
    error = null,
    isFocused = false, // Added isFocused prop
}) {
    const [query, setQuery] = useState("");
    const inputRef = useRef(null); // Ref for the div containing ComboboxInput
    const comboboxInputRef = useRef(null); // Ref for the ComboboxInput itself
    const [inputWidth, setInputWidth] = useState("auto");

    useEffect(() => {
        if (!inputRef.current) return;
        const updateWidth = () => {
            const width = inputRef.current.getBoundingClientRect().width;
            setInputWidth(`${width}px`);
        };
        updateWidth();
        const resizeObserver = new ResizeObserver(updateWidth);
        resizeObserver.observe(inputRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Effect to focus the ComboboxInput when isFocused is true
    useEffect(() => {
        if (isFocused && comboboxInputRef.current) {
            comboboxInputRef.current.focus();
        }
    }, [isFocused]);

    // Filtrado basado en item.name
    const filteredItems = useMemo(() => {
        const queryString = query.toLowerCase().trim();
        if (queryString === "") return items;
        return items.filter((item) =>
            item.name.toLowerCase().includes(queryString)
        );
    }, [items, query]);

    // Mostrar item.name en el input
    const displayValue = (item) => (item ? item.name : "");

    // Clases base para los estilos
    const baseOptionsContainerClasses =
        "mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none empty:hidden";
    const baseOptionClasses =
        "relative cursor-default select-none py-2 px-4 text-gray-600 data-[focus]:bg-indigo-100";

    return (
        <div className={`w-full ${className}`}>
            <Combobox
                value={value}
                onChange={onChange}
                onClose={() => setQuery("")}
                disabled={disabled}
            >
                {/* Render prop to access the 'open' state of the Combobox */}
                {({ open }) => (
                    <>
                        <div className="relative" ref={inputRef}>
                            <ComboboxInput
                                ref={comboboxInputRef} // Assign ref to ComboboxInput
                                id={id}
                                className={`w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm pr-10
                                    ${
                                        disabled
                                            ? " opacity-70 cursor-not-allowed bg-gray-100 "
                                            : ""
                                    }
                                    ${
                                        error
                                            ? " border-red-500"
                                            : ""
                                    }`}
                                displayValue={displayValue} // Uses item.name for display
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder={placeholder}
                                autoComplete="off"
                            />

                            {/* Button to toggle the visibility of dropdown options */}
                            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <ArrowDown
                                    className={`text-gray-400 transition-transform duration-150 transform ${
                                        open ? "rotate-180" : ""
                                    }`}
                                    aria-hidden="true"
                                    strokeWidth="1.8"
                                    size="20"
                                />
                            </ComboboxButton>
                        </div>

                        <ComboboxOptions
                            anchor="bottom"
                            transition
                            className={`${baseOptionsContainerClasses} transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0:`}
                            style={{ width: inputWidth }}
                        >
                            {filteredItems.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-sm text-gray-700">
                                    Sin resultados.
                                </div>
                            ) : (
                                filteredItems.map((item) => (
                                    <ComboboxOption
                                        key={item.id} // Use item.id directly
                                        value={item}
                                        className={`${baseOptionClasses} data-[selected]:font-semibold data-[selected]:bg-indigo-50`}
                                    >
                                        {/* Displays item.name in the option list */}
                                        <span className="block truncate">
                                            {item.name}
                                        </span>
                                    </ComboboxOption>
                                ))
                            )}
                        </ComboboxOptions>
                    </>
                )}
            </Combobox>
        </div>
    );
}
