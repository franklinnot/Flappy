import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputField from "@/Components/InputField";
import PrimaryButton from "@/Components/PrimaryButton";
import ComboBox from "@/Components/ComboBox";
import Toast from "@/Components/Toast";
import Loading from "@/Components/loading";
import Table from "@/Components/Table";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function NewSale({ lots, customers, report }) {
    const title = "Registrar venta";

    const { data, setData, post, reset, processing, errors } = useForm({
        lot: null,
        quantity: "",
        customer: null,
        items: [],
    });

    const [toast, setToast] = useState(null);
    const [toastKey, setToastKey] = useState(0);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (report) {
            setToast(report);
            setToastKey(Date.now());
        } else if (errors?.report_type) {
            setToast({
                message: errors.report_message,
                type: errors.report_type,
            });
            setToastKey(Date.now());
        }
    }, [report, errors]);

    useEffect(() => {
        const sumTotal = items.reduce((acc, item) => acc + item.subtotal, 0);
        setTotal(sumTotal);
        if (sumTotal <= 700 && data.customer !== null) {
            setData("customer", null);
        }
    }, [items]);

    const currentQuantity = parseFloat(data.quantity);
    const currentPrice = parseFloat(data.lot?.price ?? 0);
    const currentSubtotal = (!isNaN(currentQuantity) && !isNaN(currentPrice))
        ? currentQuantity * currentPrice
        : 0;

    const addItem = () => {
        if (!data.lot) {
            setToast({ message: "Seleccione un lote válido", type: "error" });
            setToastKey(Date.now());
            return;
        }
        if (!data.quantity || currentQuantity <= 0) {
            setToast({ message: "Ingrese una cantidad válida", type: "error" });
            setToastKey(Date.now());
            return;
        }
        if (currentQuantity > data.lot.stock) {
            setToast({ message: "Cantidad excede stock disponible", type: "error" });
            setToastKey(Date.now());
            return;
        }

        const existingIndex = items.findIndex(i => i.lot.id === data.lot.id);

        if (existingIndex >= 0) {
            const updatedItem = { ...items[existingIndex] };
            const newQuantity = updatedItem.quantity + currentQuantity;

            if (newQuantity > data.lot.stock) {
                setToast({ message: "Cantidad total excede stock disponible", type: "error" });
                setToastKey(Date.now());
                return;
            }

            updatedItem.quantity = newQuantity;
            updatedItem.subtotal = newQuantity * currentPrice;

            const newItems = [...items];
            newItems[existingIndex] = updatedItem;

            setItems(newItems);
        } else {
            const newItem = {
                id: crypto.randomUUID(),
                lot: data.lot,
                quantity: currentQuantity,
                subtotal: currentSubtotal,
            };
            setItems([...items, newItem]);
        }

        setData("lot", null);
        setData("quantity", "");
    };

    const removeItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    const submit = (e) => {
    e.preventDefault();

    if (items.length === 0) {
        setToast({ message: "Agregue al menos un producto", type: "error" });
        setToastKey(Date.now());
        return;
    }

    if (total > 700 && !data.customer) {
        setToast({ message: "Debe seleccionar un cliente para ventas mayores a S/.700", type: "error" });
        setToastKey(Date.now());
        return;
    }
                   
    const finalItems = items.map(i => ({
        lot_id: i.lot.id,
        quantity: i.quantity,
    }));

    // Actualizamos los datos del form
    setData("items", finalItems);

    // Esperamos un tick para que se actualice antes de hacer el post
    setTimeout(() => {
        post(route("sales.new"), {
            onSuccess: () => {
                reset();
                setItems([]);
                setTotal(0);
            },
            preserveScroll: true,
        });
    }, 0);
};


    const tableProperties = [
        { name: "lotCode", tag: "Código" },
        { name: "productName", tag: "Producto" },
        { name: "quantity", tag: "Cantidad" },
        { name: "price", tag: "Precio Unit." },
        { name: "subtotal", tag: "Subtotal" },
        { name: "actions", tag: "Acciones" },
    ];

    const tableRecords = items.map(item => ({
        id: item.id,
        lotCode: item.lot.code,
        productName: item.lot.product?.name || "",
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
    }));

    return (
        <AuthenticatedLayout title={title}>
            <Head title={title} />

            {toast && (
                <Toast key={toastKey} message={toast.message} type={toast.type} />
            )}

            <Loading isLoading={processing} />

            <form
                className="flex flex-col gap-6 pb-16 justify-self-center rounded-2xl max-sm:w-full max-sm:max-w-[448px] sm:w-[75%] sm:max-w-[612px]"
                onSubmit={submit}
            >
                <div className="flex flex-col gap-4">
                    <ComboBox
                        id="lot"
                        label="Lote"
                        items={lots}
                        value={data.lot}
                        onChange={(value) => setData("lot", value)}
                        disabled={processing}
                        error={errors.lot}
                        itemToString={item => item ? item.name : ""}
                    />

                    <InputField
                        id="quantity"
                        label="Cantidad"
                        type="number"
                        min={1}
                        inputMode="numeric"
                        value={data.quantity}
                        onChange={(e) => setData("quantity", e.target.value)}
                        disabled={processing}
                        error={errors.quantity}
                    />

                    <button
                        type="button"
                        onClick={addItem}
                        disabled={processing}
                        className="self-start px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        Agregar producto
                    </button>

                    <ComboBox
                        id="customer"
                        label="Cliente"
                        items={customers}
                        value={data.customer}
                        onChange={(value) => setData("customer", value)}
                        disabled={processing || total <= 700}
                        error={errors.customer}
                        itemToString={item => item?.name || ""}
                    />
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

                <PrimaryButton disabled={processing} className="mt-6">
                    Registrar venta
                </PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
