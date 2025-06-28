import { router } from "@inertiajs/react";
import React, { useState, useEffect, useRef } from "react";
import {
    IconKebab,
    IconTrash,
    IconPencil,
    IconDocumentCheck,
} from "@/Components/Icons";
import Status from "@/Utils/status";
import Loading from "./loading";

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
    const [isLoading, setIsLoading] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = (recordId) => {
        setOpenMenu(openMenu === recordId ? null : recordId);
    };

    const handleStatusChange = (href) => {
        setIsLoading(true);
        router.visit(href, {
            method: "patch",
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setIsLoading(false);
                setOpenMenu(null);
            },
        });
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
        <div>
            <Loading isLoading={isLoading} />

            <div
                className={`w-full overflow-hidden rounded-md border border-gray-200 shadow-sm ${className}`}
            >
                <table className="w-full table-auto text-sm text-left text-gray-700">
                    <thead className="bg-blue-50 border-b border-gray-200">
                        <tr>
                            {properties.map((prop) => (
                                <th
                                    key={prop.name}
                                    className="px-4 py-2 font-semibold text-sky-900"
                                >
                                    {prop.tag}
                                </th>
                            ))}
                            {(typeof editInfo === "function" || editStatus) && (
                                <th className="px-4 py-2 w-px text-right" />
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {records.length > 0 ? (
                            records.map((record) => (
                                <tr
                                    key={record.id}
                                    className="hover:bg-gray-50"
                                >
                                    {properties.map((prop) => (
                                        <td
                                            key={prop.name}
                                            className={`px-4 py-2 ${
                                                [
                                                    "name",
                                                    "address",
                                                    "email",
                                                ].includes(prop.name)
                                                    ? "max-w-[180px] break-words whitespace-pre-line"
                                                    : "truncate"
                                            } ${
                                                prop.name === "picture"
                                                    ? "text-center"
                                                    : ""
                                            }`}
                                        >
                                            {prop.name === "picture" &&
                                            record[prop.name] ? (
                                                <img
                                                    src={record[prop.name]}
                                                    alt={
                                                        record.name || "Imagen"
                                                    }
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            ) : (
                                                record[prop.name] || "-"
                                            )}
                                        </td>
                                    ))}
                                    {(typeof editInfo === "function" ||
                                        editStatus) && (
                                        <td className="max-w-[180px] break-words whitespace-pre-line px-2 py-1">
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
                                                    className="flex flex-row absolute ml-[42px] mt-[-34px] bg-white rounded-md shadow-md z-20 border border-gray-200"
                                                >
                                                    {typeof editInfo ===
                                                        "function" &&
                                                        !isImportant && (
                                                            <button
                                                                title="Editar"
                                                                onClick={() => {
                                                                    editInfo(
                                                                        record.id
                                                                    );
                                                                    setOpenMenu(
                                                                        null
                                                                    );
                                                                }}
                                                                className="block w-full text-left p-2 text-sm text-sky-600 hover:bg-gray-100"
                                                            >
                                                                <IconPencil
                                                                    size={16}
                                                                />
                                                            </button>
                                                        )}

                                                    {editStatus && (
                                                        <>
                                                            {isImportant &&
                                                                record.status ===
                                                                    Status.ENABLED && (
                                                                    <button
                                                                        title="Anular"
                                                                        onClick={() =>
                                                                            handleStatusChange(
                                                                                `${module}/disable/${record.id}`
                                                                            )
                                                                        }
                                                                        className="block w-full text-left p-2 text-sm text-red-500 hover:bg-gray-100"
                                                                    >
                                                                        <IconTrash
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    </button>
                                                                )}
                                                            {!isImportant &&
                                                                record.status ===
                                                                    Status.ENABLED && (
                                                                    <button
                                                                        title="Eliminar"
                                                                        onClick={() =>
                                                                            handleStatusChange(
                                                                                `${module}/disable/${record.id}`
                                                                            )
                                                                        }
                                                                        className="block w-full text-left p-2 text-sm text-red-500 hover:bg-gray-100"
                                                                    >
                                                                        <IconTrash
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    </button>
                                                                )}
                                                            {!isImportant &&
                                                                record.status ==
                                                                    Status.DISABLED && (
                                                                    <button
                                                                        title="Habilitar"
                                                                        onClick={() =>
                                                                            handleStatusChange(
                                                                                `${module}/enable/${record.id}`
                                                                            )
                                                                        }
                                                                        className="block w-full text-left p-2 text-sm text-emerald-500 hover:bg-gray-100"
                                                                    >
                                                                        <IconDocumentCheck
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    </button>
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
        </div>
    );
}
