'use client';

import {useState} from 'react';
import Logo from '@/components/shared/Logo';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';
import UserButton from './UserButton';
import HeaderCartDropdown from '@/components/cart/HeaderCartDropdown';
import {MotionDropdown, MotionOverlay} from '../shared/AnimatedDropdown';
import {AnimatePresence} from 'framer-motion';

export default function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <>
      <div className='fixed w-full top-0 z-30 left-0 right-0  text-black  bg-white'>
        <div className='relative flex justify-between  items-center px-4 sm:px-8 h-14 bg-white gap-8'>
          {!isSearchExpanded && (
            <div className='flex  gap-4 md:gap-0 items-center'>
              <NavLinks />
              <div className='md:absolute md:left-1/2 md:transform md:-translate-x-1/2'>
                <Logo />
              </div>
            </div>
          )}

          <div
            className={`flex items-center  justify-end gap-4 sm:gap-5 ${
              isSearchExpanded ? 'flex-grow' : ''
            }`}
          >
            <SearchBar
              isExpanded={isSearchExpanded}
              setIsExpanded={setIsSearchExpanded}
            />

            <UserButton
              setIsSearchExpanded={setIsSearchExpanded}
              isSearchExpanded={isSearchExpanded}
            />
            <HeaderCartDropdown
              setIsSearchExpanded={setIsSearchExpanded}
              isSearchExpanded={isSearchExpanded}
            />
          </div>
        </div>

        <AnimatePresence>
          {isSearchExpanded && (
            <>
              <MotionDropdown
                key='top-menu'
                position='top'
                className=' h-full md:h-52 bg-white'
              >
                <div className='px-8 py-8'>
                  <h2 className='text-sm uppercase mb-4'>senaste sökningar</h2>
                  <button className='bg-gray-100 p-3  text-xs rounded-full'>
                    T-shirt
                  </button>
                </div>
              </MotionDropdown>

              <MotionOverlay
                key='search-overlay'
                className='top-14'
                onClick={() => {
                  setIsSearchExpanded(false);
                }}
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
