import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: String, default: 'user' },
    mobileNumber: { type: String, required: false },
    city: { type: String, required: false },
    image: { type: String, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);