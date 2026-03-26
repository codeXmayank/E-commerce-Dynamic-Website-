import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import mongoose from 'mongoose';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const wishlist = await Wishlist.findOne({ userId: session.user.id }).populate('products');
        return NextResponse.json(wishlist || { products: [] });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { productId } = await request.json();
        if (!productId) return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });

        await dbConnect();
        let wishlist = await Wishlist.findOne({ userId: session.user.id });
        if (!wishlist) wishlist = await Wishlist.create({ userId: session.user.id, products: [] });

        const productIdObj = new mongoose.Types.ObjectId(productId);
        
        // Ensure no duplicates
        const exists = wishlist.products.some((id: any) => id.equals(productIdObj));
        if (!exists) {
            wishlist.products.push(productIdObj);
            await wishlist.save();
        }
        
        await wishlist.populate('products');
        return NextResponse.json(wishlist);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

        await dbConnect();
        const wishlist = await Wishlist.findOne({ userId: session.user.id });
        if (!wishlist) return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 });

        const productIdObj = new mongoose.Types.ObjectId(productId);
        wishlist.products = wishlist.products.filter((id: any) => !id.equals(productIdObj));
        await wishlist.save();
        
        await wishlist.populate('products');
        return NextResponse.json(wishlist);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
    }
}
