import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import InputField from "@/Components/InputField";

export default function Edit({ user }) {
    return (
        <AuthenticatedLayout className="pb-[56px]">
            <Head title="Perfil" />

            <div className="min-w-[600px] p-10 pt-0">
                <header>
                    <h2 className="text-2xl py-10 pb-9 font-semibold text-slate-800">
                        Información del perfil
                    </h2>
                </header>

                <div className="space-y-8">
                    <InputField
                        id="dni"
                        label="DNI"
                        value={user.dni}
                        disabled={true}
                    />
                    <InputField
                        id="name"
                        label="Nombre"
                        value={user.name}
                        disabled={true}
                    />
                    <InputField
                        id="rol"
                        label="Rol"
                        value={user.rol}
                        disabled={true}
                    />
                    <InputField
                        id="created_at"
                        label="Fecha de registro"
                        value={user.created_at}
                        disabled={true}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
