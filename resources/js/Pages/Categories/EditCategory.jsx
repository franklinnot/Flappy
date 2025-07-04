import { useState, useEffect } from "react";
import { IconClose } from "@/Components/Icons";
import { useForm } from "@inertiajs/react";
import InputField from "@/Components/InputField";
import Loading from "@/Components/loading";
import PrimaryButton from "@/Components/PrimaryButton";

export default function EditCategory({ onClose, object }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
    }, []);

    const handleClose = () => {
        setVisible(false);
        onClose();
    };

    if (!visible) return null;

    const { data, setData, patch, processing, errors } = useForm({
        id: object.id,
        name: object.name ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route("categories.edit"), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div
            className="fixed flex flex-col z-30 bg-white
                       max-w-[550px] rounded-2xl
                       shadow-lg items-center gap-6 mb-24"
        >
            <div
                className="flex flex-row w-full items-center relative
                           bg-indigo-50 rounded-2xl rounded-b-none py-3"
            >
                <h3 className="flex-1 text-xl font-semibold text-gray-600 text-center">
                    Editar Categoría
                </h3>
                <button
                    className="absolute right-0 mr-3 p-1 rounded-full"
                    onClick={handleClose}
                >
                    <IconClose />
                </button>
            </div>

            <form
                onSubmit={submit}
                className="flex flex-col gap-6 px-6 pb-8 w-full"
            >
                <InputField
                    id="name"
                    label="Nombre"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    error={errors.name}
                    required
                />

                <div className="flex justify-end gap-4">
                    <PrimaryButton disabled={processing} type="submit">
                        {processing ? <Loading /> : "Guardar"}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
