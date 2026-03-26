import nodemailer from 'nodemailer';
import dns from 'dns/promises';

/**
 * Sends a password-reset email via Gmail SMTP.
 *
 * Reads from .env.local:
 *   EMAIL_FROM     — Gmail address (e.g. you@gmail.com)
 *   EMAIL_PASSWORD — Gmail App Password (16-char)
 *   NEXTAUTH_URL   — Base URL (e.g. http://localhost:3000)
 *
 * Resolves smtp.gmail.com to an IPv4 address before connecting so
 * nodemailer never attempts an IPv6 socket (which most ISPs block).
 */
export async function sendResetEmail(to: string, token: string) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Resolve smtp.gmail.com → IPv4 ourselves.
    // Passing a raw IP as `host` forces nodemailer to connect via IPv4,
    // bypassing the OS DNS resolver that would otherwise return an IPv6 address.
    const [smtpIp] = await dns.resolve4('smtp.gmail.com');

    const transporter = nodemailer.createTransport({
        host: smtpIp,          // e.g. "142.250.x.x" — IPv4 direct
        port: 587,
        secure: false,         // STARTTLS
        tls: {
            servername: 'smtp.gmail.com', // SNI must still match the cert CN
        },
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: `"Mayank's Shop" <${process.env.EMAIL_FROM}>`,
        to,
        subject: 'Reset your Mayank\'s Shop password',
        html: `
        <div style="font-family:sans-serif;max-width:500px;margin:auto;
                    padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
            <h2 style="color:#111827;margin-bottom:8px;">Reset your password</h2>
            <p style="color:#6b7280;margin-bottom:24px;">
                We received a request to reset the password for your account.
                Click the button below — this link expires in <strong>1 hour</strong>.
            </p>
            <a href="${resetUrl}"
               style="display:inline-block;background:#ef4444;color:#fff;
                      text-decoration:none;padding:12px 28px;
                      border-radius:8px;font-weight:600;">
                Reset Password
            </a>
            <p style="font-size:12px;color:#9ca3af;margin-top:24px;">
                If you didn't request this, you can safely ignore this email.
            </p>
        </div>`,
    });
}
