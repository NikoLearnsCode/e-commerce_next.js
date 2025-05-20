'use client';
import {Product} from '@/lib/validators';
import {useSearchParams} from 'next/navigation';
import {useMemo} from 'react';

interface FilterBarProps {
  onToggleFilter: () => void;
  isFilterOpen: boolean;
  products: Product[];
}

export default function FilterBar({onToggleFilter, products}: FilterBarProps) {
  const searchParams = useSearchParams();

  // Check if any filters are active
  const activeFilters = useMemo(() => {
    const colorParam = searchParams.get('color');
    const sizeParam = searchParams.get('size');
    const sortParam = searchParams.get('sort');

    const countableParams = [colorParam, sizeParam, sortParam];

    return {
      hasFilters: colorParam || sizeParam || sortParam,
      count: countableParams.filter(Boolean).length,
    };
  }, [searchParams]);

  return (
    <div className='sticky top-14 w-full bg-white py-4 pb-6 px-6 sm:px-8 text-base flex justify-between items-center z-20'>
      <button
        onClick={onToggleFilter}
        className='flex items-center gap-2  hover:text-gray-700 transition-colors cursor-pointer'
      >
        <span
          className={`font-medium text-sm sm:text-base  font-syne uppercase group ${activeFilters.hasFilters ? 'text-black' : ''}`}
        >
          Filtrera och ordna{' '}
          {activeFilters.hasFilters && (
            <span className='inline-flex font-arimo items-center font-medium text-base text-black '>
              ({activeFilters.count})
            </span>
          )}
          {/* <ArrowRight
            strokeWidth={1.75}
            className='w-4 h-4 ml-1 inline group-hover:translate-x-1 transition-transform'
          /> */}
        </span>
      </button>
      <span className='text-sm sm:text-base font-medium'>
        {products.length} <span className='font-syne'>produkter</span>
      </span>
    </div>
  );
}
