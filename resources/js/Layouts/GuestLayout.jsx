import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function Guest({ children }) {
    return (
        <div className="min-h-dvh flex justify-center items-center pb-8 px-10 bg-indigo-50 bg-gradient-to-tr from-[#D3E0FF] to-[#FFFFFF]">
            <div className="w-full py-14 sm:py-16 md:py-20 lt:max-w-screen-lt flex flex-col justify-center items-center gap-8 bg-white shadow-md rounded-2xl">
                <Link href="/">
                    <ApplicationLogo className="size-20" />
                </Link>
                <div className="w-full px-6 sm:px-7 md:px-8">{children}</div>
            </div>
        </div>
    );
}
