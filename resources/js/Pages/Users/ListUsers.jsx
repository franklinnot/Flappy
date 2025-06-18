import Table from "@/Components/Table";
import { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import Toast from "@/Components/Toast";
import Status from "@/Utils/status";
import EditUser from "./EditUser";
import SlideButton from "@/Components/slide-button";
import ComboBox from "@/Components/ComboBox";

export default function ListUsers({
    records: initialRecords = [],
    properties,
    module,
    report,
}) {
    const title = "Lista de Usuarios";
    let errors = usePage()?.props?.errors;

    const [baseRecords, setBaseRecords] = useState(initialRecords);

    // Filtros
    const [dniFilter, setDniFilter] = useState(null);
    const [nameFilter, setNameFilter] = useState(null);
    const [rolFilter, setRolFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState(Status.ENABLED);

    // Notificaciones
    const [toast, setToast] = useState(null);
    const [toastKey, setToastKey] = useState(0);

    // Modal para editar informacion
    const [showModal, setModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        setBaseRecords(initialRecords);
    }, [initialRecords]);

    useEffect(() => {
        if (report) {
            setToast(report);
            setToastKey(Date.now());

            if (report.updatedRecord) {
                setBaseRecords((prevBaseRecords) => {
                    const newBaseRecords = prevBaseRecords.map((rec) =>
                        rec.id === report.updatedRecord.id
                            ? report.updatedRecord
                            : rec
                    );
                    if (
                        showModal &&
                        modalData &&
                        modalData.id === report.updatedRecord.id
                    ) {
                        setModalData(report.updatedRecord);
                    }
                    return newBaseRecords;
                });
            }
        }
    }, [report, showModal, modalData]);

    useEffect(() => {
        if (errors?.report_type) {
            setToast({
                message: errors.report_message,
                type: errors.report_type,
            });
            setToastKey(Date.now());
        }
    }, [errors]);

    const filteredRecords = useMemo(() => {
        return baseRecords.filter((record) => {
            const statusMatch = record.status === statusFilter;
            const dniMatch = dniFilter
                ? record.dni
                      .toLowerCase()
                      .includes(dniFilter.name.toLowerCase())
                : true;
            const nameMatch = nameFilter
                ? record.name
                      .toLowerCase()
                      .includes(nameFilter.name.toLowerCase())
                : true;
            const rolMatch = rolFilter
                ? record.rol
                      .toLowerCase()
                      .includes(rolFilter.name.toLowerCase())
                : true;
            return statusMatch && dniMatch && nameMatch && rolMatch;
        });
    }, [
        baseRecords,
        statusFilter,
        dniFilter,
        nameFilter,
        rolFilter,
    ]);

    const editInfo = (id) => {
        const record = baseRecords.find((record) => record.id === id);
        if (record) {
            setModalData(record);
            setModal(true);
        }
    };

    const itemsCombobox = (prop) => {
        return filteredRecords.map((r) => ({
            id: r.id,
            name: r[prop],
        }));
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

            {showModal && modalData && (
                <EditUser
                    object={modalData}
                    onClose={() => {
                        setModal(false);
                        setModalData(null);
                    }}
                />
            )}

            <div className="inline-flex w-full h-full py-6 px-16 gap-10">
                {/* filtros */}
                <div className="flex flex-col w-[464px] gap-8 w-min-64 text-slate-700">
                    <h2 className="text-xl font-semibold pb-[10px] border-b">
                        Filtros
                    </h2>
                    <ComboBox
                        id="dni"
                        label="DNI"
                        items={itemsCombobox("dni")}
                        value={dniFilter}
                        onChange={(value) => setDniFilter(value)}
                    />

                    <ComboBox
                        id="name"
                        label="Nombre"
                        items={itemsCombobox("name")}
                        value={nameFilter}
                        onChange={(value) => setNameFilter(value)}
                    />

                    <ComboBox
                        id="rol"
                        label="Rol"
                        items={itemsCombobox("rol")}
                        value={rolFilter}
                        onChange={(value) => setRolFilter(value)}
                    />
                </div>
                <div className="flex-1 flex flex-col">
                    <SlideButton
                        className="flex mb-[13px] justify-end"
                        value={statusFilter == Status.ENABLED}
                        onChange={(val) => {
                            setStatusFilter(
                                val ? Status.ENABLED : Status.DISABLED
                            );
                        }}
                    />
                    <Table
                        module={module}
                        properties={properties}
                        records={filteredRecords}
                        editInfo={editInfo}
                        editStatus={true}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}