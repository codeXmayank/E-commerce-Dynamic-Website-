'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/lib/ThemeContext';
import { CartProvider } from '@/context/CartContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <SessionProvider>
                <CartProvider>
                    {children}
                    <Toaster />
                </CartProvider>
            </SessionProvider>
        </ThemeProvider>
    );
}