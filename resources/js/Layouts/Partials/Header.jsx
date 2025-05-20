import React from "react";
import { Link } from "@inertiajs/react";
import ProfileMenu from "@/Layouts/Partials/ProfileMenu";
import ApplicationLogo from "@/Components/ApplicationLogo";
import NavigationMenu from "@/Layouts/Partials/NavigationMenu";

export default function Header({ user, title = null }) {
    return (
        <header className="sticky top-0 z-50 grid grid-flow-col place-items-center px-5 lg:px-6 h-[3.3rem] sm:max-h-16 bg-[#EFF4FF] border-b border-gray-300">
            <div className="grid grid-flow-col place-items-center justify-self-start gap-3">
                <NavigationMenu user={user} />
                {/* Application logo */}
                <Link
                    className="hidden sm:inline-flex ml-1"
                    href={route("dashboard")}
                >
                    <ApplicationLogo className="size-[38px]" />
                </Link>
            </div>

            {/* Page title */}
            {title && (
                <h1 className="text-base font-medium text-gray-500 mt-1 flex relative items-center justify-center">
                    <span className="absolute text-nowrap">{title}</span>
                </h1>
            )}

            {/* profile button */}
            <div className="grid grid-flow-col place-items-center justify-self-end gap-2 mt-1">
                <ProfileMenu user={user} />
            </div>
        </header>
    );
}
