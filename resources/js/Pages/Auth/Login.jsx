import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputField from '@/Components/InputField'; // Updated import
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        dni: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            <form className='flex flex-col gap-6' onSubmit={submit}>
                <InputField
                    id="dni"
                    type="text"
                    label="DNI"
                    value={data.dni}
                    autoComplete="username"
                    isFocused={true}
                    onChange={(e) => setData("dni", e.target.value)}
                    error={errors.dni}
                />

                <InputField
                    id="password"
                    type="password"
                    label="Contraseña"
                    value={data.password}
                    autoComplete="current-password"
                    onChange={(e) => setData("password", e.target.value)}
                    error={errors.password}
                />

                <div>
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Recuérdame
                        </span>
                    </label>
                </div>

                <PrimaryButton disabled={processing}>
                    Iniciar sesión
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
