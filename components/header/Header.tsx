'use client';

import {useState} from 'react';
import Logo from '@/components/shared/Logo';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';
import UserButton from './UserButton';
import HeaderCartDropdown from '@/components/cart/HeaderCartDropdown';
import {MotionOverlay} from '../shared/AnimatedDropdown';

export default function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <>
      <div className='fixed w-full top-0 z-40 text-black  bg-white'>
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
            className={`flex items-center justify-end gap-4 sm:gap-5 ${
              isSearchExpanded ? 'flex-grow' : ''
            }`}
          >
            <SearchBar
              isExpanded={isSearchExpanded}
              setIsExpanded={setIsSearchExpanded}
            />

            <UserButton />
            <HeaderCartDropdown />
          </div>
        </div>
      </div>
      {isSearchExpanded && (
        <MotionOverlay
          key='search-overlay'
          className=' bg-black/20'
          onClick={() => {
            setIsSearchExpanded(false);
          }}
        />
      )}
    </>
  );
}
