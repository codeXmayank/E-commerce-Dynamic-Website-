import { Suspense } from 'react';
import BannerSlider from "@/components/BannerSlider";
import ProductList from "@/components/ProductList";
import Image from "next/image";
import bottomBanner from "@/assets/iamges/bottom-banner.png";

export default function Home() {
  return (
    <div className="pb-8">
      <BannerSlider />
      <Suspense fallback={<div className="text-center py-10">Loading products...</div>}>
        <ProductList />
      </Suspense>
      <div className="container mx-auto px-4 mt-12 mb-8">
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg">
          <Image 
            src={bottomBanner} 
            alt="Promotional Banner" 
            className="w-full h-auto object-cover"
            sizes="100vw"
            priority={false}
          />
        </div>
      </div>
    </div>
  );
}
