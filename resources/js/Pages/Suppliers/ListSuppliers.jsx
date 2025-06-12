import Table from "@/Components/Table";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Toast from "@/Components/Toast";
import PrimaryButton from "@/Components/PrimaryButton";
import Status from "@/Utils/status";
import ModalEdit from "./ModalEdit";

export default function ListSuppliers({
    records = [], // registros
    properties, // propiedades y sus etiquetas: prop: name - tag: Nombre
    module, // modulo, ejemplo: "suppliers", "users", etc.
    report, // info enviada desde el back
}) {
    const title = "Lista de Proveedores";
    
    // filtros
    const [statusFilter, setStatusFilter] = useState(Status.ENABLED);

    //#region

    // notificaciones
    const [toast, setToast] = useState(null);
    const [toastKey, setToastKey] = useState(0);

    // modal para editar información
    const [showModal, setModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    // registros filtrados
    const [filteredRecords, setFilteredRecords] = useState([]);

    // funcion para abrir el modal de editar
    const editInfo = (id) => {
        const record = filteredRecords.find((record) => record.id === id);
        if (record) {
            // alert(JSON.stringify(record, null, 2));
            setModalData(record);
            setModal(true);
        }
    };

    // mostrar notificación al recibir un reporte
    useEffect(() => {
        if (report) {
            setToast(report);
            setToastKey(Date.now());
            // si el reporte trae un registro actualizado lo actualizamos en filteredRecords
            if (report.updatedRecord) {
                setFilteredRecords((prevRecords) =>
                    prevRecords
                        .map((rec) =>
                            rec.id === report.updatedRecord.id
                                ? report.updatedRecord
                                : rec
                        )
                        // .filter((rec) => rec.status === statusFilter)
                );
            }
        }
    }, [report]);

    //#endregion

    // inicializar filteredRecords con los records iniciales y mantener los filtros aplicados
    useEffect(() => {
        setFilteredRecords(
            records.filter((record) => record.status === statusFilter)
        );
    }, [records, statusFilter]); // adjuntar todos los filtros

    // Actualizar el estado de los filtros
    const updateFilters = () => {
        setStatusFilter((prevStatus) =>
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

            {showModal && modalData && (
                <ModalEdit
                    object={modalData}
                    onClose={() => {
                        setModal(false);
                        setModalData(null);
                    }}
                />
            )}

            <PrimaryButton onClick={updateFilters}>
                {statusFilter == Status.ENABLED
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
