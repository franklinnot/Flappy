import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";

export default function InputField({
    className = "",
    id,
    label,
    type = "text",
    value,
    onChange,
    error,
    autoComplete = "off",
    isFocused = false,
    required = false,
    placeholder = "",
    disabled = false,
    ...props // Spread additional props
}) {
    return (
        <div className={className}>
            <InputLabel htmlFor={id} value={label} />

            <TextInput
                id={id}
                type={type}
                name={id}
                value={value}
                className="mt-1 block w-full"
                autoComplete={autoComplete}
                isFocused={isFocused}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                error={error}
                disabled={disabled}
                {...props} // Spread additional props to TextInput
            />

            <InputError message={error} className="mt-2" />
        </div>
    );
}