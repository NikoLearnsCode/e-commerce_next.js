'use client';
import {Product} from '@/lib/validators';
import {ArrowLeft, ArrowRight} from 'lucide-react';

import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from '../product-grid/ProductCard';
import {useState} from 'react';
import type SwiperType from 'swiper';

type ProductCarouselProps = {
  products: Product[];
  title?: string;
  priorityLoading?: boolean;
  id?: string;
};

export default function ProductTwo({
  products,
  title = 'Du kanske också gillar',
  id = 'carousel-two',
}: ProductCarouselProps) {
  if (products.length === 0) {
    return null;
  }

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const prevButtonClass = `${id}-prev`;
  const nextButtonClass = `${id}-next`;

  return (
    <div className='w-full mx-auto '>
      <div className='flex justify-between items-center px-3 sm:px-5 mb-5'>
        <h2 className='md:text-2xl text-lg text-gray-800 px-2 font-medium'>
          {title}
        </h2>

        <div className='flex gap-2 z-10'>
          <button
            className={`${prevButtonClass} p-1 transition cursor-pointer ${
              isBeginning ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            aria-label='Föregående'
          >
            <ArrowLeft strokeWidth={1.25} className='  h-5 w-5' />
          </button>
          <button
            className={`${nextButtonClass} p-1 pr-3 transition cursor-pointer ${
              isEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'
            } `}
            aria-label='Nästa'
          >
            <ArrowRight strokeWidth={1.25} className='  h-5 w-5' />
          </button>
        </div>
      </div>

      {/* Swiper-karusell */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={4}
        slidesPerView={2}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 4,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 4,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 4,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 4,
          },
        }}
        onSlideChange={handleSlideChange}
        onInit={handleSlideChange}
        navigation={{
          prevEl: `.${prevButtonClass}`,
          nextEl: `.${nextButtonClass}`,
        }}
        className='w-full'
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard
              product={product}
              priorityLoading={false}
              interactionMode='carouselItem'
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
