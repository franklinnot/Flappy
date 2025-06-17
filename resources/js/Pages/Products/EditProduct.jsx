import { useState, useEffect } from "react";
import { IconClose } from "@/Components/Icons";
import { useForm } from "@inertiajs/react";
import InputField from "@/Components/InputField";
import Loading from "@/Components/loading";
import PrimaryButton from "@/Components/PrimaryButton";
import ComboBox from "@/Components/ComboBox";


export default function EditProduct({ onClose, object, unidades, categorias  }) {
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
        code: object.code ?? "",
        name: object.name ?? "",
        picture: object.picture ?? "",
        unit_id: object.unit_id ?? "",
        categorie_id: object.categorie_id ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route("products.edit"), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div className="fixed flex flex-col z-30 bg-white max-w-[550px] rounded-2xl shadow-lg items-center gap-6 mb-24">
            <div className="flex flex-row w-full items-center relative bg-indigo-50 rounded-2xl rounded-b-none py-3">
                <h3 className="flex-1 text-xl font-semibold text-gray-600 text-center">
                    Editar Producto
                </h3>
                <button
                    className="absolute right-0 mr-3 p-1 rounded-full"
                    onClick={handleClose}
                >
                    <IconClose />
                </button>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-6 px-6 pb-8 w-full">
                <InputField
                    id="code"
                    label="Código"
                    value={data.code}
                    onChange={(e) => setData("code", e.target.value)}
                    error={errors.code}
                    required
                />

                <InputField
                    id="name"
                    label="Nombre"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    error={errors.name}
                    required
                />

                <InputField
                    id="picture"
                    label="URL de Imagen"
                    value={data.picture}
                    onChange={(e) => setData("picture", e.target.value)}
                    error={errors.picture}
                />

                <ComboBox
                    id="unit_id"
                    label="Unidad de Medida"
                    items={unidades}
                    value={unidades.find((u) => u.id === data.unit_id) || null}
                    onChange={(val) => setData("unit_id", val?.id || "")}
                    error={errors.unit_id}
                />

                <ComboBox
                    id="categorie_id"
                    label="Categoría"
                    items={categorias}
                    value={categorias.find((c) => c.id === data.categorie_id) || null}
                    onChange={(val) => setData("categorie_id", val?.id || "")}
                    error={errors.categorie_id}
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
