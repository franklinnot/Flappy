import Header from "@/Layouts/Partials/Header";
import { usePage } from "@inertiajs/react";

export default function Authenticated({ children, title = null }) {
    const user = usePage().props?.auth?.user;
    return (
        <div className="min-h-dvh grid grid-rows-[auto_1fr] bg-white">
            <Header user={user} title={title}></Header>
            <main className="p-4 pb-0">{children}</main>
        </div>
    );
}
