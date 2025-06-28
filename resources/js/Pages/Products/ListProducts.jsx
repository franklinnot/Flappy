import Table from "@/Components/Table";
import { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import Toast from "@/Components/Toast";
import Status from "@/Utils/status";
import SlideButton from "@/Components/slide-button";
import ComboBox from "@/Components/ComboBox";
import EditProduct from "./EditProduct";

export default function ListProducts({
    records: initialRecords = [],
    properties,
    module,
    report,
    status,
    unidades,
    categorias
}) {
    const title = "Productos";
    const errors = usePage()?.props?.errors;

    const [baseRecords, setBaseRecords] = useState(initialRecords);
    const [statusFilter, setStatusFilter] = useState(status);

    const [codeFilter, setCodeFilter] = useState(null);
    const [nameFilter, setNameFilter] = useState(null);
    const [unitFilter, setUnitFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);

    const [toast, setToast] = useState(null);
    const [toastKey, setToastKey] = useState(0);

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
        return baseRecords.filter((r) => {
            const statusMatch = r.status === statusFilter;
            const codeMatch = codeFilter
                ? r.code?.toLowerCase().includes(codeFilter.name.toLowerCase())
                : true;
            const nameMatch = nameFilter
                ? r.name?.toLowerCase().includes(nameFilter.name.toLowerCase())
                : true;
            const unitMatch = unitFilter
                ? r.unit?.toLowerCase().includes(unitFilter.name.toLowerCase())
                : true;
            const categoryMatch = categoryFilter
                ? r.categorie?.toLowerCase().includes(categoryFilter.name.toLowerCase())
                : true;

            return statusMatch && codeMatch && nameMatch && unitMatch && categoryMatch;
        });
    }, [baseRecords, statusFilter, codeFilter, nameFilter, unitFilter, categoryFilter]);

    const editInfo = (id) => {
        const record = baseRecords.find((r) => r.id === id);
        if (record) {
            setModalData(record);
            setModal(true);
        }
    };

    const getUniqueItems = (field) => {
        const values = [...new Set(baseRecords.map((r) => r[field] ?? "-"))];
        return values.map((v, idx) => ({ id: idx, name: v }));
    };

    return (
        <AuthenticatedLayout title={title}>
            <Head title={title} />

            {toast && (
                <Toast key={toastKey} message={toast.message} type={toast.type} />
            )}

            {showModal && modalData && (
                <EditProduct
                    object={modalData}
                    onClose={() => {
                        setModal(false);
                        setModalData(null);
                    }}
                    unidades={unidades}
                    categorias={categorias}
                />
            )}

            <div className="inline-flex w-full h-full py-6 px-16 gap-10">
                {/* Filtros */}
                <div className="flex flex-col w-[464px] gap-8 text-slate-700">
                    <h2 className="text-xl font-semibold pb-[10px] border-b">Filtros</h2>

                    <ComboBox
                        id="code"
                        label="Código"
                        items={getUniqueItems("code")}
                        value={codeFilter}
                        onChange={setCodeFilter}
                    />
                    <ComboBox
                        id="name"
                        label="Nombre"
                        items={getUniqueItems("name")}
                        value={nameFilter}
                        onChange={setNameFilter}
                    />
                    <ComboBox
                        id="unit"
                        label="Unidad de medida"
                        items={getUniqueItems("unit")}
                        value={unitFilter}
                        onChange={setUnitFilter}
                    />
                    <ComboBox
                        id="categorie"
                        label="Categoría"
                        items={getUniqueItems("categorie")}
                        value={categoryFilter}
                        onChange={setCategoryFilter}
                    />

                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        onClick={() => {
                            setCodeFilter(null);
                            setNameFilter(null);
                            setUnitFilter(null);
                            setCategoryFilter(null);
                        }}
                    >
                        Limpiar filtros
                    </button>
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
