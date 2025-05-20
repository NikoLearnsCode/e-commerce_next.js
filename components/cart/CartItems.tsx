'use client';

import Image from 'next/image';
import Link from 'next/link';

import {Minus, Plus, X} from 'lucide-react';
import {formatPrice} from '@/lib/utils';
import {motion, AnimatePresence} from 'framer-motion';
import {useCart} from '@/context/CartProvider';
import SpinningLogo from '../shared/SpinningLogo';
type CartItemsProps = {
  compact?: boolean;
};

export default function CartItems({compact = false}: CartItemsProps) {
  const {
    cartItems,
    removeItem,
    updateItemQuantity,
    updatingItems,
    removingItems,
  } = useCart();

  // Handler for removing items from cart
  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Handler for updating item quantities
  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      await updateItemQuantity(itemId, quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  return (
    <div
      className={
        compact
          ? 'max-h-[25vh] sm:max-h-[40vh] overflow-y-auto'
          : 'grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4 '
      }
    >
      <AnimatePresence>
        {cartItems.map((item) => {
          const isUpdating = updatingItems[item.id] || false;
          const isRemoving = removingItems[item.id] || false;

          // Compact view for header dropdown
          if (compact) {
            return (
              <div
                key={item.id}
                className={`flex items-center px-5 not-last:border-b  border-gray-100 py-3 justify-between gap-4 ${removingItems[item.id] ? 'opacity-50' : ''}`}
              >
                <div className='relative h-auto w-16 bg-gray-100 mr-3'>
                  <Link href={`/${item.slug}`}>
                    {item.images[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        height={150}
                        width={100}
                        className='object-contain'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-gray-400 text-xs'>
                        Ingen bild
                      </div>
                    )}
                  </Link>
                </div>

                <div className='flex-1 min-w-0'>
                  <h3 className=' text-xs md:text-sm font-medium truncate'>
                    {item.name}
                  </h3>

                  <p className='text-xs'>Storlek: {item.size}</p>
                  <p className='text-xs'>
                    Färg: <span></span>
                    {item.color}
                  </p>
                  <div className='flex justify-between items-center mt-1'>
                    <span className='text-xs'>
                      {item.quantity} x {formatPrice(item.price)}
                    </span>

                    <button
                      className={`font-medium mr-3 transition border-gray-400 text-black hover:text-red-700 hover:border-red-700  text-xs border-b disabled:opacity-50 cursor-pointer ${removingItems[item.id] ? 'text-red-700 border-red-700 hover:border-red-700' : ''}`}
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removingItems[item.id]}
                    >
                      {removingItems[item.id] ? 'Tar bort' : 'Ta bort'}
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          // Full view for cart page

          return (
            <motion.div
              key={item.id}
              className='flex flex-row sm:flex-col pb-4 mb-4 sm:mb-0  border-b border-gray-100 sm:border-none overflow-hidden sm:p-1'
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{
                opacity: 0,
                height: 0,
                marginBottom: 0,
                transition: {
                  opacity: {duration: 0.2},
                  height: {duration: 0.3},
                },
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
              layout
            >
              {/* Image section */}
              <div className='relative w-full h-full aspect-7/9'>
                <Link href={`/${item.slug}`}>
                  {item.images[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      quality={100}
                      priority
                      className='object-cover  w-full h-full '
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-gray-400'>
                      Ingen bild
                    </div>
                  )}
                </Link>
                <button
                  className='absolute top-0 right-0 z-1 p-2  cursor-pointer '
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <SpinningLogo width='25' height='18' />
                  ) : (
                    <X size={25} strokeWidth={1} />
                  )}
                </button>
              </div>

              {/* Content section */}
              <div className='px-4 py-3 relative lg:pb-10 lg:px-6 flex-1 flex flex-col justify-between mb-2'>
                <div className='flex flex-col flex-1 gap-2 lg:gap-1 text-xs    font-semibold text-gray-900'>
                  <h2 className=' text-sm sm:text-base  font-semibold text-gray-900'>
                    {item.name}
                  </h2>
                  <p className=' font-semibold uppercase font-syne text-gray-600 '>
                    {item.brand}
                  </p>
                  <p>
                    <span className='font-light'>Storlek:</span> {item.size}
                  </p>
                  <p>
                    <span className='font-light'>Färg:</span> {item.color}
                  </p>
                  <p>
                    <span className='font-light'>Pris:</span>{' '}
                    {formatPrice(item.price)}
                  </p>
                  {/* {item.quantity > 1 && (
                    <>
                      <p>
                        <span className='font-normal'>Antal:</span>{' '}
                        {item.quantity}
                      </p>
                      <p>
                        <span className='font-normal'>Totalt:</span>{' '}
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </>
                  )} */}
                </div>

                {/* Quantity controls */}
                <div className='text-sm mt-1 sm:absolute sm:top-1 sm:right-3 md:text-base flex  items-center space-x-3'>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    disabled={isUpdating || item.quantity <= 1}
                    className={`h-8 w-8  flex items-center justify-center  ${
                      item.quantity <= 1
                        ? 'pointer-events-none opacity-50 '
                        : 'cursor-pointer '
                    }`}
                  >
                    {isUpdating ? (
                      <SpinningLogo width='25' height='20' />
                    ) : (
                      <Minus
                        strokeWidth={1}
                        className='text-gray-900 w-5 h-5   '
                      />
                    )}
                  </button>
                  <span className='font-medium  text-base  text-gray-700 '>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    disabled={isUpdating}
                    className='h-8 w-8 flex items-center justify-center  cursor-pointer'
                  >
                    {isUpdating ? (
                      <SpinningLogo width='30' height='20' />
                    ) : (
                      <Plus
                        strokeWidth={1}
                        className='text-gray-900 w-5 h-5   '
                      />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
