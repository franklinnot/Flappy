import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputField from "@/Components/InputField";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import Toast from "@/Components/Toast";

export default function NewCategory({ report }) {
    const title = "Nueva categoría";

    const { data, setData, post, reset, processing, errors } = useForm({
        name: "",
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

        post(route("categories.new"), {
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
            <form
                className="flex flex-col gap-6 pb-16 justify-self-center rounded-2xl max-sm:w-full max-sm:max-w-[448px] sm:w-[75%] sm:max-w-[612px]"
                onSubmit={submit}
            >
                <InputField
                    id="name"
                    label="Nombre"
                    value={data.name}
                    required
                    maxLength={64}
                    onChange={(e) => setData("name", e.target.value)}
                    disabled={processing}
                    error={errors.name}
                />

                <PrimaryButton disabled={processing} className="mt-2">
                    Registrar
                </PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
