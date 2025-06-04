import Table from "@/Components/Table";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Toast from "@/Components/Toast";
import PrimaryButton from "@/Components/PrimaryButton";
import Status from "@/Utils/status";

export default function ListSuppliers({
    records = [],
    properties,
    module,
    report,
    status = null,
}) {
    const title = "Lista de Proveedores";
    const [toast, setToast] = useState(null);
    const [toastKey, setToastKey] = useState(0);
    const [currentStatus, setcurrentStatus] = useState(
        status ? status : Status.ENABLED
    );
    const [filteredRecords, setFilteredRecords] = useState([]);

    useEffect(() => {
        if (report) {
            setToast(report);
            setToastKey(Date.now());
        }
    }, [report]);

    useEffect(() => {
        setFilteredRecords(
            records.filter((record) => record.status === currentStatus)
        );
    }, [records, currentStatus]);

    // Función para editar la información (ejemplo)
    const editInfo = (id) => {
        const record = filteredRecords.find((record) => record.id === id);
        if (record) {
            alert(record.name);
        }
    };

    // Función para cambiar el filtro de estado
    const handleToggleStatus = () => {
        setcurrentStatus((prevStatus) =>
            prevStatus === Status.ENABLED ? Status.DISABLED : Status.ENABLED
        );
    };

    return (
        <AuthenticatedLayout title={title} className="pb-36">
            <Head title={title} />
            {toast && (
                <Toast
                    key={toastKey}
                    message={toast.message}
                    type={toast.type}
                />
            )}
            <PrimaryButton onClick={handleToggleStatus}>
                {currentStatus == Status.ENABLED
                    ? "Mostrar Deshabilitados"
                    : "Mostrar Habilitados"}
            </PrimaryButton>
            <div className="space-y-6 mt-4">
                <Table
                    module={module}
                    properties={properties}
                    records={filteredRecords} // Usar los registros filtrados
                    editInfo={editInfo}
                    editStatus={true}
                />
            </div>
        </AuthenticatedLayout>
    );
}
