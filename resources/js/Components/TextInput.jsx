import { forwardRef, useEffect, useRef } from "react";

export default forwardRef(function TextInput(
    {
        type = "text",
        className = "",
        isFocused = false,
        disabled = false,
        error,
        ...props
    },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={`focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm  
                ${className} 
                ${disabled ? " opacity-70 cursor-not-allowed bg-gray-100" : ""}
                ${error? " border-red-500" : " border-gray-300" }`}
            ref={input}
            disabled={disabled}
        />
    );
});
