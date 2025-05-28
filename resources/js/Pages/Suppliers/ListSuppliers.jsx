import Table from "@/Components/Table";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function ListSuppliers({ records = [], properties }) {
    const title = "Lista de Proveedores";

    const [listFiltered, setListFiltered] = useState(records);

    useEffect(() => {
        setListFiltered(records);
    }, []);

    // Funcion que haria uso de un modal para editar la informacion del proveedor
    const editInfo = (id) => {
        alert(listFiltered.find((record) => record.id === id).name);
    };

    return (
        <AuthenticatedLayout title={title} className="pb-36">
            <Head title={title} />
            <div className="space-y-6">
                <Table
                    module="suppliers"
                    properties={properties}
                    records={listFiltered}
                    editInfo={editInfo}
                    editStatus={true}
                />
            </div>
        </AuthenticatedLayout>
    );
}
