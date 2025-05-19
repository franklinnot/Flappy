import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    const title = 'Dashboard';
    return (
        <AuthenticatedLayout title={title}>
            <Head title={title} />
            <p>Yupi yupiii!!!</p>
        </AuthenticatedLayout>
    );
}
