'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { 
    User, Bell, Briefcase, Link as LinkIcon, 
    Lock, ChevronDown, Info, Loader2, LogOut, KeyRound, Camera
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [avatar, setAvatar] = useState((session?.user as any)?.image || 'https://api.dicebear.com/9.x/avataaars/svg');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync avatar if session explicitly updates
    useEffect(() => {
        if ((session?.user as any)?.image) {
            setAvatar((session?.user as any).image);
        }
    }, [(session?.user as any)?.image]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be less than 2MB');
            return;
        }

        setIsUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            setAvatar(base64String); // Intelligently optimistic UI swap

            try {
                const res = await fetch('/api/profile/update-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64String })
                });

                const data = await res.json();
                if (res.ok) {
                    toast.success('Profile picture updated successfully!');
                } else {
                    toast.error(data.message || 'Failed to update image');
                    setAvatar((session?.user as any)?.image || 'https://api.dicebear.com/9.x/avataaars/svg');
                }
            } catch (error) {
                toast.error('An error occurred while linking your image');
                setAvatar((session?.user as any)?.image || 'https://api.dicebear.com/9.x/avataaars/svg');
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return; 
        }

        try {
            setIsChangingPassword(true);
            const res = await fetch('/api/profile/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || 'Password changed successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(data.message || 'Failed to change password');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        try {
            setIsDeleting(true);
            const response = await fetch('/api/profile/delete', {
                method: 'DELETE',
            });

            if (response.ok) {
                // Sign out unconditionally and redirect to signup
                await signOut({ callbackUrl: '/signup' });
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to delete account');
                setIsDeleting(false);
            }
        } catch (error) {
            console.error('An error occurred while deleting account:', error);
            alert('An error occurred. Please try again.');
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
    );

    if (!session) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-6 lg:mt-10 mb-20 font-sans">
            <div className="flex flex-col md:flex-row gap-10">
                
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-8 text-gray-900 tracking-tight">
                        User profile<br />management
                    </h2>
                    <nav className="space-y-2">
                        <button 
                            onClick={() => setActiveTab('personal')} 
                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${activeTab === 'personal' ? 'bg-gray-100 text-black font-semibold' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700 font-medium'}`}
                        >
                            <User className="w-4 h-4" />
                            Personal Info
                        </button>
                        <button 
                            onClick={() => setActiveTab('security')} 
                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${activeTab === 'security' ? 'bg-gray-100 text-black font-semibold' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700 font-medium'}`}
                        >
                            <Lock className="w-4 h-4" />
                            Emails & Password
                        </button>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-gray-700 rounded-xl font-medium text-sm transition-colors">
                            <Bell className="w-4 h-4" />
                            Notifications
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-gray-700 rounded-xl font-medium text-sm transition-colors">
                            <Briefcase className="w-4 h-4" />
                            Businesses
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-gray-700 rounded-xl font-medium text-sm transition-colors">
                            <LinkIcon className="w-4 h-4" />
                            Integration
                        </a>
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <button 
                                type="button" 
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl font-semibold text-sm transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 w-full max-w-4xl border-l border-gray-100 md:pl-10">
                    {activeTab === 'personal' ? (
                        <>
                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                                <h1 className="text-2xl font-bold text-gray-900">Personal information</h1>
                                <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium bg-emerald-50 px-3 py-1.5 rounded-full">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving changes
                                </div>
                            </div>

                    {/* Profile Picture */}
                    <div className="mb-10">
                        <div 
                            className={`relative w-28 h-28 rounded-full border border-gray-200 overflow-hidden group cursor-pointer ${isUploading ? 'opacity-50' : ''}`}
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                        >
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                ref={fileInputRef} 
                                onChange={handleImageChange}
                            />
                            <Image 
                               src={avatar}
                                alt="avatar" 
                                fill  
                                className="object-cover"
                                unoptimized
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                {isUploading ? (
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                ) : (
                                    <>
                                        <Camera className="w-6 h-6 text-white mb-1" />
                                        <span className="text-white text-[10px] font-bold tracking-wider">CHANGE</span>
                                    </>
                                )}
                            </div>
                            {/* Static overlay from design (always visible) */}
                            <div className="absolute bottom-0 left-0 w-full h-8 bg-[#1A1A1A] flex items-center justify-center pointer-events-none">
                                <Lock className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">First Name</label>
                                <input 
                                    type="text" 
                                    defaultValue={session.user.name?.split(' ')[0] || "Arafat"}
                                    className="w-full px-4 py-3 rounded-[1rem] border border-gray-200 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                />
                            </div>
                            {/* Last Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                <input 
                                    type="text" 
                                    defaultValue={session.user.name?.split(' ')[1] || "Nayeem"}
                                    className="w-full px-4 py-3 rounded-[1rem] border border-gray-200 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                />
                            </div>

                            {/* Email Address */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                <input 
                                    type="email" 
                                    defaultValue={session.user.email || "hello@filllo.com"}
                                    className="w-full px-4 py-3 rounded-[1rem] border border-blue-500 text-gray-900 shadow-[0_0_0_4px_rgba(59,130,246,0.1)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                />
                            </div>
                            
                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                                <div className="flex rounded-[1rem] border border-gray-200 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                    <div className="flex items-center px-4 bg-white border-r border-gray-200 text-sm text-gray-700 cursor-pointer">
                                        +880
                                        <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
                                    </div>
                                    <input 
                                        type="tel" 
                                        defaultValue="1681 788 203"
                                        className="w-full px-4 py-3 bg-white text-gray-900 focus:outline-none text-sm"
                                    />
                                </div>
                            </div>

                            {/* Country */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Country</label>
                                <div className="relative">
                                    <select className="w-full px-4 py-3 rounded-[1rem] border border-gray-200 text-gray-900 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white">
                                        <option>Bangladesh</option>
                                        <option>United States</option>
                                        <option>United Kingdom</option>
                                        <option>India</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* City */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">City</label>
                                <div className="relative">
                                    <select className="w-full px-4 py-3 rounded-[1rem] border border-gray-200 text-gray-900 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white">
                                        <option>Sylhet</option>
                                        <option>Dhaka</option>
                                        <option>Chittagong</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Zip Code */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Zip Code</label>
                                <input 
                                    type="text" 
                                    defaultValue="3100"
                                    className="w-full px-4 py-3 rounded-[1rem] border border-gray-200 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                />
                            </div>
                        </div>
                    </form>
                    </>
                    ) : activeTab === 'security' ? (
                        <>
                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                                <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
                            </div>

                            {/* Change Password Section */}
                            <div className="bg-white border border-gray-100 rounded-[1.25rem] p-6 md:p-8 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <KeyRound className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                                </div>
                        
                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700">Current Password</label>
                                    <input 
                                        type="password" 
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-[1rem] border border-gray-200 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">New Password</label>
                                    <input 
                                        type="password" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-[1rem] border border-gray-200 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-[1rem] border border-gray-200 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <button 
                                    type="submit" 
                                    disabled={isChangingPassword}
                                    className={`px-6 py-3 bg-black text-white font-semibold text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 ${isChangingPassword ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isChangingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Delete Account Section */}
                    <div className="mt-12 bg-[#F4F6F8] rounded-[1.25rem] p-6 md:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Account</h3>
                        
                        <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 mb-4 shadow-sm">
                            <Info className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-600">
                                After making a deletion request, you will have <span className="font-bold text-gray-900">6 months</span> to maintain this account.
                            </p>
                        </div>
                        
                        <p className="text-sm text-gray-500 leading-relaxed max-w-3xl mb-6">
                            To permanently erase your whole ProAcc account, click the button below. This implies that you won&apos;t have access to your enterprises, products, orders, or any other data related to this account.
                        </p>
                        
                        <button 
                            type="button" 
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className={`px-5 py-2.5 bg-red-50 text-red-600 font-semibold text-sm rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2 ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isDeleting ? 'Deleting...' : 'Delete Account'}
                        </button>
                    </div>
                </>
                ) : null}
                </div>
            </div>
        </div>
    );
}