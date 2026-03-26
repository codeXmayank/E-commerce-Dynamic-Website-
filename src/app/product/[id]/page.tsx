'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductReviews from '@/components/ProductReviews';

interface Product {
    _id: string;
    name: string;
    price: number;
    image?: string;
    description?: string;
    category?: string;
    rating?: {
        stars: number;
        count: number;
    };
}

export default function ProductDetail() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const { refreshCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch('/api/products');
                if (!res.ok) {
                    throw new Error('Failed to fetch products');
                }
                const products: Product[] = await res.json();
                const foundProduct = products.find(p => p._id === params.id);

                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    toast.error('Product not found');
                    router.push('/');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Failed to load product');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id, router]);

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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Product not found</p>
                    <Link href="/" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                        Go back to home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Image */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        {product.image ? (
                            <div className="relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full max-h-96 object-contain rounded-lg mx-auto cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => setImageModalOpen(true)}
                                />
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                    Click to enlarge
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-96 bg-gray-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-400">No image available</span>
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <h1 className="text-3xl font-bold mb-4 dark:text-white">{product.name}</h1>

                        {/* Rating */}
                        {product.rating && (
                            <div className="flex items-center mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            className={`${i < Math.floor(product.rating!.stars)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="ml-2 text-gray-600 dark:text-gray-400">
                                    {product.rating.stars} ({product.rating.count} reviews)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                            ${product.price}
                        </p>

                        {/* Category */}
                        <div className="mb-4">
                            {product.category && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-semibold">Category:</span> {product.category}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2 dark:text-white">Description</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                            onClick={() => addToCart(product._id)}
                            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center"
                        >
                            <ShoppingCart size={20} className="mr-2" />
                            Add to Cart
                        </button>
                    </div>
                </div>

                {/* Product Reviews Section */}
                <ProductReviews />
            </div>
        </div>
    );
}