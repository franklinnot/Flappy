import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputField from "@/Components/InputField";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import Toast from "@/Components/Toast";
import Loading from "@/Components/loading";

export default function NewCustomer({ report }) {
    const title = "Nuevo cliente";

    const { data, setData, post, reset, processing, errors } =
        useForm({
            name: "",
            dni: "",
            phone: ""
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

        post(route("customers.new"), {
            onSuccess: () => {
                reset();
            },
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
                className="flex flex-col gap-6 pb-16 justify-self-center rounded-2xl max-sm:w-full max-sm:max-w-[448px] sm:w-[75%] sm:max-w-[612px] "
                onSubmit={submit}
            >
                <InputField
                    id="dni"
                    label="DNI"
                    type="number"
                    inputMode="numeric"
                    maxLength={8}
                    pattern="[0-9]{8}"
                    value={data.dni}
                    isFocused={true}
                    required
                    onChange={(e) => setData("dni", e.target.value)}
                    disabled={processing}
                    error={errors.dni}
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
                    label="Teléfono (opc.)"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    disabled={processing}
                    type="number"
                    inputMode="numeric"
                    maxLength={9}
                    pattern="[0-9]{9}"
                    error={errors.phone}
                />

                <PrimaryButton disabled={processing} className="mt-2">
                    Registrar
                </PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
