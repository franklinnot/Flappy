import React from "react";
import { Link } from "@inertiajs/react";
import ProfileMenu from "@/Layouts/Partials/ProfileMenu";
import ApplicationLogo from "@/Components/ApplicationLogo";
import NavigationMenu from "@/Layouts/Partials/NavigationMenu";

export default function Header({ user }) {
    return (
        <header className="sticky top-0 z-50 grid grid-flow-col place-items-center px-5 lg:px-6 h-14 sm:max-h-16 bg-[#EFF4FF] border-b-2">
            <div className="grid grid-flow-col place-items-center justify-self-start gap-2">
                <NavigationMenu user={user} />
                {/* Logo de la aplicacion */}
                <Link className="inline-flex ml-1" href={route("profile")}>
                    <ApplicationLogo className="size-[40px]" />
                </Link>
            </div>

            {/* Boton de perfil */}
            <div className="grid grid-flow-col place-items-center justify-self-end gap-2 mt-1">
                <ProfileMenu user={user} />
            </div>
        </header>
    );
}
