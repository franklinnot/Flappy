import React from "react";
import { Link } from "@inertiajs/react";
import ProfileMenu from "@/Layouts/Partials/ProfileMenu";
import ApplicationLogo from "@/Components/ApplicationLogo";
import NavigationMenu from "@/Layouts/Partials/NavigationMenu";

export default function Header({ user, title = null }) {
    return (
        <header className="sticky top-0 z-50 grid grid-flow-col place-items-center px-5 lg:px-6 h-14 sm:max-h-16 bg-[#EFF4FF] border-b-2">
            <div className="grid grid-flow-col place-items-center justify-self-start gap-3">
                <NavigationMenu user={user} />
                {/* Application logo */}
                <Link className="inline-flex ml-1" href={route("profile")}>
                    <ApplicationLogo className="size-[38px]" />
                </Link>
                {/* Page title */}
                <h1 className="text-lg font-medium text-gray-600 mt-1">{title}</h1>
            </div>

            {/* profile button */}
            <div className="grid grid-flow-col place-items-center justify-self-end gap-2 mt-1">
                <ProfileMenu user={user} />
            </div>
        </header>
    );
}
