'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { X, Minus, Plus, Truck, Loader2, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface CartItem {
    productId: {
        _id: string;
        name: string;
        price: number;
        image?: string;
        category?: string;
        description?: string;
    };
    quantity: number;
}

export default function Cart() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { refreshCart } = useCart();
    
    const [cart, setCart] = useState<{ items?: CartItem[], error?: string }>({ items: [] });
    const [updating, setUpdating] = useState<string | null>(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (session) {
            setFetching(true);
            fetch('/api/cart')
                .then(res => res.json())
                .then(data => setCart(data))
                .catch(() => toast.error('Failed to load cart'))
                .finally(() => setFetching(false));
        }
    }, [session]);

    const updateQuantity = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return; // Minimum 1 logic
        setUpdating(productId);
        try {
            const res = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: newQuantity })
            });

            if (res.ok) {
                const data = await res.json();
                setCart(data);
                refreshCart();
            } else {
                toast.error('Failed to update quantity');
            }
        } catch {
            toast.error('Error updating cart');
        } finally {
            setUpdating(null);
        }
    };

    const removeItem = async (productId: string) => {
        setUpdating(productId);
        try {
            const res = await fetch(`/api/cart?productId=${productId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                const data = await res.json();
                setCart(data);
                refreshCart();
                toast.success('Item removed');
            } else {
                toast.error('Failed to remove item');
            }
        } catch {
            toast.error('Error removing item');
        } finally {
            setUpdating(null);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckout = async () => {
        setUpdating('checkout');
        try {
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error('Razorpay SDK failed to load');
                setUpdating(null);
                return;
            }

            const res = await fetch('/api/checkout', { method: 'POST' });
            const data = await res.json();
            
            if (!res.ok) {
                toast.error(data.error || 'Checkout initialization failed');
                setUpdating(null);
                return;
            }

            // Options for Razorpay Modal
            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "Mayank's Shop",
                description: "Test Purchase",
                order_id: data.razorpayOrderId,
                handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; }) {
                    try {
                        const verifyRes = await fetch('/api/checkout/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: data.orderId
                            })
                        });
                        const verifyData = await verifyRes.json();
                        
                        if (verifyRes.ok) {
                            toast.success('Order placed successfully!');
                            setCart({ items: [] });
                            refreshCart();
                            router.push('/orders');
                        } else {
                            toast.error(verifyData.error || 'Payment verification failed');
                        }
                    } catch {
                        toast.error('Payment verified but backend update failed');
                    }
                },
                prefill: {
                    name: session?.user?.name || "Customer",
                    email: session?.user?.email || "",
                },
                theme: {
                    color: "#000000"
                }
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const paymentObject = new (window as any).Razorpay(options);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            paymentObject.on('payment.failed', function (response: any) {
                toast.error(response.error.description || 'Payment Failed');
            });
            paymentObject.open();

        } catch (error) {
            console.error(error);
            toast.error('An error occurred during checkout');
        } finally {
            setUpdating(null);
        }
    };

    if (status === 'loading' || fetching) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!session) return null;

    const items = Array.isArray(cart?.items) ? cart.items : [];
    
    // Calculate Totals
    const subtotal = items.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0);
    const tax = subtotal * 0.10; // Placeholder 10% tax calculation
    const grandTotal = subtotal + tax;
    
    // Total Items
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 font-sans text-[#2B2B2B]">
            {items.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm mt-8">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Truck className="w-10 h-10 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added any premium gear to your cart yet.</p>
                    <Link href="/">
                        <span className="inline-flex items-center justify-center bg-black text-white px-8 py-3.5 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Continue Shopping
                        </span>
                    </Link>
                </div>
            ) : (
                <>
                    <h1 className="text-4xl font-extrabold text-center mb-16 text-[#333333]">
                        Your Cart ({totalItems} items)
                    </h1>

                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr] border-b border-gray-200 pb-3 mb-6 text-sm font-bold text-gray-800 px-4">
                        <div>Item</div>
                        <div className="text-center">Price</div>
                        <div className="text-center pl-4">Quantity</div>
                        <div className="text-right">Total</div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-6 md:space-y-0 relative">
                        {items.map((item) => {
                            const pPrice = item.productId?.price || 0;
                            const isUpdating = updating === item.productId?._id;

                            return (
                                <div 
                                    key={item.productId?._id} 
                                    className={`grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr_1fr] items-center py-8 border-b border-gray-100 gap-4 md:gap-0 px-4 transition-opacity ${isUpdating ? 'opacity-50' : 'opacity-100'}`}
                                >
                                    {/* Item Info */}
                                    <div className="flex gap-6 flex-col md:flex-row md:items-center">
                                        <div className="w-24 h-24 bg-white rounded-lg flex-shrink-0 flex items-center justify-center p-2 shadow-sm border border-gray-100 mx-auto md:mx-0">
                                            {item.productId?.image ? (
                                                <img src={item.productId.image} alt={item.productId.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                            ) : (
                                                <div className="text-xs text-gray-400">No Image</div>
                                            )}
                                        </div>
                                        <div className="text-center md:text-left">
                                            <h3 className="text-xl font-bold text-gray-900 leading-tight block">{item.productId?.name || 'Unknown Item'}</h3>
                                            
                                            {item.productId?.category && (
                                                <p className="text-[#F16521] font-bold text-sm mt-1.5 mb-1 tracking-wide">
                                                    (Category: {item.productId.category})
                                                </p>
                                            )}
                                            
                                            {item.productId?.description && (
                                                <p className="text-gray-500 text-xs mt-0.5 line-clamp-1 mb-2 max-w-xs mx-auto md:mx-0">{item.productId.description}</p>
                                            )}
                                            
                                            <Link href={`/product/${item.productId?._id || ''}`} className="text-xs text-[#F16521] transition-colors hover:border-[#F16521]">
                                                Change
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center text-sm font-medium text-gray-600 hidden md:block">
                                        ${pPrice.toFixed(2)}
                                    </div>

                                    {/* Quantity */}
                                    <div className="flex justify-center items-center py-4 md:py-0">
                                        <div className="flex items-center border border-gray-900 rounded-[4px] overflow-hidden bg-white h-10 w-28">
                                            <button 
                                                onClick={() => updateQuantity(item.productId._id, item.quantity - 1)} 
                                                disabled={isUpdating} 
                                                className="w-[30%] h-full flex items-center justify-center hover:bg-gray-100 border-r border-gray-900 transition-colors disabled:opacity-50"
                                            >
                                                <Minus className="w-4 h-4 text-black font-bold" />
                                            </button>
                                            <div className="w-[40%] h-full flex items-center justify-center text-sm font-bold text-black border-none">
                                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : item.quantity}
                                            </div>
                                            <button 
                                                onClick={() => updateQuantity(item.productId._id, item.quantity + 1)} 
                                                disabled={isUpdating} 
                                                className="w-[30%] h-full flex items-center justify-center hover:bg-gray-100 border-l border-gray-900 transition-colors disabled:opacity-50"
                                            >
                                                <Plus className="w-4 h-4 text-black font-bold" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="flex items-center justify-between md:justify-end font-bold text-gray-900 space-x-3 w-full border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                                        <div className="md:hidden flex flex-col items-start pr-4">
                                            <span className="text-gray-500 font-normal text-xs uppercase tracking-wider mb-1">Unit Price</span>
                                            <span className="text-sm">${pPrice.toFixed(2)}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-end space-x-3 gap-6">
                                           <div className="flex flex-col items-end">
                                               <span className="md:hidden text-gray-500 font-normal text-xs uppercase tracking-wider mb-1">Total</span>
                                               <span className="w-20 text-right text-lg md:text-md">${(pPrice * item.quantity).toFixed(2)}</span>
                                           </div>
                                            <button 
                                                onClick={() => removeItem(item.productId._id)} 
                                                disabled={isUpdating}
                                                title="Remove Item"
                                                className="w-6 h-6 bg-gray-200 hover:bg-red-500 text-gray-500 hover:text-white rounded-full flex items-center justify-center transition-colors group cursor-pointer"
                                            >
                                                <X className="w-3.5 h-3.5" strokeWidth={3} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Totals Section */}
                    <div className="flex flex-col items-end mt-12 px-4">
                        <div className="w-full md:w-[400px]">
                            <div className="space-y-5 text-sm mb-6 pb-2">
                                <div className="flex justify-between items-center text-gray-800 font-bold border-b border-gray-100 pb-5">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-800 font-bold border-b border-gray-100 pb-5">
                                    <span>Sales Tax:</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold border-b border-gray-100 pb-5">
                                    <span className="text-gray-800">Coupon Code:</span>
                                    <button className="text-gray-500 hover:text-gray-800 underline underline-offset-4 decoration-gray-300">Add Coupon</button>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-10 pt-2">
                                <span className="text-gray-800 font-bold mb-1 border-b border-gray-100">Grand total:</span>
                                <span className="text-4xl font-light text-gray-900 tracking-tight">${grandTotal.toFixed(2)}</span>
                            </div>

                            {/* Free Shipping Alert Area */}
                            <div className="mb-6 mb-8 mt-4">
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <span className="text-[13px] text-gray-800 font-medium tracking-wide">Congrats, you're eligible for <span className="font-extrabold pb-0.5 border-b-2 border-green-500">Free Shipping</span></span>
                                    <Truck className="w-5 h-5 text-gray-700" />
                                </div>
                                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="w-full h-full bg-[#41c552]"></div>
                                </div>
                            </div>

                            <button 
                                onClick={handleCheckout}
                                disabled={items.length === 0 || updating === 'checkout'}
                                className="w-full py-4 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors rounded-sm shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {updating === 'checkout' ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : 'Check out'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}