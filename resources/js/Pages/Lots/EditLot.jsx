import { useState, useEffect } from "react";
import { IconClose } from "@/Components/Icons";
import { useForm } from "@inertiajs/react";
import InputField from "@/Components/InputField";
import Loading from "@/Components/loading";
import PrimaryButton from "@/Components/PrimaryButton";
import Checkbox from "@/Components/Checkbox";

export default function EditLot({ onClose, object }) {
    const [visible, setVisible] = useState(true);
    useEffect(() => setVisible(true), []);

    const handleClose = () => {
        setVisible(false);
        onClose();
    };

    if (!visible) return null;

    const [alertWasActive] = useState(!!object.exp_alert); // solo una vez, no cambia
    const [justActivated, setJustActivated] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        id: object.id,
        code: object.code,
        exp_date: object.exp_date ?? "",
        exp_alert: !!object.exp_alert,
        price: object.price,
        stock: object.stock,
        exp_status: object.exp_status,
    });

    // Detectar si se acaba de activar por primera vez durante esta edición
    useEffect(() => {
        if (!alertWasActive && data.exp_alert && !justActivated) {
            setJustActivated(true);
        }
    }, [data.exp_alert, alertWasActive, justActivated]);

    const submit = (e) => {
        e.preventDefault();

        patch(route("lots.edit"), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const isExpDateEditable = justActivated;

    return (
        <>
            <div className="fixed flex flex-col z-30 bg-white max-w-[550px] rounded-2xl shadow-lg items-center gap-6 mb-24">
                {/* Header modal */}
                <div className="flex flex-row w-full items-center relative bg-indigo-50 rounded-2xl rounded-b-none py-3">
                    <h3 className="flex-1 text-xl font-semibold text-gray-600 text-center">
                        {object.code ?? object.name}
                    </h3>
                    <button
                        className="absolute right-0 mr-3 p-1 rounded-full hover:bg-slate-700 
                                   focus:outline-none text-slate-700 hover:text-gray-100 focus:text-gray-100
                                   transition-colors duration-75"
                        title="Cerrar"
                        type="button"
                        onClick={handleClose}
                    >
                        <IconClose size={20} />
                    </button>
                </div>

                {/* Formulario */}
                {/* Formulario */}
                <form
                    onSubmit={submit}
                    className="flex flex-col gap-6 text-slate-700 w-[548px] p-5 py-0 pb-5"
                >
                    {/* Código y Producto en fila */}
                    <div className="flex gap-4">
                        <InputField
                            id="code"
                            label="Código"
                            value={data.code}
                            disabled
                            className="w-1/2"
                        />
                        <InputField
                            id="product"
                            label="Producto"
                            value={object.product}
                            disabled
                            className="w-1/2"
                        />
                    </div>

                    {/* Stock y Precio en fila */}
                    <div className="flex gap-4">
                        <InputField
                            id="stock"
                            label="Stock"
                            type="number"
                            value={data.stock}
                            disabled
                            className="w-1/2"
                        />
                        <InputField
                            id="price"
                            label="Precio"
                            type="float"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            disabled={processing}
                            error={errors.price}
                            required
                            className="w-1/2"
                        />
                    </div>

                    {/* Checkbox de alerta */}
                    <div>
                        <label className="flex items-center">
                            <Checkbox
                                name="exp_alert"
                                checked={data.exp_alert}
                                onChange={(e) => setData("exp_alert", e.target.checked)}
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                Recibir alertas por vencimiento
                            </span>
                        </label>
                    </div>

                    {/* Fecha de vencimiento */}
                    <InputField
                        id="exp_date"
                        label="Fecha de vencimiento"
                        type="date"
                        min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                        value={data.exp_date}
                        required={data.exp_alert}
                        onChange={(e) => setData("exp_date", e.target.value)}
                        error={errors.exp_date}
                        disabled={!isExpDateEditable || processing}
                    />

                    <InputField
                        id="exp_status"
                        label="Estado de Vencimiento"
                        value={data.exp_status}
                        disabled
                    />

                    <PrimaryButton disabled={processing} className="mt-2">
                        Editar
                    </PrimaryButton>
                </form>

            </div>

            {processing && <Loading isLoading={processing} />}
            {!processing && (
                <div className="w-dvw h-dvh absolute inset-0 z-20 bg-slate-700 bg-opacity-60 backdrop-blur-xs" />
            )}
        </>
    );
}