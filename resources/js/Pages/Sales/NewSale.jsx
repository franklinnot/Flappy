import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputField from "@/Components/InputField";
import PrimaryButton from "@/Components/PrimaryButton";
import ComboBox from "@/Components/ComboBox";
import Toast from "@/Components/Toast";
import Loading from "@/Components/loading";
import Table from "@/Components/Table";
import ModalCliente from "@/Components/ModalCliente";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function NewSale({ lots, customers, report, errors: serverErrors }) {
    const title = "Registrar venta";

    const [availableLots, setAvailableLots] = useState(() =>
        lots.map((lot) => ({ ...lot }))
    );
    const [lot, setLot] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [customer, setCustomer] = useState(null);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [toastKey, setToastKey] = useState(0);


    const [showModal, setShowModal] = useState(false);
    const [isCustomerRequired, setIsCustomerRequired] = useState(false);
    const [tempCustomer, setTempCustomer] = useState(null);

    useEffect(() => {
        if (report) {
            setToast(report);
            setToastKey(Date.now());
        } else if (serverErrors?.report_type) {
            setToast({
                message: serverErrors.report_message,
                type: serverErrors.report_type,
            });
            setToastKey(Date.now());
        }
    }, [report, serverErrors]);

    useEffect(() => {
        const sumTotal = items.reduce((acc, item) => acc + item.subtotal, 0);
        setTotal(sumTotal);
        if (sumTotal <= 700 && customer !== null) {
            setCustomer(null);
        }
    }, [items]);

    const currentQuantity = parseFloat(quantity);
    const currentPrice = parseFloat(lot?.price ?? 0);
    const currentSubtotal =
        !isNaN(currentQuantity) && !isNaN(currentPrice)
            ? currentQuantity * currentPrice
            : 0;

    const addItem = () => {
    setErrors({});
    if (!lot) return showError("Seleccione un lote válido");
    if (!quantity || currentQuantity <= 0)
        return showError("Ingrese una cantidad válida");

    const lotFromState = availableLots.find((l) => l.id === lot.id);
    if (!lotFromState) return showError("Lote no encontrado");

    const currentStock = lotFromState.stock;

    if (currentQuantity > currentStock) {
        return showError("Cantidad excede stock disponible");
    }

    const newItems = [...items];
    const existingIndex = newItems.findIndex((i) => i.lot.id === lot.id);

    if (existingIndex >= 0) {
        const updatedItem = { ...newItems[existingIndex] };
        updatedItem.quantity += currentQuantity;
        updatedItem.subtotal = updatedItem.quantity * currentPrice;
        newItems[existingIndex] = updatedItem;
    } else {
        const newItem = {
            id: crypto.randomUUID(),
            lot,
            quantity: currentQuantity,
            subtotal: currentSubtotal,
        };
        newItems.push(newItem);
    }

    const updatedLots = availableLots.map((l) =>
        l.id === lot.id
            ? { ...l, stock: l.stock - currentQuantity }
            : l
    );

    setItems(newItems);
    setAvailableLots(updatedLots);
    setLot(null);
    setQuantity("");
};


    const removeItem = (id) => {
    const itemToRemove = items.find((i) => i.id === id);
    if (!itemToRemove) return;

    // Restaurar stock exacto del lote
    const updatedLots = availableLots.map((l) =>
        l.id === itemToRemove.lot.id
            ? { ...l, stock: l.stock + itemToRemove.quantity }
            : l
    );

    const updatedItems = items.filter((i) => i.id !== id);

    setItems(updatedItems);
    setAvailableLots(updatedLots);
    if (lot?.id === itemToRemove.lot.id) {
    const updatedLot = updatedLots.find((l) => l.id === lot.id);
    setLot(updatedLot || null);
}

};


    const showError = (message) => {
        setToast({ message, type: "error" });
        setToastKey(Date.now());
    };

    const handleModalConfirm = (selectedCustomer) => {
        setCustomer(selectedCustomer);
        setShowModal(false);
        sendSale(selectedCustomer);
    };

    const submit = (e) => {
        e.preventDefault();
        setErrors({});

        if (items.length === 0) {
            showError("Agregue al menos un producto");
            return;
        }

        if (!customer && total > 700) {
            setIsCustomerRequired(true);
            setShowModal(true);
            return;
        }

        if (!customer && total <= 700) {
            setIsCustomerRequired(false);
            setShowModal(true);
            return;
        }

        sendSale(customer);
    };

    const sendSale = (finalCustomer) => {
        const payload = {
            items: items.map((i) => ({
                lot_id: i.lot.id,
                quantity: i.quantity,
            })),
            customer: finalCustomer ? { id: finalCustomer.id } : null,
        };

        setProcessing(true);

        router.post(route("sales.new"), payload, {
            preserveScroll: true,
            onSuccess: () => {
                setLot(null);
                setQuantity("");
                setCustomer(null);
                setItems([]);
                setTotal(0);
                setAvailableLots(lots.map((l) => ({ ...l }))); // Reiniciar stock visual
            },
            onError: (errors) => {
                setErrors(errors);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const tableProperties = [
        { name: "lotCode", tag: "Código" },
        { name: "image", tag: "Imagen" },
        { name: "productName", tag: "Producto" },
        { name: "quantity", tag: "Cantidad" },
        { name: "price", tag: "Precio Unit." },
        { name: "subtotal", tag: "Subtotal" },
        { name: "actions", tag: "Acciones" },
    ];

    const tableRecords = items.map((item) => {
        const product = item.lot.product;
        const productName = product?.name || "Producto";
        const rawPicture = product?.picture;

        const isValidPicture =
            typeof rawPicture === "string" &&
            rawPicture.trim() !== "" &&
            (rawPicture.startsWith("http") || rawPicture.startsWith("/"));

        const imageUrl = isValidPicture
            ? rawPicture
            : "/images/placeholder.png";

        return {
            id: item.id,
            lotCode: item.lot.code,
            image: (
                <img
                    src={imageUrl}
                    alt={productName}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                        e.target.src = "/images/placeholder.png";
                    }}
                />
            ),
            productName,
            quantity: item.quantity,
            price: `S/. ${Number(item.lot.price).toFixed(2)}`,
            subtotal: `S/. ${Number(item.subtotal).toFixed(2)}`,
            actions: (
                <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                    type="button"
                >
                    🗑️
                </button>
            ),
        };
    });

    return (
        <AuthenticatedLayout title={title}>
            <Head title={title} />
            {toast && <Toast key={toastKey} message={toast.message} type={toast.type} />}
            <Loading isLoading={processing} />
            <ModalCliente
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleModalConfirm}
                customers={customers}
                obligatorio={isCustomerRequired}
                selectedCustomer={tempCustomer}
                setSelectedCustomer={setTempCustomer}
            />
            <form onSubmit={submit} className="flex flex-col gap-6 pb-16 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <ComboBox
                        id="lot"
                        label="Lote"
                        items={availableLots}
                        value={lot}
                        onChange={setLot}
                        disabled={processing}
                        error={errors.lot}
                        itemToString={(item) => item?.name || ""}
                    />
                    <InputField
                        id="quantity"
                        label="Cantidad"
                        type="number"
                        min={1}
                        inputMode="numeric"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        disabled={processing}
                        error={errors.quantity}
                    />
                    <InputField
                        id="stock"
                        label="Stock disponible"
                        type="number"
                        value={lot?.stock ?? ""}
                        disabled
                    />
                    <InputField
                        id="unit"
                        label="Unidad de medida"
                        type="text"
                        value={lot?.product?.unit ?? ""}
                        disabled
                    />
                    <div className="sm:col-start-2">
                        <button
                            type="button"
                            onClick={addItem}
                            disabled={processing}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            Agregar producto
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    <Table
                        properties={tableProperties}
                        records={tableRecords}
                        className="shadow-md rounded"
                    />
                </div>

                <div className="text-right font-semibold text-lg mt-4">
                    Total acumulado: S/. {total.toFixed(2)}
                </div>

                <PrimaryButton disabled={processing} className="mt-6 self-end">
                    Registrar venta
                </PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
