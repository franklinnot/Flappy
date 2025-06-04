import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputField from "@/Components/InputField";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import Toast from "@/Components/Toast";
import Loading from "@/Components/loading";

export default function NewUnit({ report }) {
    const title = "Nueva unidad de medida";

    const { data, setData, post, reset, processing, errors } = useForm({
        name: "",
        code: "",
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

        post(route("units.new"), {
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
            <Loading isLoading={processing} />;
            <form
                className="flex flex-col gap-6 pb-16 justify-self-center rounded-2xl max-sm:w-full max-sm:max-w-[448px] sm:w-[75%] sm:max-w-[612px]"
                onSubmit={submit}
            >
                <InputField
                    id="code"
                    label="Código"
                    value={data.code}
                    isFocused={true}
                    required
                    maxLength={8}
                    onChange={(e) =>
                        setData("code", e.target.value.toUpperCase())
                    }
                    disabled={processing}
                    error={errors.code}
                />

                <InputField
                    id="name"
                    label="Nombre"
                    value={data.name}
                    required
                    onChange={(e) => setData("name", e.target.value)}
                    disabled={processing}
                    maxLength={24}
                    error={errors.name}
                />

                <PrimaryButton disabled={processing} className="mt-2">
                    Registrar
                </PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
