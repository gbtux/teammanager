import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import Routing from "@toyokumo/fos-router";
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import {Checkbox} from "@/components/ui/checkbox";
import routes from '@/fos_routes';
Routing.setRoutingData(routes)

type RegisterForm = {
    name: string;
    email: string;
    agreeTerms: boolean;
    plainPassword: {
        first: string;
        second: string;
    };
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        agreeTerms: false,
        plainPassword: {
            first: '',
            second: '',
        },
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(Routing.generate('app_register'), {
            onFinish: () => reset('plainPassword.first', 'plainPassword.second'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.plainPassword.first}
                            onChange={(e) => setData('plainPassword', {...data.plainPassword, first: e.target.value})}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors["plainPassword.first"]} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.plainPassword.second}
                            onChange={(e) => setData('plainPassword', {...data.plainPassword, second: e.target.value})}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors["plainPassword.second"]} />
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="terms"
                            checked={data.agreeTerms}
                            onCheckedChange={(checked: boolean) => {
                                setData('agreeTerms', checked);
                            }}
                        />
                        <Label htmlFor="terms">Accept terms and conditions</Label>
                    </div>
                    {errors.agreeTerms && <p className="text-sm text-red-500">{errors.agreeTerms}</p>}

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={Routing.generate('app_login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
