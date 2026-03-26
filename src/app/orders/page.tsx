'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plane, FileQuestion, Truck, ArrowLeftRight, ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderItem {
    _id: string;
    product: {
        _id: string;
        name: string;
        price: number;
        image?: string;
        category?: string;
    };
    quantity: number;
    priceAtPurchase: number;
}

interface Order {
    _id: string;
    totalAmount: number;
    status: string;
    razorpay_payment_id?: string;
    createdAt: string;
    items: OrderItem[];
}

export default function OrderPage() {
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (sessionStatus === 'unauthenticated') {
            router.push('/login');
        }
    }, [sessionStatus, router]);

    useEffect(() => {
        if (session) {
            fetch('/api/orders')
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setOrders(data);
                    else toast.error(data.error || 'Failed to fetch orders');
                })
                .catch(() => toast.error('Error fetching orders'))
                .finally(() => setFetching(false));
        }
    }, [session]);

    if (sessionStatus === 'loading' || fetching) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-white font-sans pb-24 text-left">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
                
                <Link href="/profile" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Profile
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Your Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Truck className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven&apos;t placed any orders. Start exploring our collections!</p>
                        <Link href="/">
                            <span className="inline-flex items-center justify-center bg-black text-white px-8 py-3.5 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                                Start Shopping
                            </span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {orders.map((order) => {
                            const orderDate = new Date(order.createdAt);
                            const deliveryDate = new Date(order.createdAt);
                            deliveryDate.setDate(deliveryDate.getDate() + 5);

                            return (
                                <div key={order._id} className="bg-white border text-left border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    {/* Order Header */}
                                    <div className="bg-gray-50 border-b border-gray-200 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Order Placed</p>
                                            <p className="text-sm font-bold text-gray-900">{orderDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total</p>
                                            <p className="text-sm font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                                        </div>
                                        <div className="md:text-right">
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Order #</p>
                                            <p className="text-sm font-bold text-gray-900">{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Status / Payment Confirmation */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
                                            <div className="flex items-center gap-3">
                                                {order.status === 'Processing' || order.status === 'Paid' ? (
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                        <div className="flex items-center text-green-700 font-bold bg-green-50 px-3 py-1.5 rounded-md text-sm border border-green-100">
                                                            <CheckCircle2 className="w-5 h-5 mr-2" />
                                                            Payment Confirmed
                                                        </div>
                                                        {order.razorpay_payment_id && (
                                                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-sm">Ref ID: {order.razorpay_payment_id}</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-amber-700 font-bold bg-amber-50 px-3 py-1.5 rounded-md text-sm border border-amber-100">
                                                        Status: {order.status}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center text-gray-600 font-bold text-sm bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                                                <Plane className="w-4 h-4 mr-2 text-blue-500" /> 
                                                Est. Delivery: {deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="space-y-6">
                                            {order.items.map((item) => (
                                                <div key={item._id} className="flex gap-5 items-start">
                                                    <div className="w-24 h-24 bg-[#f4f4f5] rounded-xl flex items-center justify-center flex-shrink-0 p-2 border border-gray-200">
                                                        {item.product?.image ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={item.product.image} alt={item.product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                                        ) : (
                                                            <div className="text-xs text-gray-400">No Image</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pt-1">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                                            <div>
                                                                <Link href={`/product/${item.product?._id}`} className="text-[17px] font-bold text-gray-900 hover:text-blue-600 transition-colors mb-1 block">
                                                                    {item.product?.name || 'Unknown Product'}
                                                                </Link>
                                                                {item.product?.category && <p className="text-[13px] text-[#F16521] font-bold tracking-wide">{item.product.category}</p>}
                                                            </div>
                                                            <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start">
                                                                <p className="text-[16px] font-extrabold text-gray-900 sm:mb-1">${item.priceAtPurchase.toFixed(2)}</p>
                                                                <p className="text-[13px] text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-sm">Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* Help Links Footer */}
                        <div className="border border-gray-200 rounded-xl mt-12 overflow-hidden shadow-sm">
                            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                                <h3 className="text-[16px] font-bold text-gray-900">Need help with your orders?</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Link href="#" className="flex items-center text-[15px] text-gray-600 font-bold hover:text-blue-600 transition-colors group">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                                        <FileQuestion className="w-5 h-5 text-blue-600" />
                                    </div>
                                    Order Issues
                                </Link>
                                <Link href="#" className="flex items-center text-[15px] text-gray-600 font-bold hover:text-blue-600 transition-colors group">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                                        <Truck className="w-5 h-5 text-blue-600" />
                                    </div>
                                    Delivery Info
                                </Link>
                                <Link href="#" className="flex items-center text-[15px] text-gray-600 font-bold hover:text-blue-600 transition-colors group">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                                        <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                                    </div>
                                    Returns
                                </Link>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
