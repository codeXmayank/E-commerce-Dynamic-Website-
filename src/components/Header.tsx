'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, User, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSession, signOut } from 'next-auth/react';
import logo from '@/assets/iamges/logo-p.png'

export default function Header() {
    const { cartCount } = useCart();
    const { data: session } = useSession();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/?q=${encodeURIComponent(searchQuery.trim())}#products`);
        } else {
            router.push('/#products');
        }
    };

    return (
        <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-[80px]">
                    {/* Logo */}
                    <div className=" flex items-center flex-shrink-0 mr-6 md:mr-10 mix-blend-multiply">
                        <Link href="/" className="flex items-center">
                            <Image
                                src={logo}
                                alt="Mayank's Shop Logo"
                                width={600}
                                height={300}
                                className="object-contain h-20 w-auto mix-blend-multiply"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-5 lg:space-x-8 h-full">
                        <Link href="/men" className="text-[14px] font-bold text-[#282c3f] border-b-[3px] border-[#ee5f73] h-full flex items-center pt-1 px-1">
                            Men
                        </Link>
                        <Link href="/women" className="text-[14px] font-bold text-[#282c3f] hover:text-black h-full flex items-center pt-1 px-1 border-b-[3px] border-transparent hover:border-[#ee5f73] transition-colors">
                            Women
                        </Link>
                        <Link href="/kids" className="text-[14px] font-bold text-[#282c3f] hover:text-black h-full flex items-center pt-1 px-1 border-b-[3px] border-transparent hover:border-[#ee5f73] transition-colors">
                            Kids
                        </Link>
                        <Link href="/home-living" className="text-[14px] font-bold text-[#282c3f] hover:text-black h-full flex items-center pt-1 px-1 border-b-[3px] border-transparent hover:border-[#ee5f73] transition-colors">
                            Home & Living
                        </Link>
                        <Link href="/beauty" className="text-[14px] font-bold text-[#282c3f] hover:text-black h-full flex items-center pt-1 px-1 border-b-[3px] border-transparent hover:border-[#ee5f73] transition-colors">
                            Beauty
                        </Link>
                        <Link href="/studio" className="text-[14px] font-bold text-[#282c3f] hover:text-black h-full flex items-center pt-1 px-1 border-b-[3px] border-transparent hover:border-[#ee5f73] transition-colors">
                            Studio
                        </Link>
                    </nav>

                    {/* Spacer / Search Bar */}
                    <div className="flex-1 max-w-xl px-4 lg:px-8 hidden lg:block ml-4">
                        <form onSubmit={handleSearch} className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-gray-500" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-md leading-5 bg-[#f5f5f6] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-colors sm:text-sm"
                                placeholder="Search something..."
                            />
                        </form>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center justify-end space-x-6 h-full lg:ml-4">
                        <div className="relative group h-full cursor-pointer flex flex-col items-center justify-center">
                            <Link href="/profile" className="flex flex-col items-center justify-center h-full border-b-[3px] border-transparent hover:border-[#ee5f73] pt-[2px] px-2">
                                <User className="h-5 w-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
                                <span className="text-[12px] font-semibold mt-1 text-gray-700 group-hover:text-gray-900 transition-colors">Profile</span>
                            </Link>

                            {/* Hover Dropdown Pane */}
                            <div className="absolute top-[80px] right-[-40px] w-[280px] bg-white shadow-[0_4px_20px_rgb(0,0,0,0.12)] border border-gray-100 rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="absolute -top-2 right-[46px] w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                                {session ? (
                                    <div className="p-5 border-b border-gray-100 relative z-10 bg-white rounded-t-sm">
                                        <p className="text-[15px] font-bold text-gray-900 mb-0.5">Hello {session.user?.name || 'User'}</p>
                                        <p className="text-[13px] text-gray-500 mb-0 truncate">{session.user?.email}</p>
                                    </div>
                                ) : (
                                    <div className="p-5 border-b border-gray-100 relative z-10 bg-white rounded-t-sm">
                                        <p className="text-[15px] font-bold text-gray-900 mb-1">Welcome</p>
                                        <p className="text-[13px] text-gray-500 mb-4">To access account and manage orders</p>
                                        <Link href="/login" className="block w-full py-2.5 px-4 text-center text-[#ff3f6c] border border-[#ff3f6c] hover:bg-[#ff3f6c]/5 font-bold rounded-sm text-[13px] tracking-wide transition-colors">
                                            LOGIN / SIGNUP
                                        </Link>
                                    </div>
                                )}
                                
                                <div className="p-2 relative z-10 bg-white rounded-b-sm">
                                    <Link href="/profile" className="block px-4 py-2 text-[14px] text-gray-700 hover:text-gray-900 hover:font-bold hover:bg-gray-50 rounded-sm transition-colors">Profile</Link>
                                    <Link href="/orders" className="block px-4 py-2 text-[14px] text-gray-700 hover:text-gray-900 hover:font-bold hover:bg-gray-50 rounded-sm transition-colors">Orders</Link>
                                    <Link href="/wishlist" className="block px-4 py-2 text-[14px] text-gray-700 hover:text-gray-900 hover:font-bold hover:bg-gray-50 rounded-sm transition-colors">Wishlist</Link>
                                    <Link href="/cart" className="block px-4 py-2 text-[14px] text-gray-700 hover:text-gray-900 hover:font-bold hover:bg-gray-50 rounded-sm transition-colors">Cart / Bag</Link>
                                    
                                    {session && (
                                        <>
                                            <hr className="my-2 border-gray-100" />
                                            <button 
                                                onClick={() => signOut({ callbackUrl: '/' })}
                                                className="w-full text-left block px-4 py-2 text-[14px] text-gray-700 hover:text-[#ff3f6c] hover:font-bold hover:bg-red-50 rounded-sm transition-colors"
                                            >
                                                Log Out
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <Link href="/wishlist" className="flex flex-col items-center justify-center h-full border-b-[3px] border-transparent hover:border-[#ee5f73] pt-[2px] transition-colors group px-2">
                            <Heart className="h-5 w-5 text-gray-700 group-hover:text-gray-900" />
                            <span className="text-[12px] font-semibold mt-1 text-gray-700 group-hover:text-gray-900">Wishlist</span>
                        </Link>
                        
                        <Link href="/cart" className="flex flex-col items-center justify-center h-full border-b-[3px] border-transparent flex-shrink-0 hover:border-[#ee5f73] pt-[2px] transition-colors group px-2">
                            <div className="relative">
                                <ShoppingBag className="h-5 w-5 text-gray-700 group-hover:text-gray-900" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-[#ff3f6c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[17px] h-[17px]">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[12px] font-semibold mt-1 text-gray-700 group-hover:text-gray-900">Bag</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}