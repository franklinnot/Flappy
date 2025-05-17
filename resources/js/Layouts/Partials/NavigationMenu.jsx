import React, { useState, useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import { ArrowDown, ArrowUp, IconClose, MenuBurger } from "@/Components/Icons";
import getRoutes from "@/Utils/routes";

export default function NavigationMenu({ user }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [routes, setRoutes] = useState([]);
    const menuRef = useRef(null);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const toggleSubmenu = (index) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    useEffect(() => {
        setRoutes(getRoutes(user.rol));
        const handleClickOutside = (event) => {
            const openMenuButton = document.getElementById("open_menu");

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                openMenuButton !== event.target // Ignora el botón de abrir menú
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {/* Boton de menu de hamburguesa o de cerrar */}
            <button
                id="open_menu"
                type="button"
                onClick={toggleMenu}
                className="m-0 mt-1 py-1 px-2 bg-[#d4e0fc] hover:bg-[#c9d7fa] rounded-md transition-all ease-in-out border-[1px] border-gray-200"
            >
                {menuOpen ? (
                    <IconClose
                        strokeWidth={1.5}
                        size={20}
                        className="text-gray-600"
                    />
                ) : (
                    <MenuBurger
                        strokeWidth={1.5}
                        size={20}
                        className="text-gray-600"
                    />
                )}
            </button>

            {/* Logica y diseño de las rutas de navegacion */}
            <div
                ref={menuRef}
                className={`absolute top-[4.2rem] left-0 w-56 bg-[#EFF4FF] 
                                transition-transform duration-150 z-50 shadow-md rounded-xl 
                                ${
                                    menuOpen
                                        ? "translate-x-[0.8rem]"
                                        : "-translate-x-full"
                                }`}
            >
                <nav className="flex flex-col bg-[#EFF4FF] rounded-2xl overflow-hidden">
                    {routes.map((item, index) => (
                        <div key={index} className="border-b last:border-b-0">
                            <div
                                className="flex items-center justify-between hover:bg-[#e3ebff] focus:bg-gray-50 cursor-pointer"
                                onClick={() => toggleSubmenu(index)}
                            >
                                {item.subRoutes.length > 0 ? (
                                    <button
                                        type="button"
                                        className="px-4 py-2 flex-1 text-gray-600 text-sm font-normal text-left focus:outline-none w-max"
                                    >
                                        {item.title}
                                    </button>
                                ) : (
                                    <Link
                                        href={route(item.route)}
                                        className="px-4 py-2 flex-1 text-gray-600 text-sm font-normal w-max"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {item.title}
                                    </Link>
                                )}

                                {item.subRoutes.length > 0 && (
                                    <button
                                        type="button"
                                        className="pr-4 focus:outline-none"
                                    >
                                        {openSubmenu === index ? (
                                            <ArrowUp
                                                size={18}
                                                className="text-gray-500"
                                            />
                                        ) : (
                                            <ArrowDown
                                                size={18}
                                                className="text-gray-500"
                                            />
                                        )}
                                    </button>
                                )}
                            </div>

                            <div
                                className={`pl-6 bg-[#EFF4FF] overflow-hidden transition-all duration-300 
                                                ${
                                                    openSubmenu === index
                                                        ? "max-h-40 opacity-100"
                                                        : "max-h-0 opacity-0"
                                                }`}
                            >
                                {item.subRoutes.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={route(item.route)}
                                        className="hover:bg-[#e3ebff] h-8 flex items-center text-sm text-gray-500 rounded-l-lg pl-2 last:mb-2"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </>
    );
}
