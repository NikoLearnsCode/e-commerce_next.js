import {useCart} from '@/context/CartProvider';
import {useEffect} from 'react';
import {AnimatePresence} from 'framer-motion';
import {
  MotionOverlay,
  MotionDropdown,
  MotionCloseX,
} from '../header/AnimatedDropdown';
import Image from 'next/image';

// Dropdown
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
export function ProductListDropdown({
  closeMenu,
  isOpen,
}: {
  closeMenu: () => void;
  isOpen: boolean;
}) {
  const {cartItems, itemCount, removeItem, removingItems} = useCart();

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, closeMenu]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <>
      {/* Cart module dropdown nedåt */}
      <AnimatePresence>
        {isOpen && (
          <>
            <MotionOverlay key='mobile-cart-overlay' onClick={closeMenu} />

            <MotionDropdown
              position='right'
              key='mobile-cart'
              isMobile={true}
              className='overflow-y-auto min-w-full md:min-w-[450px] '
            >
              <h2 className='font-semibold text-base p-5'>
                DIN VARUKORG ({itemCount})
              </h2>

              <div className=' pt-3 pb-12  grid grid-cols-1 max-h-[88%] overflow-y-auto'>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center px-5 not-last:border-b  border-gray-100 py-3 justify-between gap-4 ${removingItems[item.id] ? 'opacity-50' : ''}`}
                  >
                    <div className=' relative  bg-gray-50'>
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        height={160}
                        width={140}
                        priority
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-medium'>{item.name}</h3>
                      <p className='text-sm text-gray-600'>
                        Antal: {item.quantity}
                      </p>
                      <p className='text-sm text-gray-600'>
                        Storlek: {item.size}
                      </p>
                      <p className='text-sm text-gray-600'>{item.color}</p>
                      <p className='text-sm text-gray-600'>
                        {item.price * item.quantity} kr
                      </p>
                      {cartItems.length > 1 && (
                      <button
                        className={`font-medium mr-3 transition border-gray-400 text-black hover:text-red-700 hover:border-red-700  text-xs border-b disabled:opacity-50 cursor-pointer ${removingItems[item.id] ? 'text-red-700 border-red-700 hover:border-red-700' : ''}`}
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removingItems[item.id]}
                      >
                        {removingItems[item.id] ? 'Tar bort' : 'Ta bort'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className='absolute top-5 right-7'>
                <MotionCloseX onClick={closeMenu} size={22} strokeWidth={1} />
              </div>
            </MotionDropdown>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
