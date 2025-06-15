import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputField from "@/Components/InputField";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import ComboBox from "@/Components/ComboBox";
import Toast from "@/Components/Toast";
import Loading from "@/Components/loading";

export default function NewOperation({ types, suppliers, lots, report }) {
    const title = "Nueva operación";

    const { data, setData, post, reset, processing, transform, errors } = useForm(
        {
            lot: "",
            type: "",
            supplier: "",
            quantity: "",
        }
    );

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

        transform((data) => ({
            ...data,
            lot: data.lot ? data.lot.id : null,
            type: data.type ? data.type.id : null,
            supplier: data.supplier ? data.supplier.id : null,
        }));

        post(route("operations.new"), {
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
                className="flex flex-col gap-6 pb-16 justify-self-center rounded-2xl max-sm:w-full max-sm:max-w-[448px] sm:w-[75%] sm:max-w-[612px]"
                onSubmit={submit}
            >
                <ComboBox
                    id="lot"
                    label="Lote"
                    items={lots}
                    value={data.lot}
                    required
                    onChange={(value) => setData("lot", value)}
                    disabled={processing}
                    error={errors.lot}
                />

                <ComboBox
                    id="type"
                    label="Tipo de operación"
                    items={types}
                    value={data.type}
                    required
                    onChange={(value) => setData("type", value)}
                    disabled={processing}
                    error={errors.type}
                />

                <ComboBox
                    id="supplier"
                    label="Proveedor (opc.)"
                    items={suppliers}
                    value={data.supplier}
                    onChange={(value) => setData("supplier", value)}
                    disabled={processing}
                    error={errors.supplier}
                />

                <InputField
                    id="quantity"
                    label="Cantidad"
                    type="number"
                    maxLength={6}
                    inputMode="numeric"
                    value={data.quantity}
                    required
                    onChange={(e) => setData("quantity", e.target.value)}
                    disabled={processing}
                    error={errors.quantity}
                />

                <PrimaryButton disabled={processing} className="mt-2">
                    Registrar
                </PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
