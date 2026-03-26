import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 font-sans bg-white pb-20">
            <div className="text-center max-w-md w-full flex flex-col items-center">
                
                {/* 404 Vector Illustration */}
                <div className="mb-2 relative">
                    <svg width="220" height="220" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto block">
                        {/* Desk / Base */}
                        <path d="M50 150 L110 150 Q115 150 115 145 L115 140 Q115 135 110 135 L55 135 Q50 135 50 140 Z" fill="#374151" stroke="#111827" strokeWidth="4" strokeLinejoin="round"/>
                        
                        {/* Laptop Screen */}
                        <path d="M45 105 Q45 100 50 100 L90 100 Q95 100 95 105 L100 135 L40 135 Z" fill="#60A5FA" stroke="#111827" strokeWidth="4" strokeLinejoin="round"/>
                        
                        {/* Person Body */}
                        <path d="M100 135 Q95 110 115 110 L135 110 L140 145 Z" fill="#4B96DB" stroke="#111827" strokeWidth="4" strokeLinejoin="round"/>
                        
                        {/* Person Head */}
                        <path d="M110 90 Q110 65 125 65 Q140 65 140 90 Q140 110 125 110 Q110 110 110 90 Z" fill="#FCA5A5" stroke="#111827" strokeWidth="4"/>
                        
                        {/* Hair Spikes */}
                        <path d="M105 75 Q115 50 130 55 Q135 60 135 70 Q145 60 145 75 Q135 80 125 65 Q115 80 110 75 Z" fill="#374151"/>
                        
                        {/* Person Face details */}
                        <path d="M118 85 Q120 82 122 85" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M128 85 Q130 82 132 85" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
                        
                        {/* Mouth / Oops oval */}
                        <ellipse cx="125" cy="102" rx="4" ry="6" fill="#111827" />

                        {/* Exclamation Mark */}
                        <path d="M150 50 L155 75 L145 75 Z" fill="#EF4444" stroke="#111827" strokeWidth="3" strokeLinejoin="round"/>
                        <circle cx="150" cy="88" r="4.5" fill="#EF4444" stroke="#111827" strokeWidth="3"/>
                        
                        {/* Lightning Bolt */}
                        <path d="M40 50 L50 65 L40 68 L50 90 L35 70 L45 67 Z" fill="#FBBF24" stroke="#111827" strokeWidth="3" strokeLinejoin="round"/>
                        
                        {/* Person Arms/Hands Stress */}
                        <path d="M115 115 Q130 90 135 100 L145 135" fill="none" stroke="#111827" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="132" cy="85" r="6" fill="#FCA5A5" stroke="#111827" strokeWidth="3"/>
                    </svg>
                </div>

                <h1 className="text-[64px] font-extrabold text-[#1a202c] tracking-tight mb-2 leading-none mt-2">404</h1>
                <h2 className="text-[20px] font-bold text-[#1a202c] mb-4">Oops! Page Not Found</h2>
                <p className="text-[15px] text-gray-500 mb-8 leading-relaxed max-w-[340px] mx-auto">
                    Sorry, the page you&apos;re looking for doesn&apos;t exist or may have been moved. Please check the URL.
                </p>

                <Link 
                    href="/" 
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-[#1743E8] hover:bg-[#1236C4] text-white font-semibold rounded-full transition-all duration-200 text-[15px] shadow-[0_4px_14px_0_rgba(23,67,232,0.39)] hover:shadow-[0_6px_20px_rgba(23,67,232,0.23)] hover:-translate-y-0.5"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}