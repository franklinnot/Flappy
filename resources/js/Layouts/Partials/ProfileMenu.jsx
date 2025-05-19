import React, { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { IconProfile, ArrowDown, ArrowUp } from "@/Components/Icons";

const ProfileMenu = ({ user }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const menuProfile = document.getElementById("menu-profile");
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                menuProfile &&
                !menuProfile.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            className="relative grid grid-flow-col place-items-center justify-self-end gap-2"
            ref={menuRef}
        >
            {/* Nombre del usuario */}
            <span className="hidden sm:block text-gray-600 text-md">{user.name}</span>

            {/* Contenedor del ícono de perfil y la flechita */}
            <div
                id="menu-profile"
                className="relative cursor-pointer"
                onClick={() => setMenuOpen((prev) => !prev)}
            >
                <IconProfile size={34} className="text-gray-700" />
                {menuOpen ? (
                    <ArrowUp
                        size={14}
                        className="absolute text-white bottom-[7px] font-semibold right-[2.5px] transform translate-y-1/2 bg-gray-600 border border-gray-500 rounded-full"
                    />
                ) : (
                    <ArrowDown
                        size={14}
                        className="absolute text-white bottom-[7px] font-semibold right-[2.5px] transform translate-y-1/2 bg-gray-600 border border-gray-500 rounded-full"
                    />
                )}
            </div>

            {/* Menú desplegable */}
            <div
                className={`absolute top-[3.4rem] right-[-6px] w-[10rem] bg-[#EFF4FF]
                            transition-all duration-150 z-50 shadow-md rounded-xl transform ${
                                menuOpen
                                    ? "translate-x-0 opacity-100"
                                    : "translate-x-4 opacity-0"
                            }`}
                style={{ pointerEvents: menuOpen ? "auto" : "none" }}
            >
                <ul>
                    <li className="px-4 py-2 hover:bg-[#e3ebff] border-b text-gray-600 text-sm font-normal text-left rounded-t-xl ">
                        <Link href={route("profile")}>Perfil de usuario</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-[#e3ebff] text-sm font-normal text-left text-red-600 rounded-b-xl">
                        <Link href={route("logout")} method="post" as="button">
                            Cerrar sesión
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ProfileMenu;
