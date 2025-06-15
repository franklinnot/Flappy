import Table from "@/Components/Table";
import { useState, useEffect, useMemo } from "react"; // Agregamos useMemo
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Toast from "@/Components/Toast";
import { usePage } from "@inertiajs/react";
import Status from "@/Utils/status";
import EditSupplier from "./EditSupplier";
import SlideButton from "@/Components/slide-button";
import ComboBox from "@/Components/ComboBox";

export default function ListSuppliers({
    records: initialRecords = [],
    properties,
    module,
    report,
}) {
    const title = "Lista de Proveedores";
    let errors = usePage()?.props?.errors;

    const [baseRecords, setBaseRecords] = useState(initialRecords);

    // Filtros
    const [rucFilter, setRucFilter] = useState(null);
    const [nameFilter, setNameFilter] = useState(null);
    const [phoneFilter, setPhoneFilter] = useState(null);
    const [addressFilter, setAddressFilter] = useState(null);
    const [emailFilter, setEmailFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState(Status.ENABLED);

    // Notificaciones
    const [toast, setToast] = useState(null);
    const [toastKey, setToastKey] = useState(0);

    // Modal para editar informacion
    const [showModal, setModal] = useState(false); // estado de visibilidad del modal
    const [modalData, setModalData] = useState(null); // datos del modal (contiene un registro)

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

                    // s el modal est abierto y el registro actualizado es
                    // el que se esta mostrando, actualiza el modalData.
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

    // calcular filteredRecords en base a baserecords y todos los filtros.
    const filteredRecords = useMemo(() => {
        return baseRecords.filter((record) => {
            const statusMatch = record.status === statusFilter;
            const rucMatch = rucFilter
                ? record.ruc
                      .toLowerCase()
                      .includes(rucFilter.name.toLowerCase())
                : true;
            const nameMatch = nameFilter
                ? record.name
                      .toLowerCase()
                      .includes(nameFilter.name.toLowerCase())
                : true;
            const phoneMatch = phoneFilter
                ? record.phone
                      .toLowerCase()
                      .includes(phoneFilter.name.toLowerCase())
                : true;
            const addressMatch = addressFilter
                ? record.address
                      .toLowerCase()
                      .includes(addressFilter.name.toLowerCase())
                : true;
            const emailMatch = emailFilter
                ? record.email
                      .toLowerCase()
                      .includes(emailFilter.name.toLowerCase())
                : true;

            return (
                statusMatch &&
                rucMatch &&
                nameMatch &&
                phoneMatch &&
                addressMatch &&
                emailMatch
            );
        });
    }, [
        baseRecords,
        statusFilter,
        rucFilter,
        nameFilter,
        phoneFilter,
        addressFilter,
        emailFilter,
    ]); // aqui colocar todos los filtros que se usen

    // abrir el modal de editar
    const editInfo = (id) => {
        const record = baseRecords.find((record) => record.id === id);
        if (record) {
            setModalData(record);
            setModal(true);
        }
    };

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

            {showModal && modalData && (
                <EditSupplier
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
                        id="ruc"
                        label="RUC"
                        items={itemsCombobox("ruc")}
                        value={rucFilter}
                        onChange={(value) => setRucFilter(value)}
                    />

                    <ComboBox
                        id="name"
                        label="Nombre"
                        items={itemsCombobox("name")}
                        value={nameFilter}
                        onChange={(value) => setNameFilter(value)}
                    />

                    <ComboBox
                        id="phone"
                        label="Teléfono"
                        items={itemsCombobox("phone")}
                        value={phoneFilter}
                        onChange={(value) => setPhoneFilter(value)}
                    />

                    <ComboBox
                        id="email"
                        label="Correo"
                        items={itemsCombobox("email")}
                        value={emailFilter}
                        onChange={(value) => setEmailFilter(value)}
                    />

                    <ComboBox
                        id="address"
                        label="Dirección"
                        items={itemsCombobox("address")}
                        value={addressFilter}
                        onChange={(value) => setAddressFilter(value)}
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
