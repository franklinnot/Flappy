import { useState, useMemo, useRef, useEffect } from "react";
import { ArrowDown } from "./Icons";
import { Combobox, ComboboxInput, ComboboxOption } from "@headlessui/react";

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
    required = false, // Added required prop
}) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null); // Ref for the div containing ComboboxInput
    const comboboxInputRef = useRef(null); // Ref for the ComboboxInput itself
    const [inputWidth, setInputWidth] = useState("auto");
    const containerRef = useRef(null);

    // Cuando el usuario haga click fuera del contenedor, cierra el Combobox
    useEffect(() => {
        function handleClickOutside(event) {
            // Si el contenedor existe y el click NO fue dentro de él...
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    // Efecto para enfocar el input cuando isFocused es true
    useEffect(() => {
        if (isFocused && comboboxInputRef.current) {
            comboboxInputRef.current.focus();
        }
    }, [isFocused]);

    // Filtrado basado en item.name, eliminación de duplicados e ignorar sin valor
    const filteredItems = useMemo(() => {
        const uniqueItems = []; // Cambiamos el nombre para mayor claridad
        const seenNames = new Set(); // <-- **Clave**: Usamos un Set para los nombres ya vistos

        for (const item of items) {
            // Ignorar elementos si no tienen un 'id' o 'name' válido,
            // o si el 'name' es una cadena vacía o solo espacios.
            if (
                !item ||
                item.id === undefined ||
                item.name === undefined ||
                item.name === null ||
                String(item.name).trim() === "" // Convertimos a String por seguridad
            ) {
                continue; // Saltar este elemento y pasar al siguiente
            }

            const itemNameNormalized = String(item.name).toLowerCase().trim();

            // Si el nombre (normalizado) ya fue visto, ignorar este duplicado
            if (seenNames.has(itemNameNormalized)) {
                continue;
            }

            // Si pasa las validaciones, añadirlo a la lista de items únicos
            // y añadir el nombre normalizado al Set de nombres vistos
            uniqueItems.push(item);
            seenNames.add(itemNameNormalized); // <-- **Clave**: Añadimos el nombre normalizado
        }

        const queryString = query.toLowerCase().trim();
        if (queryString === "") return uniqueItems; // Devuelve solo los únicos y válidos si no hay búsqueda

        // Ahora filtra sobre la lista de ítems únicos
        return uniqueItems.filter((item) =>
            String(item.name).toLowerCase().includes(queryString)
        );
    }, [items, query]); // Dependencias: items y query

    // Mostrar item.name en el input
    const displayValue = (item) => (item ? item.name : "");

    return (
        <div className={`w-full ${className}`} ref={containerRef}>
            <Combobox
                value={value}
                onChange={(selected) => {
                    setOpen(false);
                    onChange(selected);
                }}
                onClose={() => setQuery("")}
                disabled={disabled}
            >
                <>
                    {/* Input y boton de despliegue del Combobox */}
                    <div className="relative" ref={inputRef}>
                        <ComboboxInput
                            id={id}
                            ref={comboboxInputRef}
                            className={`w-full border-gray-300 focus:border-indigo-500
                                    focus:ring-indigo-500 rounded-md shadow-sm text-sm pr-10
                                    ${
                                        disabled
                                            ? " opacity-70 cursor-not-allowed bg-gray-100 "
                                            : ""
                                    }
                                    ${error ? " border-red-500" : ""}
                                    ${value ? " bg-blue-50 " : " "}`}
                            displayValue={displayValue} // Uses item.name for display
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={placeholder}
                            autoComplete="off"
                        />

                        {/* Input oculto se reciba como prop required = true */}
                        {required && (
                            <input
                                type="text"
                                value={value ? value.id : ""}
                                required
                                className="sr-only top-8 right-24"
                                aria-hidden="true"
                                tabIndex={-1}
                                onChange={() => {}}
                                onFocus={(e) => e.target.blur()}
                            />
                        )}

                        {/* Boton para la apertura y cierre del combobox */}
                        <button
                            type="button"
                            onClick={() => setOpen((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center
                                     rounded-r-md px-2 focus:outline-none"
                        >
                            <ArrowDown
                                className={`text-gray-400 transition-transform duration-150 transform ${
                                    open ? "rotate-180" : ""
                                }`}
                                aria-hidden="true"
                                strokeWidth="1.8"
                                size="20"
                            />
                        </button>
                    </div>

                    {/* Elementos */}
                    {open && (
                        <div
                            anchor="bottom"
                            className={`mt-1 max-h-[188px] absolute overflow-auto rounded-md bg-white
                                     py-1 text-sm shadow-lg ring-1 ring-black z-20
                                     ring-opacity-5 focus:outline-none empty:hidden
                                     transition duration-100 ease-in-out
                                     data-[leave]:data-[closed]:opacity-0:
                                     ${open ? "flex flex-col" : "hidden"}`}
                            style={{ width: inputWidth }}
                        >
                            {filteredItems.length === 0 && query !== "" ? (
                                <div
                                    className="relative cursor-default select-none
                                         py-2 px-4 text-sm text-gray-700"
                                >
                                    Sin resultados.
                                </div>
                            ) : (
                                filteredItems.map((item) => (
                                    <ComboboxOption
                                        // Es crucial usar item.id aquí, ya que cada opción debe tener un 'key' único.
                                        // Aunque filtremos por nombre, los ítems subyacentes pueden tener IDs diferentes.
                                        key={item.id}
                                        value={item}
                                        className={`relative cursor-default select-none py-2
                                                 px-4 text-gray-600 data-[focus]:bg-indigo-100
                                                 data-[selected]:font-semibold data-[selected]:bg-indigo-50`}
                                    >
                                        {/* Displays item.name in the option list */}
                                        <span className="block truncate">
                                            {item.name}
                                        </span>
                                    </ComboboxOption>
                                ))
                            )}
                        </div>
                    )}
                </>
            </Combobox>
        </div>
    );
}
