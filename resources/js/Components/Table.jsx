import { Link } from "@inertiajs/react";
import React, { useState, useEffect, useRef } from "react";
import { IconKebab } from "@/Components/Icons";
import Status from "@/Utils/status";

export default function Table({
    properties,
    records = [],
    className = "",
    module,
    editInfo = null,
    editStatus = false,
    isImportant = false,
}) {
    const [openMenu, setOpenMenu] = useState(null);
    const menuRef = useRef(null);

    const toggleMenu = (recordId) => {
        setOpenMenu(openMenu === recordId ? null : recordId);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className={`w-full overflow-hidden rounded-md border border-gray-200 shadow-sm ${className}`}
        >
            <table className="w-full table-auto text-sm text-left text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        {properties.map((prop) => (
                            <th
                                key={prop.name}
                                className="px-4 py-2 font-semibold text-gray-600"
                            >
                                {prop.tag}
                            </th>
                        ))}
                        {(typeof editInfo === "function" || editStatus) && (
                            <th className="relative px-4 py-2" />
                        )}
                    </tr>
                </thead>
                <tbody>
                    {records.length > 0 ? (
                        records.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50">
                                {properties.map((prop) => (
                                    <td
                                        key={prop.name}
                                        className="px-4 py-2 whitespace-nowrap"
                                    >
                                        {record[prop.name] || "-"}
                                    </td>
                                ))}
                                {(typeof editInfo === "function" ||
                                    editStatus) && (
                                    <td className="px-4 py-2 whitespace-nowrap text-center">
                                        <button
                                            onMouseDown={(e) =>
                                                e.stopPropagation()
                                            }
                                            onClick={() =>
                                                toggleMenu(record.id)
                                            }
                                            className="p-1 rounded-md hover:bg-gray-100"
                                        >
                                            <IconKebab className="size-5 text-gray-500" />
                                        </button>
                                        {openMenu === record.id && (
                                            <div
                                                ref={menuRef}
                                                className="absolute bg-white rounded-md shadow-sm z-20 border border-gray-200"
                                            >
                                                {typeof editInfo ==
                                                    "function" &&
                                                    !isImportant && (
                                                        <button
                                                            onClick={() => {
                                                                editInfo(
                                                                    record.id
                                                                );
                                                                setOpenMenu(
                                                                    null
                                                                );
                                                            }}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                                        >
                                                            Editar
                                                        </button>
                                                    )}
                                                {editStatus && (
                                                    <>
                                                        {isImportant &&
                                                            record.status ==
                                                                Status.ENABLED && (
                                                                <Link
                                                                    href={`${module}/disable/${record.id}`}
                                                                    method="patch"
                                                                    as="button"
                                                                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                                                    onClick={() =>
                                                                        setOpenMenu(
                                                                            null
                                                                        )
                                                                    }
                                                                >
                                                                    Anular
                                                                </Link>
                                                            )}
                                                        {!isImportant &&
                                                            record.status ==
                                                                Status.ENABLED && (
                                                                <Link
                                                                    href={`${module}/disable/${record.id}`}
                                                                    method="patch"
                                                                    as="button"
                                                                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                                                    onClick={() =>
                                                                        setOpenMenu(
                                                                            null
                                                                        )
                                                                    }
                                                                >
                                                                    Deshabilitar
                                                                </Link>
                                                            )}
                                                        {record.status ===
                                                            Status.DISABLED && (
                                                            <Link
                                                                href={`${module}/enable/${record.id}`}
                                                                method="patch"
                                                                as="button"
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                                                onClick={() =>
                                                                    setOpenMenu(
                                                                        null
                                                                    )
                                                                }
                                                            >
                                                                Habilitar
                                                            </Link>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={
                                    properties.length +
                                    (typeof editInfo === "function" ||
                                    editStatus
                                        ? 1
                                        : 0)
                                }
                                className="px-4 py-4 text-center text-gray-400"
                            >
                                No hay registros disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
