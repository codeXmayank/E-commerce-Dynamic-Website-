'use client';

import { CheckCircle2, ThumbsUp, ThumbsDown, Star } from 'lucide-react';

const MOCK_REVIEWS = [
    {
        id: 1,
        author: 'Emily Carter',
        verified: true,
        avatar: 'https://i.pravatar.cc/150?u=1',
        rating: 5,
        date: '2 days ago',
        title: 'Quick and Easy Experience',
        body: 'Everything was seamless. Ordering was simple and the response time was super fast. Highly recommend to anyone looking for convenience and speed.',
        likes: 36,
        dislikes: 10
    },
    {
        id: 2,
        author: 'Priya Singh',
        verified: true,
        avatar: 'https://i.pravatar.cc/150?u=2',
        rating: 5,
        date: '10 days ago',
        title: 'Exceeded Expectations',
        body: 'From start to finish, I felt taken care of. The ordering process was smooth and the delivery was right on time. The communication was clear, and I was kept in the loop at every step. The product exceeded my expectations, both in quality and presentation.',
        likes: 17,
        dislikes: 8
    },
    {
        id: 3,
        author: 'Sophia Reed',
        verified: true,
        avatar: 'https://i.pravatar.cc/150?u=3',
        rating: 4,
        date: '18 days ago',
        title: 'Amazing Support',
        body: 'The customer service team went above and beyond. Super helpful, fast, and genuinely cared about my issue. Couldn\'t ask for better!',
        likes: 19,
        dislikes: 2
    },
    {
        id: 4,
        author: 'Daniel Kim',
        verified: true,
        avatar: 'https://i.pravatar.cc/150?u=4',
        rating: 4,
        date: '7 days ago',
        title: 'Fantastic Support',
        body: 'Had a few questions before ordering and the customer service team was amazing—super responsive and knowledgeable. It really made a difference!',
        likes: 50,
        dislikes: 18
    },
    {
        id: 5,
        author: 'Liam Brown',
        verified: true,
        avatar: 'https://i.pravatar.cc/150?u=5',
        rating: 4,
        date: '13 days ago',
        title: 'Highly Recommended',
        body: 'Very impressed by the quality and speed. It\'s rare to see this level of dedication these days. I\'ll definitely be coming back.',
        likes: 11,
        dislikes: 2
    },
    {
        id: 6,
        author: 'Daniel Carter',
        verified: true,
        avatar: 'https://i.pravatar.cc/150?u=6',
        rating: 4,
        date: '22 days ago',
        title: 'Great Value for Money',
        body: 'Wasn\'t sure at first, but the results speak for themselves. The pricing is fair, and the quality exceeded expectations.',
        likes: 14,
        dislikes: 0
    }
];

export default function ProductReviews() {
    return (
        <div className="mt-24 border-t border-gray-100 pt-16 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
                <h2 className="text-[26px] font-bold text-[#2d2d2d] tracking-tight">
                    All reviews <span className="text-gray-500 font-medium text-[22px] ml-1">(5,456,852)</span>
                </h2>
                
                <div className="flex flex-col relative min-w-[200px]">
                    <label className="text-sm font-bold text-gray-800 mb-2">Filter by rating</label>
                    <select className="bg-[#fbFcFf] border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#ee5f73] border focus:border-[#ee5f73] block w-full p-3 font-medium outline-none appearance-none shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                        <option>All Ratings</option>
                        <option>5 Stars</option>
                        <option>4 Stars & Up</option>
                        <option>3 Stars & Up</option>
                    </select>
                    <div className="absolute right-4 bottom-[14px] pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Masonry Layout */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {MOCK_REVIEWS.map((review) => (
                    <div key={review.id} className="break-inside-avoid border border-gray-100 rounded-2xl p-7 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-5">
                            <img src={review.avatar} alt={review.author} className="w-[52px] h-[52px] rounded-full object-cover bg-gray-100" />
                            <div>
                                <h4 className="font-bold text-gray-900 text-[15px]">{review.author}</h4>
                                {review.verified && (
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <CheckCircle2 className="w-[14px] h-[14px] text-[#41c552] fill-[#e4f6e6]" />
                                        <span className="text-[13px] text-gray-500 font-medium tracking-wide">Verified Buyer</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rating & Date */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex text-[#2d2d2d] gap-[1px]">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                        key={star} 
                                        className={`w-[15px] h-[15px] ${star <= review.rating ? 'fill-current' : 'text-gray-200'}`} 
                                    />
                                ))}
                            </div>
                            <span className="text-[13.5px] text-gray-500 font-medium">{review.date}</span>
                        </div>

                        {/* Title & Body */}
                        <h5 className="font-bold text-gray-900 text-[16px] mb-2.5 leading-snug">{review.title}</h5>
                        <p className="text-[14.5px] text-gray-600 leading-[1.6] mb-7">
                            {review.body}
                        </p>

                        {/* Footer (Likes) */}
                        <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group">
                                <ThumbsUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                <span className="text-[14px] font-bold">{review.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group">
                                <ThumbsDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                                <span className="text-[14px] font-bold">{review.dislikes}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 text-center">
                <button className="px-8 py-3 bg-white border border-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm">
                    Load More Reviews
                </button>
            </div>
        </div>
    );
}
