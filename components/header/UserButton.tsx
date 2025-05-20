'use client';

import Link from 'next/link';

import {User, Loader2, ArrowRight} from 'lucide-react';
import {useAuth} from '@/context/AuthProvider';
import {useEffect, useState, useRef, useTransition} from 'react';
import {signOutAction} from '@/actions/auth';
import SpinningLogo from '../shared/SpinningLogo';
import {motion} from 'framer-motion';
import {AnimatePresence} from 'framer-motion';
import {MotionCloseX} from './AnimatedDropdown';

function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction();

      // window.dispatchEvent(new Event('cart-updated'));
    });
  };

  return (
    <button
      onClick={handleSignOut}
      type='button'
      disabled={isPending}
      className='flex items-center w-full  px-4 py-2 text-sm  disabled:opacity-70 cursor-pointer'
    >
      {isPending ? (
        <>
          <span className='flex w-full justify-between group relative items-center gap-2 text-red-700'>
            Loggar ut...
            <Loader2 size={14} className='animate-spin' />
          </span>
        </>
      ) : (
        <>
          <span className='flex w-full hover:text-red-700 font-medium justify-between group relative items-center gap-2 text-gray-700'>
            Logga ut
            <ArrowRight
              size={14}
              strokeWidth={1.5}
              className='group-hover:translate-x-1  transition-transform duration-300'
            />
          </span>
        </>
      )}
    </button>
  );
}

const UserButton = () => {
  const {user, loading, refreshUser} = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Uppdatera användarinformation när komponenten monteras
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center'>
        <SpinningLogo width='30' height='25' />
      </div>
    );
  }

  if (!user) {
    return (
      <Link href='/sign-in' className='group relative pb-1'>
        <User size={28} strokeWidth={1} />
        <span className='absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-500 bottom-full left-1/2 transform -translate-x-1/2 px-2 text-xs uppercase -mb-1 font-syne text-black whitespace-nowrap'>
          Logga in
        </span>
      </Link>
    );
  }

  let firstAndLastInitial = '';

  if (user.user_metadata.first_name && user.user_metadata.last_name) {
    firstAndLastInitial =
      user.user_metadata.first_name?.charAt(0).toUpperCase() +
      user.user_metadata.last_name?.charAt(0).toUpperCase();
  } else {
    firstAndLastInitial = user.email?.charAt(0).toUpperCase() ?? 'U';
  }
  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center  cursor-pointer  relative'
      >
        <div className='h-7 w-7 rounded-full uppercase black border border-black bg-white flex items-center justify-center text-sm  font-semibold'>
          {firstAndLastInitial}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className='absolute top-10.5 right-0 w-64 bg-white  rounded-xs shadow-lg py-1 z-20 border border-gray-200'
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            transition={{duration: 0.2}}
          >
            <div className='px-4 py-2 relative border-b border-gray-300'>
              <p className='text-base flex  justify-between font-semibold text-gray-900 truncate'>
                {user.user_metadata.full_name}{' '}
                <span className='absolute right-4 '>
                  <MotionCloseX onClick={() => setIsOpen(false)} />
                </span>
              </p>
              <p className='text-sm font-medium text-gray-600'>{user.email}</p>
            </div>

            <Link
              href='/profile'
              className='flex items-center px-4 py-2 text-sm  text-gray-700  border-b  border-gray-200'
              onClick={() => setIsOpen(false)}
            >
              <span className='flex w-full font-medium hover:text-black justify-between group relative items-center gap-2'>
                Mitt konto
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className='group-hover:translate-x-1  transition-transform duration-300'
                />
              </span>
            </Link>

            <LogoutButton />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserButton;
