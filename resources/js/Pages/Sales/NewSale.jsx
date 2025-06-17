import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputField from "@/Components/InputField";
import PrimaryButton from "@/Components/PrimaryButton";
import ComboBox from "@/Components/ComboBox";
import Toast from "@/Components/Toast";
import Loading from "@/Components/Loading";
import Table from "@/Components/Table";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function NewSale({ lots, customers, paymentMethods, report, errors: serverErrors }) {
    const title = "Registrar venta";

    const [availableLots, setAvailableLots] = useState(() => lots.map((lot) => ({ ...lot })));
    const [lot, setLot] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [customer, setCustomer] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [toastKey, setToastKey] = useState(0);
    const [customerDni, setCustomerDni] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

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

    useEffect(() => {
        setCustomerDni(customer?.dni || "");
        setCustomerPhone(customer?.phone || "");
    }, [customer]);

    const currentQuantity = parseFloat(quantity);
    const currentPrice = parseFloat(lot?.price ?? 0);
    const currentSubtotal = !isNaN(currentQuantity) && !isNaN(currentPrice) ? currentQuantity * currentPrice : 0;

    const showError = (message) => {
        setToast({ message, type: "error" });
        setToastKey(Date.now());
    };

    const addItem = () => {
        setErrors({});
        if (!lot) return showError("Seleccione un lote válido");
        if (!quantity || currentQuantity <= 0) return showError("Ingrese una cantidad válida");

        const lotFromState = availableLots.find((l) => l.id === lot.id);
        if (!lotFromState) return showError("Lote no encontrado");

        const currentStock = lotFromState.stock;
        if (currentQuantity > currentStock) return showError("Cantidad excede stock disponible");

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
            l.id === lot.id ? { ...l, stock: l.stock - currentQuantity } : l
        );

        setItems(newItems);
        setAvailableLots(updatedLots);
        setLot(null);
        setQuantity("");
    };

    const removeItem = (id) => {
        const itemToRemove = items.find((i) => i.id === id);
        if (!itemToRemove) return;

        const updatedLots = availableLots.map((l) =>
            l.id === itemToRemove.lot.id ? { ...l, stock: l.stock + itemToRemove.quantity } : l
        );

        const updatedItems = items.filter((i) => i.id !== id);
        setItems(updatedItems);
        setAvailableLots(updatedLots);
        if (lot?.id === itemToRemove.lot.id) {
            const updatedLot = updatedLots.find((l) => l.id === lot.id);
            setLot(updatedLot || null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        setErrors({});

        if (items.length === 0) return showError("Agregue al menos un producto");

        if (total > 700 && !customer) return showError("Seleccione un cliente");
        if (!paymentMethod) return showError("Seleccione un método de pago");
        sendSale(customer);
    };

    const sendSale = (finalCustomer) => {
        const payload = {
            items: items.map((i) => ({ lot_id: i.lot.id, quantity: i.quantity })),
            customer: finalCustomer ? { id: finalCustomer.id } : null,
            payment: paymentMethod ? { id: paymentMethod.id } : null,

        };
        console.log("Enviando venta:", payload);

        setProcessing(true);

        router.post(route("sales.new"), payload, {
            preserveScroll: true,
            onSuccess: () => {
                setLot(null);
                setQuantity("");
                setCustomer(null);
                setItems([]);
                setTotal(0);
                setAvailableLots(lots.map((l) => ({ ...l })));
                setPaymentMethod(null);
            },
            onError: (errors) => setErrors(errors),
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

        const isValidPicture = typeof rawPicture === "string" && rawPicture.trim() !== "" && (rawPicture.startsWith("http") || rawPicture.startsWith("/"));
        const imageUrl = isValidPicture ? rawPicture : "/images/placeholder.png";

        return {
            id: item.id,
            lotCode: item.lot.code,
            image: <img src={imageUrl} alt={productName} className="w-12 h-12 object-cover rounded" onError={(e) => { e.target.src = "/images/placeholder.png"; }} />,
            productName,
            quantity: item.quantity,
            price: `S/. ${Number(item.lot.price).toFixed(2)}`,
            subtotal: `S/. ${Number(item.subtotal).toFixed(2)}`,
            actions: (
                <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-800" title="Eliminar" type="button">🗑️</button>
            ),
        };
    });

    return (
        <AuthenticatedLayout title={title}>
            <Head title={title} />
            {toast && <Toast key={toastKey} message={toast.message} type={toast.type} />}
            <Loading isLoading={processing} />

            <form onSubmit={submit} className="flex gap-4 pb-16 min-h-[500px]">
                <div className="w-full md:w-[70%] flex flex-col gap-6 pr-4 border-r border-gray-300">
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
                            >Agregar producto</button>
                        </div>
                    </div>

                    <div className="mt-8 max-h-72 overflow-y-auto">
                        <Table properties={tableProperties} records={tableRecords} className="shadow-md rounded" />
                    </div>

                    <div className="text-right font-semibold text-lg mt-4">
                        Total acumulado: S/. {total.toFixed(2)}
                    </div>
                </div>

                <div className="w-full md:w-[30%] flex flex-col gap-6 pl-4">
                    <ComboBox
                        id="customer"
                        label="Cliente"
                        items={customers}
                        value={customer}
                        onChange={setCustomer}
                        disabled={processing}
                        error={errors.customer}
                        itemToString={(item) => item?.name || ""}
                    />
                    <InputField
                        id="customer-dni"
                        label="DNI"
                        type="text"
                        value={customerDni}
                        disabled
                    />
                    <InputField
                        id="customer-phone"
                        label="Teléfono"
                        type="text"
                        value={customerPhone}
                        disabled
                    />
                    <ComboBox
                        id="payment-method"
                        label="Método de pago"
                        items={paymentMethods}
                        value={paymentMethod}
                        onChange={setPaymentMethod}
                        disabled={processing}
                        error={errors.paymentMethod}
                        itemToString={(item) => item?.name || ""}
                    />
                    <PrimaryButton disabled={processing} className="self-end">
                        Registrar venta
                    </PrimaryButton>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
