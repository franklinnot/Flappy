import SelectInput from "./SelectInput";
import InputLabel from "./InputLabel";
import InputError from "./InputError";

export default function ComboBox({
    id,
    label,
    placeholder = "Selecciona una opción...",
    className = "",
    items, // Se asume que cada item es { id: string|number, name: string }
    value, // Se asume que el valor es un objeto { id: ..., name: ... } o null
    onChange,
    disabled = false,
    error,
    isFocused = false,
    required = false, // Added required prop
}) {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} className="mb-1"/>
            <SelectInput
                id={id}
                placeholder={placeholder}
                className={className}
                items={items}
                value={value}
                onChange={onChange}
                disabled={disabled}
                error={error}
                isFocused={isFocused}
                required={required} // Pass required prop
            />
            <InputError message={error} className="mt-2" />
        </div>
    );
}
