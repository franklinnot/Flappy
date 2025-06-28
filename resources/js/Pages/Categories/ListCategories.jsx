import Table from "@/Components/Table";
import { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Toast from "@/Components/Toast";
import { usePage } from "@inertiajs/react";
import Status from "@/Utils/status";
import EditCategory from "./EditCategory";
import SlideButton from "@/Components/slide-button";
import ComboBox from "@/Components/ComboBox";

export default function ListCategories({
    records: initialRecords = [],
    properties,
    module,
    report,
}) {
    const title = "Categorías";
    let errors = usePage()?.props?.errors;

    const [baseRecords, setBaseRecords] = useState(initialRecords);

    // Filtro
    const [nameFilter, setNameFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState(Status.ENABLED);

    // Notificaciones
    const [toast, setToast] = useState(null);
    const [toastKey, setToastKey] = useState(0);

    // Modal para editar
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

    // Filtro por nombre y estado
    const filteredRecords = useMemo(() => {
        return baseRecords.filter((record) => {
            const statusMatch = record.status === statusFilter;
            const nameMatch = nameFilter
                ? record.name
                      .toLowerCase()
                      .includes(nameFilter.name.toLowerCase())
                : true;
            return statusMatch && nameMatch;
        });
    }, [baseRecords, statusFilter, nameFilter]);

    const editInfo = (id) => {
        const record = baseRecords.find((record) => record.id === id);
        if (record) {
            setModalData(record);
            setModal(true);
        }
    };

    const itemsCombobox = () => {
        return filteredRecords.map((r) => ({
            id: r.id,
            name: r.name,
        }));
    };

    return (
        <AuthenticatedLayout title={title}>
            <Head title={title} />

            {toast && (
                <Toast key={toastKey} message={toast.message} type={toast.type} />
            )}

            {showModal && modalData && (
                <EditCategory
                    object={modalData}
                    onClose={() => {
                        setModal(false);
                        setModalData(null);
                    }}
                />
            )}

            <div className="inline-flex w-full h-full py-6 px-16 gap-10">
                {/* Filtros */}
                <div className="flex flex-col w-[464px] gap-8 w-min-64 text-slate-700">
                    <h2 className="text-xl font-semibold pb-[10px] border-b">
                        Filtros
                    </h2>
                    <ComboBox
                        id="name"
                        label="Nombre"
                        items={itemsCombobox()}
                        value={nameFilter}
                        onChange={(value) => setNameFilter(value)}
                    />
                </div>

                <div className="flex-1 flex flex-col">
                    <SlideButton
                        className="flex mb-[13px] justify-end"
                        value={statusFilter == Status.ENABLED}
                        onChange={(val) =>
                            setStatusFilter(val ? Status.ENABLED : Status.DISABLED)
                        }
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
