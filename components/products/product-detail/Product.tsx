'use client';

import Image from 'next/image';
import AddToCartButton from '@/components/products/product-detail/AddToCartButton';
import {twMerge} from 'tailwind-merge';
import {Product} from '@/lib/validators';
import {useState} from 'react';
import Newsletter from '@/components/shared/Newsletter';

import MobileImageSwiper from './MobileImageSwiper';
import dynamic from 'next/dynamic';

// Dynamically import the carousels
const ProductCarousel = dynamic(
  () => import('@/components/products/product-detail/CarouselOne')
);
const ProductTwo = dynamic(
  () => import('@/components/products/product-detail/CarouselTwo')
);

type ProductPageProps = {
  product: Product;
  categoryProducts?: Product[];
  genderProducts?: Product[];
  onCartClick?: () => void;
  initial?: boolean;
};

export default function product({
  product,
  categoryProducts = [],
  genderProducts = [],
}: ProductPageProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const initialImageIndex = 0;
  const [activeImageIndex, setActiveImageIndex] = useState(initialImageIndex);

  const handleAddToCartSuccess = () => {
    setSelectedSize(null);
  };

  return (
    <>
      <div className='w-full mx-auto lg:pt-4 lg:pb-8 '>
        <div className='flex  flex-col justify-center gap-4 lg:gap-8 lg:flex-row xl:gap-16 '>
          {/* Left column - images */}
          <div className='h-full w-full '>
            {product.images && product.images.length > 0 ? (
              <div className='flex flex-col justify-start w-full'>
                {/* Mobile view - Only rendered in the DOM on mobile */}
                <div className='lg:hidden'>
                  <MobileImageSwiper
                    images={product.images}
                    productName={product.name}
                    activeIndex={activeImageIndex}
                    initialSlide={initialImageIndex}
                    onSlideChange={setActiveImageIndex}
                  />
                </div>

                {/* Desktop view - Display all images in a grid */}
                <div className='hidden flex-1 lg:grid md lg:grid-cols-2 lg:gap-1 '>
                  {product.images.map((img, idx) => (
                    <div key={idx} className='relative     aspect-[7/9]'>
                      <Image
                        src={img}
                        alt={`${product.name} - bild ${idx + 1}`}
                        fill
                        quality={100}
                        sizes='(min-width: 1024px) 30vw, 0vw'
                        priority={true}
                        loading='eager'
                        className='object-cover  max-h-full '
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='w-full bg-gray-200 flex items-center justify-center h-[500px]'>
                <span className='text-gray-500'>Ingen bild tillgänglig</span>
              </div>
            )}
          </div>

          {/* Right column - product info */}
          <div className='flex flex-col lg:pt-24 px-6 lg:mr-12 sticky top-18 h-full  sm:px-5 gap-3 lg:gap-1 mb-12  lg:w-[35%] transition-all duration-300'>
            {/* Product name */}
            <div>
              <h1 className='text-xl lg:text-2xl mt-4 font-medium'>
                {product.name}
              </h1>
              <p className='text-gray-700 font-semibold uppercase font-syne text-sm'>
                {product.brand}
              </p>
            </div>

            <div className='text-xl my-2 sm:my-4 text-gray-800 font-semibold'>
              {product.price} kr
            </div>
            <div className='flex items-center gap-1 text-sm '>
              <span className=' uppercase  font-medium'>Färg:</span>
              <p className='text-sm text-black font-medium'>
                {product.color &&
                  product.color.charAt(0).toUpperCase() +
                    product.color.slice(1)}
              </p>
            </div>

            {/* Size */}
            <div className='flex flex-col mt-6 gap-2'>
              <span
                className={twMerge(
                  'text-gray-700 font-medium  uppercase text-xs mb-1',
                  selectedSize ? 'text-green-950 ' : 'text-gray-800'
                )}
              >
                {selectedSize ? `Vald storlek: ${selectedSize}` : 'Storlekar:'}
              </span>
              <div className='flex items-center flex-wrap'>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={twMerge(
                      'h-12 w-16 p-0 m-0 border appearance-none text-sm font-medium hover:border-black active:border-black transition border-gray-200 cursor-pointer',
                      selectedSize === size
                        ? 'border border-black bg-gray-100'
                        : ''
                    )}
                    onClick={() => setSelectedSize(size)}
                    disabled={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <AddToCartButton
              product={product}
              selectedSize={selectedSize}
              onAddSuccess={handleAddToCartSuccess}
              className='w-full h-13 mt-2 text-sm font-semibold transition duration-300 rounded-none'
              disabled={!selectedSize}
            />

            {/* <div className='space-y-4 mt-4'>
              <AccordionSection
                title='Om produkten'
                className='text-base font-medium'
              >
                <p className='text-gray-700 font-normal text-base'>
                  {product.description}
                </p>
              </AccordionSection>

              <AccordionSection
                title='Specifikationer'
                className='font-medium text-base'
              >
                {product.specs.map((spec) => (
                  <span
                    key={spec}
                    className='text-gray-700 text-base font-normal flex items-center'
                  >
                    <Dot size={22} className='text-black' />
                    {spec}
                  </span>
                ))}
              </AccordionSection>
            </div> */}

            {/* Shipping, returns, etc. */}
            {/* <div className='space-y-8 pt-12'>
              <div>
                <div className='flex items-center gap-3 mb-1'>
                  <Truck size={25} strokeWidth={1.25} />
                  <h3 className='font-medium text-base text-gray-900'>
                    Gratis frakt och snabb leverans
                  </h3>
                </div>
                <p className='text-sm text-gray-700 pl-10 lg:pr-12'>
                  Gäller för beställningar över 499 kr. Leverans inom 2-3
                  arbetsdagar.
                </p>
              </div>

              <div>
                <div className='flex items-center gap-3 mb-1'>
                  <ShieldCheck size={25} strokeWidth={1.25} />
                  <h3 className='font-medium text-gray-900'>
                    Enkla byten av presenter
                  </h3>
                </div>
                <p className='text-sm text-gray-700 pl-10 lg:pr-12'>
                  Logga in och skapa ett presentkvitto.
                </p>
              </div>

              <div>
                <div className='flex items-center gap-3 mb-1'>
                  <RefreshCcw size={25} strokeWidth={1.25} />
                  <h3 className='font-medium text-gray-900'>Enkla returer</h3>
                </div>
                <p className='text-sm text-gray-700 pl-10 lg:pr-12'>
                  Vi erbjuder enkla kostnadsfria returer inom 30 dagar.
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className=' px-6 lg:px-10 lg:w-[65%]'>
        <h5 className='uppercase text-base   mb-1 font-semibold'>
          Beskrivning
        </h5>
        <p className='text-gray-800 font-normal text-base   '>
          {product.description}
        </p>
      </div>
      {/* Products in the same category */}
      {categoryProducts.length > 0 && (
        <div className='mx-auto pt-24 lg:pt-40 pb-8'>
          <ProductCarousel products={categoryProducts} />
        </div>
      )}

      {/* Products for the same gender */}
      {genderProducts.length > 0 && (
        <div className='mx-auto py-8'>
          <ProductTwo products={genderProducts} />
        </div>
      )}
      <Newsletter />
    </>
  );
}
