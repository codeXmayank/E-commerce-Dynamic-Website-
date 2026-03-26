'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';

const banners = [
    { id: 1, image: '/slider/slide-1.jpg' },
    { id: 2, image: '/slider/slide-2.jpg' },
    { id: 3, image: '/slider/slide-3.jpg' },
    { id: 4, image: '/slider/slide-4.jpg' },
    { id: 5, image: '/slider/slide-5.jpg' },
];

export default function BannerSlider() {
    return (
        <div className="w-full mt-6 mb-8 px-4 md:px-8 max-w-[1440px] mx-auto">
            <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl bg-gray-50 border border-gray-100">
                <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3000 }}
                pagination={{ clickable: true }}
                className="h-full"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <div className="relative w-full h-full bg-gray-50">
                            <Image 
                                src={banner.image} 
                                alt={`Banner ${banner.id}`}
                                fill
                                className="object-contain"
                                priority={banner.id === 1}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            </div>
        </div>
    );
}