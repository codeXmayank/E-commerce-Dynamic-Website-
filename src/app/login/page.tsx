'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // First validate credentials with our custom endpoint for specific error messages
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            toast.error(data.error);
            return;
        }

        // If validation passes, sign in with NextAuth
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.ok) {
            toast.success('Logged in successfully');
            router.push('/');
        } else {
            toast.error('An error occurred during login');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white shadow-xl rounded-xl overflow-hidden">
                <div className="p-8 md:p-12">
                    <h1 className="text-3xl font-bold mb-2">Welcome</h1>
                    <p className="text-slate-500 mb-8">Get started for a seamless shopping experience</p>

                    <div className="space-y-3 mb-6">
                        <button
                            type="button"
                            onClick={() => signIn('google', { redirect: false })}
                            className="w-full flex items-center justify-center border border-slate-200 rounded-lg py-2 text-sm font-semibold hover:bg-slate-50">
                            <span className="mr-2">G</span> Continue with Google
                        </button>
                        <button
                            type="button"
                            onClick={() => signIn('facebook', { redirect: false })}
                            className="w-full flex items-center justify-center border border-slate-200 rounded-lg py-2 text-sm font-semibold hover:bg-slate-50">
                            <span className="mr-2">f</span> Continue with Facebook
                        </button>
                    </div>

                    <div className="flex items-center justify-center text-sm text-slate-400 gap-2 mb-6">
                        <span className="h-px w-14 bg-slate-200" />
                        OR
                        <span className="h-px w-14 bg-slate-200" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between text-sm text-slate-500">
                            <Link href="/forgot-password" className="hover:text-blue-600">Forgot password?</Link>
                        </div>

                        <button type="submit" className="w-full bg-rose-500 text-white font-semibold py-2 rounded-lg hover:bg-rose-600">Login</button>

                        <p className="text-center text-sm text-slate-500">
                            Don't have an account? <Link href="/signup" className="text-blue-600 font-medium">Register</Link>
                        </p>
                    </form>
                </div>

                <div className="bg-slate-50 p-8 md:p-12 flex flex-col justify-center">
                    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-3">Start Shopping Today</h2>
                        <p className="text-slate-500">Get personalized shopping and customization experience on our store when you sign in to your account.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}