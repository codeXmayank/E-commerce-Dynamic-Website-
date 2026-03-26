import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const deletedUser = await User.findOneAndDelete({ email: session.user.email });

        if (!deletedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Account successfully deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting account:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
