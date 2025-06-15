import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputField from "@/Components/InputField";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import Toast from "@/Components/Toast";
import Loading from "@/Components/loading";

export default function NewProveedor({ report }) {
    const title = "Nuevo proveedor";

    const { data, setData, post, reset, processing, errors } = useForm({
        name: "",
        ruc: "",
        address: "",
        email: "",
        phone: "",
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

        post(route("suppliers.new"), {
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
                <InputField
                    id="ruc"
                    label="RUC"
                    type="number"
                    maxLength={11}
                    inputMode="numeric"
                    pattern="[0-9]{11}"
                    isFocused={true}
                    value={data.ruc}
                    required
                    onChange={(e) => setData("ruc", e.target.value)}
                    disabled={processing}
                    error={errors.ruc}
                />

                <InputField
                    id="name"
                    label="Nombre"
                    value={data.name}
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
                    placeholder="ejemplo@email.com"
                    onChange={(e) => setData("email", e.target.value)}
                    disabled={processing}
                    error={errors.email}
                />

                <InputField
                    id="address"
                    label="Dirección (opc.)"
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                    disabled={processing}
                    error={errors.address}
                />

                <PrimaryButton disabled={processing} className="mt-2">
                    Registrar
                </PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
