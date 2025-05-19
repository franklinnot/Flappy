import { forwardRef, useEffect, useRef } from "react";

export default forwardRef(function TextInput(
    {
        type = "text",
        className = "",
        isFocused = false,
        disabled = false,
        value,
        error,
        onChange,
        maxLength = 255,
        required = false,
        ...props
    },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]); // Added isFocused to dependency array for potential re-focus

    /**
     * Handles the change event of the input element.
     * Validates the input based on the 'type' prop ('number' or 'float')
     * before calling the parent's onChange handler.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleChange = (e) => {
        const { value } = e.target;

        if (type === "number") {
            // Allow only digits or an empty string
            if (/^[0-9]*$/.test(value) || value === "") {
                onChange(e);
            }
        } else if (type === "float") {
            // Allow digits, at most one decimal point, or an empty string
            // This regex allows numbers like "123", "123.", "123.45"
            if (/^[0-9]*\.?([0-9]*)?$/.test(value) || value === "") {
                onChange(e);
            }
        } else {
            onChange(e);
        }
    };

    // Determine the actual input type attribute
    const inputType = (type === 'number' || type === 'float') ? 'text' : type;

    return (
        <input
            {...props}
            value={value}
            type={inputType} // Use the determined input type
            className={`focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm  
                ${className} 
                ${disabled ? " opacity-70 cursor-not-allowed bg-gray-100 " : " "}
                ${error ? " border-red-500 " : " border-gray-300 " }
                ${value ? " bg-blue-50 " : " "}`}
            ref={input}
            onChange={handleChange} // Use the new handleChange function
            disabled={disabled}
            required={required}
            maxLength={maxLength}
        />
    );
});
