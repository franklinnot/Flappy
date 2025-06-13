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
            { title: "Nuevo usuario", route: "users.new" },
            { title: "Listar usuarios", route: "users" },
        ],
    },
    {
        title: "Clientes",
        subRoutes: [
            { title: "Nuevo cliente", route: "customers.new" },
            { title: "Listar clientes", route: "customers" },
        ],
        for_seller: true,
    },
    {
        title: "Proveedores",
        subRoutes: [
            { title: "Nuevo proveedor", route: "suppliers.new" },
            { title: "Listar proveedores", route: "suppliers" },
        ],
    },
    {
        title: "Métodos de pago",
        subRoutes: [
            { title: "Nuevo método", route: "payments.new" },
            { title: "Listar métodos", route: "payments" },
        ],
    },
    {
        title: "Unidades de medida",
        subRoutes: [
            { title: "Nueva unidad", route: "units.new" },
            { title: "Listar unidades", route: "units" },
        ],
    },
    {
        title: "Categorías",
        subRoutes: [
            { title: "Nueva categoría", route: "categories.new" },
            { title: "Listar categorías", route: "categories" },
        ],
    },
    {
        title: "Productos",
        subRoutes: [
            { title: "Nuevo producto", route: "products.new" },
            { title: "Listar productos", route: "products" },
        ],
    },
    {
        title: "Lotes",
        subRoutes: [
            { title: "Nuevo lote", route: "lots.new" },
            { title: "Listar lotes", route: "lots" },
        ],
    },
    {
        title: "Operaciones",
        subRoutes: [
            { title: "Nueva operación", route: "operations.new" },
            { title: "Listar operaciones", route: "operations" },
        ],
    },
    {
        title: "Ventas",
        subRoutes: [
            { title: "Nueva venta", route: "sales.new" },
            { title: "Listar ventas", route: "sales" },
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
