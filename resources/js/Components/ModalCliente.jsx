import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import ComboBox from "@/Components/ComboBox";

export default function ModalCliente({
    isOpen,
    onClose,
    onConfirm,
    customers,
    obligatorio,
    selectedCustomer,
    setSelectedCustomer,
}) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => {}}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-visible">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative w-full max-w-md transform overflow-visible bg-white p-6 text-left align-middle shadow-xl transition-all rounded-2xl">
                                
                                {/* Botón cerrar sin icono */}
                                    <button
                                        onClick={onClose}
                                        className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-3xl font-bold leading-none"
                                        title="Cerrar"
                                    >
                                        ×
                                    </button>

                                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                                    {obligatorio
                                        ? "Debe seleccionar un cliente"
                                        : "¿Desea agregar un cliente a esta venta?"}
                                </Dialog.Title>

                                <div className="mt-4">
                                    <ComboBox
                                        id="modal-customer"
                                        label="Cliente"
                                        items={customers}
                                        value={selectedCustomer}
                                        onChange={setSelectedCustomer}
                                        itemToString={(item) => item?.name || ""}
                                    />
                                </div>

                                <div className="mt-6 flex justify-end gap-4">
                                    {!obligatorio && (
                                        <button
                                            onClick={() => onConfirm(null)}
                                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            Omitir
                                        </button>
                                    )}

                                    <button
                                        onClick={() => onConfirm(selectedCustomer)}
                                        disabled={obligatorio && !selectedCustomer}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Continuar
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
