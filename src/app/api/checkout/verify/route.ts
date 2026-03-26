import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectMongo from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
            return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
        }

        // Verify Signature
        const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ error: 'Invalid Payment Signature' }, { status: 400 });
        }

        await connectMongo();

        // Find internal order
        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Mark order as paid
        order.status = 'Processing'; // or Paid
        order.razorpay_payment_id = razorpay_payment_id;
        order.razorpay_signature = razorpay_signature;
        await order.save();

        // Clear the user's cart
        const user = await User.findOne({ email: session.user.email });
        if (user) {
            const cart = await Cart.findOne({ userId: user._id });
            if (cart) {
                cart.items = [];
                await cart.save();
            }
        }

        return NextResponse.json({ success: true, message: 'Payment verified successfully' }, { status: 200 });

    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
    }
}
