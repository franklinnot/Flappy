import Table from "@/Components/Table";
import { useState, useEffect, useMemo } from "react"; // Agregamos useMemo
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Toast from "@/Components/Toast";
import { usePage } from "@inertiajs/react";
import Status from "@/Utils/status";
import SlideButton from "@/Components/slide-button";
import ComboBox from "@/Components/ComboBox";
import PrimaryButton from "@/Components/PrimaryButton";

export default function ListOperations({
    records: initialRecords = [],
    properties,
    module,
    report,
}) {
    const title = "Historial de operaciones";
    let errors = usePage()?.props?.errors;

    const [baseRecords, setBaseRecords] = useState(initialRecords);

    // Notificaciones
    const [toast, setToast] = useState(null);
    const [toastKey, setToastKey] = useState(0);

    // Filtros
    const [codeFilter, setCodeFilter] = useState(null);
    const [lotFilter, setLotFilter] = useState(null);
    const [typeFilter, setTypeFilter] = useState(null);
    const [supplierFilter, setSupplierFilter] = useState(null);
    const [userFilter, setUserFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState(Status.ENABLED);

    const resetFilters = () => {
        setCodeFilter(null);
        setLotFilter(null);
        setTypeFilter(null);
        setSupplierFilter(null);
        setUserFilter(null);
        setStatusFilter(Status.ENABLED);
    };

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
                    return newBaseRecords;
                });
            }
        }
    }, [report]);

    useEffect(() => {
        if (errors?.report_type) {
            setToast({
                message: errors.report_message,
                type: errors.report_type,
            });
            setToastKey(Date.now());
        }
    }, [errors]);

    // calcular filteredRecords en base a baserecords y todos los filtros.
    const filteredRecords = useMemo(() => {
        return baseRecords.filter((record) => {
            const statusMatch = record.status === statusFilter;

            const codeMatch = codeFilter
                ? record.lot
                      .toLowerCase()
                      .includes(codeFilter.name.toLowerCase())
                : true;

            const lotMatch = lotFilter
                ? record.lot
                      .toLowerCase()
                      .includes(lotFilter.name.toLowerCase())
                : true;

            const typeMatch = typeFilter
                ? record.type
                      .toLowerCase()
                      .includes(typeFilter.name.toLowerCase())
                : true;

            const supplierMatch = supplierFilter
                ? record.supplier &&
                  record.supplier
                      .toLowerCase()
                      .includes(supplierFilter.name.toLowerCase())
                : true;

            const userMatch = userFilter
                ? record.user
                      .toLowerCase()
                      .includes(userFilter.name.toLowerCase())
                : true;

            return (
                codeMatch &&
                statusMatch &&
                lotMatch &&
                typeMatch &&
                supplierMatch &&
                userMatch
            );
        });
    }, [
        baseRecords,
        statusFilter,
        lotFilter,
        typeFilter,
        supplierFilter,
        userFilter,
    ]);

    // generar los items para los comboBox
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

            <div className="inline-flex w-full h-full py-6 px-16 gap-10">
                {/* filtros */}
                <div className="flex flex-col w-[464px] gap-8 w-min-64 text-slate-700">
                    <h2 className="text-xl font-semibold pb-[10px] border-b">
                        Filtros
                    </h2>
                    <ComboBox
                        id="code"
                        label="Código"
                        items={itemsCombobox("code")}
                        value={codeFilter}
                        onChange={(value) => setCodeFilter(value)}
                    />

                    <ComboBox
                        id="lot"
                        label="Lote"
                        items={itemsCombobox("lot")}
                        value={lotFilter}
                        onChange={(value) => setLotFilter(value)}
                    />

                    <ComboBox
                        id="type"
                        label="Tipo de operación"
                        items={itemsCombobox("type")}
                        value={typeFilter}
                        onChange={(value) => setTypeFilter(value)}
                    />

                    <ComboBox
                        id="supplier"
                        label="Proveedor"
                        items={itemsCombobox("supplier")}
                        value={supplierFilter}
                        onChange={(value) => setSupplierFilter(value)}
                    />

                    <ComboBox
                        id="user"
                        label="Usuario"
                        items={itemsCombobox("user")}
                        value={userFilter}
                        onChange={(value) => setUserFilter(value)}
                    />
                    <PrimaryButton onClick={resetFilters}>
                        Eliminar filtros
                    </PrimaryButton>
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
                        isImportant={true}
                        editStatus={true}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
