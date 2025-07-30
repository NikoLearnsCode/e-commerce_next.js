'use client';

import React, {useRef, useEffect, useState} from 'react';
import {Search} from 'lucide-react';
import {motion} from 'framer-motion';
import {useRouter} from 'next/navigation';
import {MotionCloseX} from './AnimatedDropdown';

export default function SearchBar({
  isExpanded,
  setIsExpanded,
}: {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  /*   useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]); */

    useEffect(() => {
    if (!isExpanded && searchQuery !== '' ) {
     setSearchQuery('')
    }
  }, [isExpanded, searchQuery]);

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsExpanded(false);

    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsExpanded(false);
      setSearchQuery('');
    }
  };

  return (
    <div
      className={`flex items-center justify-end ${isExpanded ? 'w-full' : ''}`}
    >
      {isExpanded ? (
        <>
          <form
            key='search-form'
            className='flex items-center w-full relative'
            onSubmit={(e) => handleSubmit(e)}
          >
            <input
              ref={inputRef}
              type='text'
              autoFocus={true}
              value={searchQuery}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Return') {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='SÖK'
              className='w-full pl-0.5 pr-4 placeholder:text-sm md:placeholder:text-base  bg-white outline-none border-b border-gray-900 '
            />
            <div className='absolute -right-3' aria-label='Close search'>
              <MotionCloseX
                onClick={() => setIsExpanded(false)}
                size={12}
                strokeWidth={2}
                className='px-3 py-2'
              />
            </div>
          </form>
        </>
      ) : (
        <motion.button
          key='search-button'
          onClick={() => setIsExpanded(true)}
          className=' cursor-pointer'
          aria-label='Search'
        >
          <Search size={24} strokeWidth={1} className='md:hidden' />
          <span className='hidden md:block text-sm font-medium uppercase border-b border-transparent hover:border-black transition'>
            Sök
          </span>
        </motion.button>
      )}
    </div>
  );
}
