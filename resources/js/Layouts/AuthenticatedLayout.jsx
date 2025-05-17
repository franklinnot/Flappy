import Header from "@/Layouts/Partials/Header";
import { usePage } from "@inertiajs/react";

export default function Authenticated({ children }) {
    const user = usePage().props?.auth?.user;
    return (
        <div className="min-h-dvh placeholder:grid grid-rows-[auto_1fr] bg-white">
            <Header user={user}></Header>
            <main className="p-4">{children}</main>
        </div>
    );
}
