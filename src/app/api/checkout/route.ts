import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectMongo from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import User from '@/models/User';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectMongo();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const cart = await Cart.findOne({ userId: user._id }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        let subtotal = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const orderItems = cart.items.map((item: any) => {
            const price = item.productId.price || 0;
            subtotal += price * item.quantity;
            return {
                product: item.productId._id,
                quantity: item.quantity,
                priceAtPurchase: price,
            };
        });

        const tax = subtotal * 0.10;
        const grandTotal = subtotal + tax;
        const amountInPaise = Math.round(grandTotal * 100);

        // Create internal Order
        const order = await Order.create({
            user: user._id,
            items: orderItems,
            totalAmount: grandTotal,
            status: 'Pending',
        });

        // Initialize Razorpay Order
        const rzpOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: order._id.toString()
        });

        // Attach Razorpay ID to our internal order
        order.razorpay_order_id = rzpOrder.id;
        await order.save();

        // Note: We DO NOT clear the cart here. We only clear it when the payment is verified.

        return NextResponse.json({ 
            success: true, 
            orderId: order._id,
            razorpayOrderId: rzpOrder.id,
            amount: amountInPaise,
            currency: 'INR',
            key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
        }, { status: 201 });

    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Failed to process checkout' }, { status: 500 });
    }
}
