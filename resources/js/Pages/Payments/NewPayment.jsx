import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputField from "@/Components/InputField";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import Toast from "@/Components/Toast";
import Loading from "@/Components/loading";

export default function NewPayment({ report }) {
    const title = "Nuevo método de pago";

    const { data, setData, post, reset, processing, errors } = useForm({
        name: "",
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

        post(route("payments.new"), {
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
                    id="name"
                    label="Nombre"
                    value={data.name}
                    required
                    onChange={(e) => setData("name", e.target.value)}
                    disabled={processing}
                    isFocused={true}
                    error={errors.name}
                />

                <PrimaryButton disabled={processing} className="mt-2">
                    Registrar
                </PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
