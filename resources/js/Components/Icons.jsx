import React from "react";

// Reusable icon base component
const Icon = React.forwardRef(
    (
        {
            children,
            size = 24,
            strokeWidth = 1.5,
            className = "text-gray-800",
            style,
            ...props
        },
        ref
    ) => {
        const dimension = typeof size === "number" ? `${size}px` : size;
        const computedStyle = { width: dimension, height: dimension, ...style };

        return (
            <svg
                ref={ref}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={strokeWidth}
                stroke="currentColor"
                className={className}
                style={computedStyle}
                aria-hidden="true"
                role="img"
                {...props}
            >
                {children}
            </svg>
        );
    }
);

Icon.displayName = "Icon";

export const ArrowDown = (props) => (
    <Icon {...props}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
    </Icon>
);

export const ArrowUp = (props) => (
    <Icon {...props}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
    </Icon>
);

export const IconClose = (props) => (
    <Icon {...props}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
        />
    </Icon>
);

export const MenuBurger = (props) => (
    <Icon {...props}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
    </Icon>
);

export const IconProfile = (props) => (
    <Icon {...props} fill="currentColor" stroke="none">
        <path
            fillRule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            clipRule="evenodd"
        />
    </Icon>
);

export const IconCheckCircle = (props) => (
    <Icon {...props} fill="currentColor" stroke="none">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
    </Icon>
);

export const IconCheck = (props) => (
    <Icon {...props} fill="currentColor" stroke="none">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
        />
    </Icon>
);

// triangle
export const IconWarning = (props) => (
    <Icon {...props} fill="currentColor" stroke="none">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
    </Icon>
);

export const IconError = (props) => (
    <Icon {...props} fill="currentColor" stroke="none">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
    </Icon>
);

export const IconInformation = (props) => (
    <Icon {...props} fill="currentColor" stroke="none">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        />
    </Icon>
);

export const IconExit = (props) => (
    <Icon {...props} fill="currentColor" stroke="none">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
        />
    </Icon>
);