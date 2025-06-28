import Table from "@/Components/Table";
import { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import Toast from "@/Components/Toast";
import Status from "@/Utils/status";
import ComboBox from "@/Components/ComboBox";
import SlideButton from "@/Components/slide-button";
import EditLot from "./EditLot";

export default function ListLots({
    records: initialRecords = [],
    properties,
    module,
    report
}) {
    const title = "Lotes";
    let errors = usePage()?.props?.errors;

    const [baseRecords, setBaseRecords] = useState(initialRecords);

    // Filtros
    const [codeFilter, setCodeFilter] = useState(null);
    const [expStatusFilter, setExpStatusFilter] = useState(null);
    const [productFilter, setProductFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState(Status.ENABLED);
    const [priceOrder, setPriceOrder] = useState(null); // "asc" | "desc"
    const [stockOrder, setStockOrder] = useState(null);
    const orderOptions = [
        { id: "asc", name: "Menor a mayor" },
        { id: "desc", name: "Mayor a menor" },
    ];


    // Notificaciones
    const [toast, setToast] = useState(null);
    const [toastKey, setToastKey] = useState(0);

    // Modal
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
                setBaseRecords((prev) =>
                    prev.map((rec) =>
                        rec.id === report.updatedRecord.id ? report.updatedRecord : rec
                    )
                );
                if (showModal && modalData?.id === report.updatedRecord.id) {
                    setModalData(report.updatedRecord);
                }
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

    const filteredRecords = useMemo(() => {
        let records = baseRecords.filter((record) => {
            const codeMatch = codeFilter
                ? record.code.toLowerCase().includes(codeFilter.name.toLowerCase())
                : true;
            const expStatusMatch = expStatusFilter
                ? record.exp_status === expStatusFilter.name
                : true;
            const productMatch = productFilter
                ? record.product?.toLowerCase().includes(productFilter.name.toLowerCase())
                : true;
            const statusMatch = record.status === statusFilter;

            return codeMatch && expStatusMatch && productMatch && statusMatch;
        });

        // Orden por precio
        if (priceOrder) {
            records = records.sort((a, b) =>
                priceOrder === "asc" ? a.price - b.price : b.price - a.price
            );
        }

        // Orden por stock
        if (stockOrder) {
            records = records.sort((a, b) =>
                stockOrder === "asc" ? a.stock - b.stock : b.stock - a.stock
            );
        }

        return records;
    }, [
        baseRecords,
        codeFilter,
        expStatusFilter,
        productFilter,
        statusFilter,
        priceOrder,
        stockOrder,
    ]);


    const editInfo = (id) => {
        const record = baseRecords.find((r) => r.id === id);
        if (record) {
            setModalData(record);
            setModal(true);
        }
    };

    const itemsCombobox = (prop) => {
        const seen = new Set();
        return filteredRecords
            .map((r) => {
                const name = r[prop];
                if (!name || seen.has(name)) return null;
                seen.add(name);
                return { id: name, name };
            })
            .filter(Boolean);
    };


    return (
        <AuthenticatedLayout title={title}>
            <Head title={title} />

            {toast && <Toast key={toastKey} message={toast.message} type={toast.type} />}

            {showModal && modalData && (
                <EditLot
                    object={modalData}
                    onClose={() => {
                        setModal(false);
                        setModalData(null);
                    }}
                />
            )}

            <div className="inline-flex w-full h-full py-6 px-16 gap-10">
                <div className="flex flex-col w-[464px] gap-8 text-slate-700">
                    <h2 className="text-xl font-semibold pb-[10px] border-b">Filtros</h2>

                    <ComboBox
                        id="code"
                        label="Código"
                        items={itemsCombobox("code")}
                        value={codeFilter}
                        onChange={setCodeFilter}
                    />
                    <ComboBox
                        id="exp_status"
                        label="Estado de Vencimiento"
                        items={itemsCombobox("exp_status")}
                        value={expStatusFilter}
                        onChange={setExpStatusFilter}
                    />
                    <ComboBox
                        id="product"
                        label="Producto"
                        items={itemsCombobox("product")}
                        value={productFilter}
                        onChange={setProductFilter}
                    />
                    <ComboBox
                        id="price_order"
                        label="Precio"
                        items={orderOptions}
                        value={orderOptions.find((o) => o.id === priceOrder)}
                        onChange={(value) => setPriceOrder(value?.id)}
                    />

                    <ComboBox
                        id="stock_order"
                        label="Stock"
                        items={orderOptions}
                        value={orderOptions.find((o) => o.id === stockOrder)}
                        onChange={(value) => setStockOrder(value?.id)}
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
