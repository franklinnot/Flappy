import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputField from "@/Components/InputField";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import ComboBox from "@/Components/ComboBox";
import Toast from "@/Components/Toast";

export default function NewProduct({ units, categories, report }) {
    const title = "Nuevo producto";

    const { data, setData, post, reset, processing, transform, errors } = useForm({
        code: "",
        name: "",
        picture: "",
        unit: "",
        categorie: "",
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

        transform((data) => ({
            ...data,
            unit: data.unit ? data.unit.id : null,
            categorie: data.categorie ? data.categorie.id : null,
        }));

        post(route("products.new"), {
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
                onSubmit={submit}
                className="flex flex-col gap-6 pb-16 justify-self-center rounded-2xl max-sm:w-full max-sm:max-w-[448px] sm:w-[75%] sm:max-w-[612px]"
            >
                <InputField
                    id="code"
                    label="Código"
                    maxLength={24}
                    value={data.code}
                    required
                    onChange={(e) => setData("code", e.target.value.toUpperCase())}
                    disabled={processing}
                    error={errors.code}
                    isFocused={true}
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
                    id="picture"
                    label="URL de imagen (opc.)"
                    type="url"
                    value={data.picture}
                    onChange={(e) => setData("picture", e.target.value)}
                    disabled={processing}
                    error={errors.picture}
                />

                <ComboBox
                    id="unit"
                    label="Unidad de medida"
                    items={units}
                    value={data.unit}
                    required
                    onChange={(value) => setData("unit", value)}
                    disabled={processing}
                    error={errors.unit}
                />

                <ComboBox
                    id="categorie"
                    label="Categoría"
                    items={categories}
                    value={data.categorie}
                    required
                    onChange={(value) => setData("categorie", value)}
                    disabled={processing}
                    error={errors.categorie}
                />

                <PrimaryButton disabled={processing} className="mt-2">
                    Registrar
                </PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
