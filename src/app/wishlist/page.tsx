'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Heart, Star, Loader2, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';

interface Product {
    _id: string;
    name: string;
    price: number;
    image?: string;
    brand?: string;
}

export default function WishlistPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { refreshCart } = useCart();
    
    const [products, setProducts] = useState<Product[]>([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    const fetchWishlist = () => {
        fetch('/api/wishlist')
            .then(res => res.json())
            .then(data => {
                 setProducts(data.products || []);
            })
            .catch(() => toast.error('Failed to load wishlist'))
            .finally(() => setFetching(false));
    }

    useEffect(() => {
        if (session) {
            fetchWishlist();
        }
    }, [session]);

    const removeFromWishlist = async (productId: string, e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/wishlist?productId=${productId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success('Removed from wishlist');
                fetchWishlist();
            }
        } catch {
            toast.error('Failed to remove item');
        }
    }

    const addToCart = async (productId: string, e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: 1 }),
            });
            if (res.ok) {
                toast.success('Added to cart');
                refreshCart();
            } else {
                toast.error('Failed to add to cart');
            }
        } catch {
            toast.error('Failed to add to cart');
        }
    };

    if (status === 'loading' || fetching) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-[#5044e4]" />
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
            <h2 className="text-[22px] font-bold flex items-center mb-10 text-gray-900 border-b pb-4">
                Wishlist 
                <ChevronRight className="w-5 h-5 ml-2 text-gray-400" />
            </h2>

            {products.length === 0 ? (
                <div className="text-center py-24 bg-gray-50 rounded-2xl border border-gray-100">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">Your wishlist is empty</h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">Save items you like here to view them later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {products.map((product) => (
                        <Link href={`/product/${product._id}`} key={product._id} className="group block">
                            {/* Image Container */}
                            <div className="relative aspect-[4/5] bg-[#f5f6f8] rounded-2xl overflow-hidden mb-4 transition-all duration-300 hover:shadow-lg">
                                {product.image ? (
                                    <div className="w-full h-full p-4 flex items-center justify-center">
                                        <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                                
                                {/* Hover Add to Cart Icon Box */}
                                <div className="absolute top-4 right-4 bg-black/40 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer hover:bg-black/60" onClick={(e) => addToCart(product._id, e)}>
                                    <ShoppingCart className="w-4 h-4 text-white" />
                                </div>

                                {/* Absolute Circle Heart */}
                                <button 
                                    className="absolute bottom-3 right-3 w-10 h-10 bg-[#5044e4] rounded-full flex items-center justify-center shadow-lg z-20 hover:scale-110 transition-transform"
                                    onClick={(e) => removeFromWishlist(product._id, e)}
                                    title="Remove from Wishlist"
                                >
                                    <Heart className="w-4 h-4 text-white fill-current" />
                                </button>

                                {/* Quick View Bar */}
                                <div className="absolute bottom-4 left-4 right-16 bg-black/30 backdrop-blur-md text-white text-sm font-semibold py-2.5 rounded-full text-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                    Quick View
                                </div>
                            </div>

                            {/* Text Detail */}
                            <div>
                                <p className="text-gray-400 text-[13px] mb-1">{product.brand || 'Brand Name'}</p>
                                <h3 className="text-gray-900 font-bold text-[15px] mb-1 leading-snug truncate group-hover:underline">{product.name}</h3>
                                <div className="flex items-center text-sm mb-1.5">
                                    <div className="flex text-gray-900 gap-0.5">
                                        {[1,2,3,4,5].map(i => (
                                            <Star key={i} className={`w-3.5 h-3.5 ${i <= 4 ? 'fill-current' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-gray-700 font-medium text-[13px]">4.2 (12)</span>
                                </div>
                                <p className="text-gray-900 font-bold text-base mt-2">${product.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
