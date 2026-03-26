import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-100 bg-white pt-16 pb-8 mt-12 font-sans overflow-hidden text-sm">
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                {/* Top Links Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16 lg:gap-12">
                    {/* SHOP */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="font-bold text-gray-900 tracking-wide text-xs mb-2">SHOP</h4>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">New Arrivals</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Collections</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Accessories</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Shoes</Link>
                        
                        <div className="h-2"></div>
                        
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Inspiration</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Brands</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Gift Cards</Link>
                    </div>

                    {/* POPULAR */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="font-bold text-gray-900 tracking-wide text-xs mb-2">POPULAR</h4>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Seasonal Favorites</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Must-Have Bags</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Cozy Knitwear</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Trendy Accessories</Link>
                    </div>

                    {/* SUPPORT */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="font-bold text-gray-900 tracking-wide text-xs mb-2">SUPPORT</h4>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Contact Us</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Account</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Store Locations</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Shipping And Delivery</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Returns</Link>
                    </div>

                    {/* INFO */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="font-bold text-gray-900 tracking-wide text-xs mb-2">INFO</h4>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">About</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Career</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Sustainability</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Investor Relations</Link>
                        <Link href="#" className="text-gray-600 hover:text-black transition-colors">Press</Link>
                    </div>
                </div>

                {/* Bottom Section: Payment Providers & Socials */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-6 border-t border-gray-100">
                    <div className="flex items-center space-x-4 flex-wrap justify-center flex-1 lg:flex-none">
                        {/* Fake Payment Icons built with styling since exact SVGs weren't provided */}
                        <div className="px-3 py-1.5 border border-gray-200 rounded flex items-center justify-center font-bold text-blue-800 text-xs bg-white h-8">
                            VISA
                        </div>
                        <div className="px-3 py-1.5 border border-gray-200 rounded flex items-center justify-center font-bold text-black text-xs bg-white h-8 gap-1">
                            {/* Apple Pay placeholder */}
                            <span> Pay</span>
                        </div>
                        <div className="px-3 py-1.5 border border-gray-200 rounded flex items-center justify-center font-bold text-gray-700 text-xs bg-white h-8 gap-1">
                            <span className="text-red-500 font-bold">G</span> Pay
                        </div>
                        <div className="px-3 py-1.5 rounded flex items-center justify-center font-bold text-black text-xs bg-pink-200 h-8">
                            Klarna.
                        </div>
                        <div className="px-3 py-1.5 border border-gray-200 rounded flex items-center justify-center bg-white h-8">
                            {/* Mastercard pseudo-icon */}
                            <div className="w-3 h-3 rounded-full bg-red-500 -mr-1 opacity-90 mix-blend-multiply"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-90 mix-blend-multiply"></div>
                        </div>
                        <div className="px-3 py-1.5 border border-gray-200 rounded flex items-center justify-center font-bold italic text-blue-900 text-xs bg-white h-8">
                            PayPal
                        </div>
                    </div>

                    <div className="hidden lg:block h-6 border-l border-gray-300 mx-8"></div>

                    <div className="flex items-center space-x-6 pb-2 md:pb-0">
                        <Link href="#" className="text-black hover:text-gray-600 transition-colors">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                            </svg>
                        </Link>
                        <Link href="#" className="text-black hover:text-gray-600 transition-colors">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.46 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                            </svg>
                        </Link>
                        <Link href="#" className="text-black hover:text-gray-600 transition-colors font-bold text-lg flex items-center justify-center w-5 h-5">
                            {/* Pinterest P dummy */}
                            <span className="font-serif italic text-[1.2rem] leading-none">P</span>
                        </Link>
                        <Link href="#" className="text-black hover:text-gray-600 transition-colors font-bold text-lg flex items-center justify-center w-5 h-5">
                            {/* TikTok dummy */}
                            <span className="font-sans font-black italic text-[1rem] leading-none tracking-tighter">tk</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
