import Roles from "./roles";

/* 
System navigation

With subroutes:
{
    title: "", 
    subRoutes: [
        {title: "", route: ""},
        ...
    ]
}

Without subroutes:
{
    title: "", 
    route: "",
    subRoutes: [],
}

The sentence "for_seller: true" means that 
the seller will have access
*/

const routes = [
    { title: "Dashboard", route: "dashboard", subRoutes: [] },
    {
        title: "Usuarios",
        subRoutes: [
            { title: "Nuevo Usuario", route: "users.new" },
            { title: "Listar Usuarios", route: "users" },
        ],
    },
    {
        title: "Clientes",
        subRoutes: [
            { title: "Nuevo Cliente", route: "customers.new" },
            { title: "Listar Clientes", route: "customers" },
        ],
        for_seller: true,
    },
    {
        title: "Proveedores",
        subRoutes: [
            { title: "Nuevo Proveedor", route: "suppliers.new" },
            { title: "Listar Proveedores", route: "suppliers" },
        ],
    },
    {
        title: "Métodos de Pago",
        subRoutes: [
            { title: "Nuevo Método de Pago", route: "payments.new" },
            { title: "Listar Métodos de Pago", route: "payments" },
        ],
    },
    {
        title: "Unidades de Medida",
        subRoutes: [
            { title: "Nueva Unidad de Medida", route: "units.new" },
            { title: "Listar Unidades de Medida", route: "units" },
        ],
    },
    {
        title: "Categorías",
        subRoutes: [
            { title: "Nueva Categoría", route: "categories.new" },
            { title: "Listar Categorías", route: "categories" },
        ],
    },
    {
        title: "Productos",
        subRoutes: [
            { title: "Nuevo Producto", route: "products.new" },
            { title: "Listar Productos", route: "products" },
        ],
    },
    {
        title: "Lotes",
        subRoutes: [
            { title: "Nuevo Lote", route: "lots.new" },
            { title: "Listar Lotes", route: "lots" },
        ],
    },
    {
        title: "Operaciones",
        subRoutes: [
            { title: "Nueva Operación", route: "operations.new" },
            { title: "Listar Operaciones", route: "operations" },
        ],
    },
    {
        title: "Ventas",
        subRoutes: [
            { title: "Nueva Venta", route: "sales.new" },
            { title: "Listar Ventas", route: "sales" },
        ],
        for_seller: true,
    },
];

export default function getRoutes(rol){
    if(rol == Roles.SELLER){
        return routes.filter(r => r.for_seller);
    }
    return routes;
}
