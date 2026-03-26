import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import mongoose from 'mongoose';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const cart = await Cart.findOne({ userId: session.user.id }).populate('items.productId');
        return NextResponse.json(cart || { items: [] });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, quantity } = await request.json();
        
        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return NextResponse.json({ error: 'Invalid Product ID format' }, { status: 400 });
        }

        await dbConnect();

        let cart = await Cart.findOne({ userId: session.user.id });
        if (!cart) {
            cart = await Cart.create({ userId: session.user.id, items: [] });
        }

        const productIdObj = new mongoose.Types.ObjectId(productId);
        const existingItem = cart.items.find((item: any) => item.productId.equals(productIdObj));
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId: productIdObj, quantity });
        }

        await cart.save();
        await cart.populate('items.productId');
        return NextResponse.json(cart);
    } catch (error: any) {
        console.error('Cart Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to add to cart' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, quantity } = await request.json();
        if (!productId || typeof quantity !== 'number') {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return NextResponse.json({ error: 'Invalid Product ID format' }, { status: 400 });
        }

        await dbConnect();
        const cart = await Cart.findOne({ userId: session.user.id });
        if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

        const productIdObj = new mongoose.Types.ObjectId(productId);
        const existingItem = cart.items.find((item: any) => item.productId.equals(productIdObj));
        
        if (existingItem) {
            existingItem.quantity = quantity;
            if (existingItem.quantity <= 0) {
                cart.items = cart.items.filter((item: any) => !item.productId.equals(productIdObj));
            }
        }

        await cart.save();
        await cart.populate('items.productId');
        return NextResponse.json(cart);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return NextResponse.json({ error: 'Invalid Product ID format' }, { status: 400 });
        }

        await dbConnect();
        const cart = await Cart.findOne({ userId: session.user.id });
        if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

        const productIdObj = new mongoose.Types.ObjectId(productId);
        cart.items = cart.items.filter((item: any) => !item.productId.equals(productIdObj));

        await cart.save();
        await cart.populate('items.productId');
        return NextResponse.json(cart);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}