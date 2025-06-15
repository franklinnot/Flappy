import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputField from "@/Components/InputField";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import ComboBox from "@/Components/ComboBox";
import Toast from "@/Components/Toast";
import Loading from "@/Components/loading";
import Checkbox from "@/Components/Checkbox";

export default function NewLot({ products, report }) {
    const title = "Nuevo Lote";

    const { data, setData, post, reset, processing, transform, errors } =
        useForm({
            code: "",
            product: null,
            exp_alert: false,
            exp_date: "",
            initial_stock: "",
            price: "",
        });

    const [toast, setToast] = useState(null);
    const [toastKey, setToastKey] = useState(0);

    useEffect(() => {
        if (report) {
            setToast(report);
            setToastKey(Date.now());
        } else if (errors?.report_type) {
            setToast({
                message: errors.report_message,
                type: errors.report_type,
            });
            setToastKey(Date.now());
        }
    }, [report, errors]);

    const submit = (e) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            product: data.product ? data.product.id : null,
        }));

        post(route("lots.new"), {
            onSuccess: () => {
                reset();
            },
            preserveScroll: true,
            preserveState: true,
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

                <ComboBox
                    id="product"
                    label="Producto"
                    items={products}
                    value={data.product}
                    required
                    onChange={(value) => setData("product", value)}
                    disabled={processing}
                    error={errors.product}
                />

                <InputField
                    id="initial_stock"
                    label="Stock inicial"
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
                    label="Precio por unidad"
                    type="float"
                    min="0.1"
                    value={data.price}
                    required
                    onChange={(e) => {
                        setData("price", e.target.value);
                    }}
                    disabled={processing}
                    error={errors.price}
                />

                <div>
                    <label className="flex items-center">
                        <Checkbox
                            name="exp_alert"
                            checked={data.exp_alert}
                            onChange={(e) =>
                                setData("exp_alert", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Recibir alertas por vencimiento
                        </span>
                    </label>
                </div>

                <InputField
                    id="exp_date"
                    label="Fecha de vencimiento"
                    type="date"
                    min={
                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split("T")[0]
                    }
                    value={data.exp_date}
                    required={data.exp_alert}
                    onChange={(e) => setData("exp_date", e.target.value)}
                    disabled={processing || !data.exp_alert}
                    error={errors.exp_date}
                />

                <PrimaryButton disabled={processing} className="mt-4">
                    Registrar
                </PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
