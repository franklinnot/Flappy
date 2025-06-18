import { useState, useEffect } from "react";
import { IconClose } from "@/Components/Icons";
import { useForm } from "@inertiajs/react";
import InputField from "@/Components/InputField";
import Loading from "@/Components/loading";
import PrimaryButton from "@/Components/PrimaryButton";

export default function EditCustomer({ onClose, object }) {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        setVisible(true);
    }, []);

    const handleClose = () => {
        setVisible(false);
        onClose();
    };

    if (!visible) {
        return null;
    }

    const { data, setData, patch, reset, processing, errors } = useForm({
        id: object.id,
        name: object.name,
        dni: object.dni,
        phone: object.phone,
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route("customers.edit"), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <>
            <div
                className="fixed flex flex-col z-30 bg-white 
                           max-w-[550px] rounded-2xl 
                           shadow-lg items-center gap-6 mb-24"
            >
                <div
                    className="flex flex-row w-full items-center relative
                             bg-indigo-50 rounded-2xl rounded-b-none py-3"
                >
                    <h3
                        className="flex-1 text-xl font-semibold text-gray-600 
                                   text-center"
                    >
                        {object.name}
                    </h3>
                    <button
                        className="absolute right-0 mr-3 p-1 rounded-full hover:bg-slate-700 
                                   focus:outline-none text-slate-700  hover:text-gray-100 focus:text-gray-100
                                   transition-colors duration-75"
                        title="Cerrar"
                        type="button"
                        onClick={handleClose}
                    >
                        <IconClose size={20} />
                    </button>
                </div>
                <form
                    onSubmit={submit}
                    className="flex flex-col gap-6 text-slate-700 w-[548px] p-5 py-0 pb-5"
                >
                    <InputField
                        id="dni"
                        label="DNI"
                        value={data.dni}
                        placeholder={object.dni}
                        required
                        onChange={(e) => setData("dni", e.target.value)}
                        disabled={processing}
                        error={errors.dni}
                    />

                    <InputField
                        id="name"
                        isFocused={true}
                        label="Nombre"
                        value={data.name}
                        placeholder={object.name}
                        required
                        onChange={(e) => setData("name", e.target.value)}
                        disabled={processing}
                        error={errors.name}
                    />

                    <InputField
                        id="phone"
                        label="Teléfono"
                        value={data.phone}
                        placeholder={object.phone}
                        required
                        onChange={(e) => setData("phone", e.target.value)}
                        disabled={processing}
                        error={errors.phone}
                    />

                    <PrimaryButton disabled={processing} className="mt-2">
                        Editar
                    </PrimaryButton>
                </form>
            </div>
            {processing && <Loading isLoading={processing} />}
            {!processing && (
                <div
                    className="w-dvw h-dvh absolute inset-0 z-20
                             bg-slate-700 bg-opacity-60 backdrop-blur-xs"
                />
            )}
        </>
    );
}