import { useState, useEffect } from "react";
import { IconClose } from "@/Components/Icons";
import { useForm } from "@inertiajs/react";
import InputField from "@/Components/InputField";
import Loading from "@/Components/loading";
import PrimaryButton from "@/Components/PrimaryButton";

export default function EditSupplier({ onClose, object }) {
    //#region Manejar la visibilidad del modal
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
    //#endregion

    const { data, setData, patch, reset, processing, errors } = useForm({
        id: object.id,
        name: object.name,
        phone: object.phone,
        address: object.address ?? "",
        email: object.email ?? "",
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route("suppliers.edit"), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <>
            {/* Contenido */}
            <div
                className="fixed flex flex-col z-30 bg-white 
                           max-w-[550px] rounded-2xl 
                           shadow-lg items-center gap-6 mb-24"
            >
                {/* titulo y boton de cierre */}
                <div
                    className="flex flex-row w-full items-center relative
                             bg-indigo-50 rounded-2xl rounded-b-none py-3"
                >
                    {/* titulo */}
                    <h3
                        className="flex-1 text-xl font-semibold text-gray-600 
                                   text-center"
                    >
                        {object.name ?? object.code}
                    </h3>

                    {/* cerrar modal */}
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

                {/* formulario para editar */}
                <form
                    onSubmit={submit}
                    className="flex flex-col gap-6 text-slate-700 w-[548px] p-5 py-0 pb-5"
                >
                    <InputField
                        id="ruc"
                        label="RUC"
                        placeholder={object.ruc}
                        disabled={true}
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
                        type="number"
                        maxLength={9}
                        inputMode="numeric"
                        pattern="[0-9]{9}"
                        value={data.phone}
                        placeholder={object.phone}
                        required
                        onChange={(e) => setData("phone", e.target.value)}
                        disabled={processing}
                        error={errors.phone}
                    />

                    <InputField
                        id="email"
                        label="Correo (opc.)"
                        value={data.email}
                        type="email"
                        autoComplete="email"
                        placeholder={object.email ?? "ejemplo@email.com"}
                        onChange={(e) => setData("email", e.target.value)}
                        disabled={processing}
                        error={errors.email}
                    />

                    <InputField
                        id="address"
                        label="Dirección (opc.)"
                        value={data.address}
                        placeholder={object.address}
                        onChange={(e) => setData("address", e.target.value)}
                        disabled={processing}
                        error={errors.address}
                    />

                    <PrimaryButton disabled={processing} className="mt-2">
                        Editar
                    </PrimaryButton>
                </form>
            </div>

            {/* componente de carga */}
            {processing && <Loading isLoading={processing} />}
            {/* fondo difuminado */}
            {!processing && (
                <div
                    className="w-dvw h-dvh absolute inset-0 z-20
                             bg-slate-700 bg-opacity-60 backdrop-blur-xs"
                />
            )}
        </>
    );
}
