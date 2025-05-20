import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputField from "@/Components/InputField";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState, useId } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import ComboBox from "@/Components/ComboBox";
import Toast from "@/Components/Toast";

export default function NewUser({ roles, report }) {
    const title = "Nuevo Usuario";

    const { data, setData, post, reset, processing, transform, errors } =
        useForm({
            name: "",
            dni: "",
            rol: "",
            password: "",
            password_confirmation: "",
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
            rol: data.rol ? data.rol.id : null,
        }));

        post(route("users.new"), {
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
            <form
                className="flex flex-col gap-6 pb-16 justify-self-center rounded-2xl max-sm:w-full max-sm:max-w-[448px] sm:w-[75%] sm:max-w-[612px] "
                onSubmit={submit}
            >
                <InputField
                    id="dni"
                    label="DNI"
                    type="number"
                    maxLength={8}
                    inputMode="numeric"
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

                <ComboBox
                    id="rol"
                    label="Rol"
                    items={roles}
                    value={data.rol}
                    required
                    onChange={(value) => setData("rol", value)}
                    disabled={processing}
                    error={errors.rol}
                />

                <InputField
                    id="password"
                    type="password"
                    label="Contraseña"
                    value={data.password}
                    required
                    autoComplete="new-password"
                    onChange={(e) => setData("password", e.target.value)}
                    disabled={processing}
                    error={errors.password}
                />

                <InputField
                    id="password_confirmation"
                    type="password"
                    label="Confirmar contraseña"
                    value={data.password_confirmation}
                    autoComplete="new-password"
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                    required
                    disabled={processing}
                    error={errors.password}
                />

                <PrimaryButton disabled={processing} className="mt-2">
                    Iniciar sesión
                </PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
