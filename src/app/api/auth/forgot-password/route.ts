import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendResetEmail } from '@/lib/mailer';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        // Always return 200 — never reveal whether the email exists
        if (!user) {
            return NextResponse.json({ message: 'If that email is registered, a reset link has been sent.' });
        }

        // Generate a signed JWT token (1 hour expiry)
        const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '1h' });

        // Store a hash of the token (never store raw tokens)
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        user.resetPasswordToken = tokenHash;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        // Send the reset email
        await sendResetEmail(user.email, token);

        return NextResponse.json({ message: 'If that email is registered, a reset link has been sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
}
