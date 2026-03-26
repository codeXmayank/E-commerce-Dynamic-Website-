'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';

interface Product {
    _id: string;
    name: string;
    price: number;
    image?: string;
    description?: string;
    category?: string;
}

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const { refreshCart } = useCart();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                if (!res.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error('Products response is not an array:', data);
                    setProducts([]);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Failed to load products');
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);

    const addToCart = async (productId: string) => {
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: 1 }),
            });
            if (res.ok) {
                toast.success('Added to cart');
                refreshCart();
            } else if (res.status === 401) {
                toast.error('Please login first to add items to cart');
            } else {
                toast.error('Failed to add to cart');
            }
        } catch {
            toast.error('Failed to add to cart');
        }
    };

    const addToWishlist = async (productId: string) => {
        try {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });
            if (res.ok) {
                toast.success('Moved to wishlist');
            } else {
                toast.error('Failed to move to wishlist');
            }
        } catch {
            toast.error('Failed to move to wishlist');
        }
    };

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
    
    // Filter by both category AND search query
    const displayedProducts = products.filter(p => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch = !searchQuery || 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="products">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold dark:text-white">Products</h2>
                
                {categories.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {categories.map((category) => (
                            <button
                                key={category as string}
                                onClick={() => setSelectedCategory(category as string)}
                                className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-shadow transition-colors ${
                                    selectedCategory === category
                                        ? 'bg-[#ee5f73] text-white shadow-md'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-[#ee5f73] dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300'
                                }`}
                            >
                                {category as string}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {displayedProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No products found matching your criteria.</p>
                    {(searchQuery || selectedCategory !== 'All') && (
                        <button 
                            onClick={() => {
                                setSelectedCategory('All');
                                if (searchQuery) window.location.href = '/#products';
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {displayedProducts.map((product) => (
                        <Link key={product._id} href={`/product/${product._id}`} className="block">
                            <div className="bg-white border border-gray-100 dark:bg-slate-800 dark:border-slate-700 rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full">
                                {product.image && (
                                    <div className="w-full h-64 mb-6 flex items-center justify-center bg-white rounded overflow-hidden">
                                        <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                                    </div>
                                )}
                                <h3 className="text-md font-bold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">{product.description}</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white mb-5">${product.price}</p>
                                
                                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            addToCart(product._id);
                                        }}
                                        className="flex-1 bg-blue-500 text-white px-4 py-2.5 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 font-medium text-sm transition-colors text-center"
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            addToWishlist(product._id);
                                        }}
                                        className="flex-1 border border-gray-200 text-gray-700 dark:border-slate-600 dark:text-gray-300 px-4 py-2.5 rounded hover:bg-gray-50 dark:hover:bg-slate-700 font-medium text-sm transition-colors text-center"
                                    >
                                        Move to Wishlist
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}