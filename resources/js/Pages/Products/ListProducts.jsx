import Table from "@/Components/Table";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import Toast from "@/Components/Toast";
import Status from "@/Utils/status";
import PrimaryButton from "@/Components/PrimaryButton";
import SlideButton from "@/Components/slide-button";
import ComboBox from "@/Components/ComboBox";
import EditProduct from "./EditProduct";

export default function ListProducts({
    records = [],
    properties,
    module,
    report,
    status,
}) {
    const title = "Lista de Productos";
    const [toast, setToast] = useState(null);
    const [toastKey, setToastKey] = useState(0);
    const [statusFilter, setStatusFilter] = useState(status);
    const [filteredRecords, setFilteredRecords] = useState([]);

    const [showModal, setModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    // Filtros individuales
    const [codeFilter, setCodeFilter] = useState("");
    const [nameFilter, setNameFilter] = useState("");
    const [unitFilter, setUnitFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    useEffect(() => {
        if (report) {
            setToast(report);
            setToastKey(Date.now());

            if (report.updatedRecord) {
                setFilteredRecords((prev) =>
                    prev.map((r) =>
                        r.id === report.updatedRecord.id ? report.updatedRecord : r
                    )
                );
            }
        }
        setStatusFilter(status);
    }, []);

    // Aplica todos los filtros y estado
    useEffect(() => {
        let temp = records.filter((r) => r.status === statusFilter);

        if (codeFilter) temp = temp.filter((r) => r.code === codeFilter.name);
        if (nameFilter) temp = temp.filter((r) => r.name === nameFilter.name);
        if (unitFilter) temp = temp.filter((r) => r.unit === unitFilter.name);
        if (categoryFilter) temp = temp.filter((r) => r.categorie === categoryFilter.name);

        setFilteredRecords(temp);
    }, [records, statusFilter, codeFilter, nameFilter, unitFilter, categoryFilter]);

    const editInfo = (id) => {
        const record = filteredRecords.find((record) => record.id === id);
        if (record) {
            setModalData(record);
            setModal(true);
        }
    };

    const handleToggleStatus = () => {
        setStatusFilter((prevStatus) =>
            prevStatus === Status.ENABLED ? Status.DISABLED : Status.ENABLED
        );
    };

    const getUniqueOptions = (field) => {
        const set = new Set(records.map((r) => r[field] || "-"));
        return [...set];
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
        />
    )}

    <div className="inline-flex w-full h-full py-6 px-16 gap-10">
        <div className="flex flex-col w-[464px] gap-8 w-min-64 text-slate-700">
            <h2 className="text-xl font-semibold pb-[10px] border-b">Filtros</h2>

            <ComboBox
                id="code"
                label="Código"
                items={records.map(r => ({ id: r.id, name: r.code }))}
                value={codeFilter}
                onChange={setCodeFilter}
            />
            <ComboBox
                id="name"
                label="Nombre"
                items={records.map(r => ({ id: r.id, name: r.name }))}
                value={nameFilter}
                onChange={setNameFilter}
            />
            <ComboBox
                id="unit"
                label="Unidad de medida"
                items={records.map(r => ({ id: r.id, name: r.unit ?? "-" }))}
                value={unitFilter}
                onChange={setUnitFilter}
            />
            <ComboBox
                id="categorie"
                label="Categoría"
                items={records.map(r => ({ id: r.id, name: r.categorie ?? "-" }))}
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
            }}>
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
