'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface CartContextType {
    cartCount: number;
    refreshCart: () => void;
}

const CartContext = createContext<CartContextType>({
    cartCount: 0,
    refreshCart: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartCount, setCartCount] = useState(0);
    const { status } = useSession();

    const refreshCart = async () => {
        if (status === 'authenticated') {
            try {
                const res = await fetch('/api/cart');
                if (res.ok) {
                    const cart = await res.json();
                    const count = cart.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0;
                    setCartCount(count);
                }
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            }
        } else if (status === 'unauthenticated') {
            setCartCount(0);
        }
    };

    useEffect(() => {
        refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    return (
        <CartContext.Provider value={{ cartCount, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
