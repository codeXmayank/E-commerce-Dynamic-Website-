'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Eye, EyeOff, KeyRound } from 'lucide-react';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token') || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [invalidToken, setInvalidToken] = useState(false);

    useEffect(() => {
        if (!token) {
            setInvalidToken(true);
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 400) {
                    setInvalidToken(true);
                }
                toast.error(data.error || 'Something went wrong');
            } else {
                toast.success('Password reset successfully!');
                setTimeout(() => router.push('/login'), 1500);
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (invalidToken) {
        return (
            <div className="text-center py-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Link Invalid or Expired</h2>
                <p className="text-slate-500 text-sm mb-6">
                    This password reset link is invalid or has expired. Reset links are only valid for 1 hour.
                </p>
                <Link
                    href="/forgot-password"
                    className="inline-block bg-rose-500 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-rose-600 transition-colors text-sm"
                >
                    Request a New Link
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-sm text-slate-500 -mt-2">
                Choose a strong password that you don't use elsewhere.
            </p>

            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">New Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                        required
                        minLength={6}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Confirm Password</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your new password"
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
                {loading ? 'Resetting…' : 'Reset Password'}
            </button>
        </form>
    );
}

export default function ResetPassword() {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden">
                <div className="p-8 md:p-10">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-rose-50 rounded-full">
                            <KeyRound className="text-rose-500" size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
                            <p className="text-sm text-slate-500">Secure your account</p>
                        </div>
                    </div>

                    <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
