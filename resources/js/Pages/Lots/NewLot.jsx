import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputField from "@/Components/InputField";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import ComboBox from "@/Components/ComboBox";
import Toast from "@/Components/Toast";
import Loading from "@/Components/loading";

export default function NewLot({ products, report }) {
    const title = "Nuevo Lote";

    const { data, setData, post, reset, processing, errors } = useForm({
        product: null,          
        code: "",
        initial_stock: "",
        price: "",
        exp_alert: false,
        exp_date: "",
    });

    const [toast, setToast] = useState(null);
    const [toastKey, setToastKey] = useState(0);

    useEffect(() => {
        if (report) {
            setToast(report);
            setToastKey(Date.now());
        }
    }, [report]);

    const submit = (e) => {
        e.preventDefault();

        const payload = {
            ...data,
            product_id: data.product ? data.product.id : null,
        };

        post(route("lots.new"), {
            data: payload,
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout title={title}>
            <Head title={title} />
            {toast && (
                <Toast
                    key={toastKey}
                    message={toast.message}
                    type={toast.type}
                />
            )}
            <Loading isLoading={processing} />
            <form
                onSubmit={submit}
                className="flex flex-col gap-6 pb-16 justify-self-center rounded-2xl max-sm:w-full max-sm:max-w-[448px] sm:w-[75%] sm:max-w-[612px]"
            >
                <ComboBox
                    id="product"
                    label="Producto"
                    items={products}
                    value={data.product}
                    required
                    onChange={(value) => setData("product", value)}
                    disabled={processing}
                    error={errors.product_id || errors.product}
                />

                <InputField
                    id="code"
                    label="Código"
                    maxLength={24}
                    value={data.code}
                    required
                    onChange={(e) =>
                        setData("code", e.target.value.toUpperCase())
                    }
                    disabled={processing}
                    error={errors.code}
                    isFocused={true}
                />

                <InputField
                    id="initial_stock"
                    label="Stock Inicial"
                    type="number"
                    min="1"
                    value={data.initial_stock}
                    required
                    onChange={(e) => setData("initial_stock", e.target.value)}
                    disabled={processing}
                    error={errors.initial_stock}
                />

                <InputField
                    id="price"
                    label="Precio"
                    type="text"   
                    value={data.price}
                    required
                    onChange={(e) => {
                        
                        let val = e.target.value;
                        val = val.replace(',', '.');

                        if (/^\d*\.?\d*$/.test(val)) {
                            setData("price", val);
                        }
                    }}
                    disabled={processing}
                    error={errors.price}
                />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="exp_alert"
                        checked={data.exp_alert}
                        onChange={(e) => setData("exp_alert", e.target.checked)}
                        disabled={processing}
                        className="form-checkbox"
                    />
                    <label htmlFor="exp_alert">Activar alerta de vencimiento</label>
                </div>

                {data.exp_alert && (
                    <InputField
                        id="exp_date"
                        label="Fecha de vencimiento"
                        type="date"
                        value={data.exp_date}
                        required={data.exp_alert}
                        onChange={(e) => setData("exp_date", e.target.value)}
                        disabled={processing}
                        error={errors.exp_date}
                    />
                )}

                <PrimaryButton disabled={processing} className="mt-2">
                    Registrar
                </PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
