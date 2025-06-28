import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import ComboBox from "@/Components/ComboBox";
import SlideButton from "@/Components/slide-button";
import Table from "@/Components/Table";
import { Head, usePage } from "@inertiajs/react";
import { useState, useEffect, useMemo } from "react";
import Toast from "@/Components/Toast";
import ShowSale from "./ShowSale";

export default function ListSales({ records: initialRecords = [], properties, module, auth }) {
    const title = "Historial de ventas";


    
    const [baseRecords, setBaseRecords] = useState(initialRecords);
    const [customerFilter, setCustomerFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState("Habilitado");

    

    const [showModal, setModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [codeFilter, setCodeFilter] = useState(null);
    const [userFilter, setUserFilter] = useState(null);

    const { report, errors } = usePage().props;

        const [toast, setToast] = useState(report || null);
        const [toastKey, setToastKey] = useState(0);

        useEffect(() => {
            if (report) {
                setToast(report);
                setToastKey(Date.now());
            }
        }, [report]);


    useEffect(() => {
        setBaseRecords(initialRecords);
    }, [initialRecords]);

    const filteredRecords = useMemo(() => {
        return baseRecords.filter((record) => {
            const statusMatch = record.status === statusFilter;
            const customerMatch = customerFilter
                ? record.customer?.toLowerCase().includes(customerFilter.name.toLowerCase())
                : true;

            const codeMatch = codeFilter
            ? record.code?.toLowerCase().includes(codeFilter.name.toLowerCase())
            : true;

            const userMatch = userFilter
                ? record.user?.toLowerCase().includes(userFilter.name.toLowerCase())
                : true;

            return statusMatch && customerMatch && codeMatch && userMatch;
            
        });
    }, [baseRecords, customerFilter, statusFilter, codeFilter, userFilter]);

    const resetFilters = () => {
        setCustomerFilter(null);
        setCodeFilter(null);
        setUserFilter(null);
    };

    const editInfo = (id) => {
        const record = baseRecords.find((record) => record.id === id);
        if (record) {
            setModalData(record);
            setModal(true);
        }
    };

    const itemsCombobox = (prop) => {
        const values = [...new Set(baseRecords.map((r) => r[prop]).filter(Boolean))];
        return values.map((value, idx) => ({
            id: idx,
            name: value,
        }));
    };

    return (
        <AuthenticatedLayout title={title} user={auth.user} module={module}>
            <Head title={title} />

            {toast && (
                <Toast key={toastKey} message={toast.message} type={toast.type} />
            )}

            {showModal && modalData && (
                <ShowSale
                    sale={modalData}
                    onClose={() => {
                        setModal(false);
                        setModalData(null);
                    }}
                />
            )}

            <div className="inline-flex w-full h-full py-6 px-16 gap-10">
                {/* Filtros */}
                <div className="flex flex-col w-[464px] gap-8 min-w-64 text-slate-700">
                    <h2 className="text-xl font-semibold pb-[10px] border-b">Filtros</h2>

                    <ComboBox
                        id="customer"
                        label="Cliente"
                        items={itemsCombobox("customer")}
                        value={customerFilter}
                        onChange={setCustomerFilter}
                    />

                    <ComboBox
                        id="code"
                        label="Código"
                        items={itemsCombobox("code")}
                        value={codeFilter}
                        onChange={setCodeFilter}
                    />

                    <ComboBox
                        id="user"
                        label="Registrado por"
                        items={itemsCombobox("user")}
                        value={userFilter}
                        onChange={setUserFilter}
                    />

                    <PrimaryButton onClick={resetFilters}>
                        Eliminar filtros
                    </PrimaryButton>
                </div>

                {/* Tabla */}
                <div className="flex-1 flex flex-col">
                    <SlideButton
                        className="flex mb-[13px] justify-end"
                        value={statusFilter === "Habilitado"}
                        onChange={(val) =>
                            setStatusFilter(val ? "Habilitado" : "Deshabilitado")
                        }
                    />

                    <Table
                        module={module}
                        properties={[
                            ...properties,
                            { name: "user", tag: "Registrado por" },
                            { name: "created_at", tag: "Fecha" },
                        ]}
                        records={filteredRecords}
                        editInfo={editInfo}
                        editStatus={true}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
