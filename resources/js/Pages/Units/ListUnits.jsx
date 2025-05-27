import Table from "@/Components/Table";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function ListUnits({ records = [], properties }) {
    const title = "Unidades de Medida";

    const [listFiltered, setListFiltered] = useState(records);

    useEffect(() => {
        setListFiltered(records);
    }, []);

    const editInfo = (id) => {
        alert(listFiltered.find((record) => record.id === id).name);
    };

    return (
        <AuthenticatedLayout title={title} className="pb-36">
            <Head title={title} />
            <div className="space-y-6">
                <h1 className="text-xl font-bold">Lista de Unidades de Medida</h1>
                <Table
                    module="units"
                    properties={properties}
                    records={listFiltered}
                    editInfo={editInfo}
                    editStatus={true}
                />
            </div>
        </AuthenticatedLayout>
    );
}
