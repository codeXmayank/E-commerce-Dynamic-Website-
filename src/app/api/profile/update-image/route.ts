import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { image } = await request.json();

        if (!image) {
            return NextResponse.json({ message: 'No image provided' }, { status: 400 });
        }

        // Extremely basic size limit check (approx 2MB for base64)
        if (image.length > 3000000) {
             return NextResponse.json({ message: 'Image size too large. Please upload an image under 2MB.' }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { image },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Profile picture updated', image: user.image }, { status: 200 });
    } catch (error) {
        console.error('Update image error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
