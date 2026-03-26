'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Something went wrong');
            } else {
                setSubmitted(true);
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden">
                <div className="p-8 md:p-10">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-rose-50 rounded-full">
                            <Mail className="text-rose-500" size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
                            <p className="text-sm text-slate-500">We'll send you a reset link</p>
                        </div>
                    </div>

                    {submitted ? (
                        /* Success state */
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Check your inbox</h2>
                            <p className="text-slate-500 text-sm mb-6">
                                If <span className="font-medium text-gray-800">{email}</span> is registered, you'll receive a reset link shortly. Check your spam folder too.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700"
                            >
                                <ArrowLeft size={16} />
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        /* Form state */
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <p className="text-sm text-slate-500 -mt-2">
                                Enter the email address associated with your account and we'll send you a link to reset your password.
                            </p>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-rose-500 text-white font-semibold py-2.5 rounded-lg hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Sending…' : 'Send Reset Link'}
                            </button>

                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700"
                            >
                                <ArrowLeft size={15} />
                                Back to Login
                            </Link>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
