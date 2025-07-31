'use client';

interface FilterBarProps {
  onToggleFilter: () => void;
  isFilterOpen: boolean;
  totalCount: number;
  activeFilterCount: number;
  hasActiveFilters: boolean;
}

export default function FilterBar({
  onToggleFilter,
  totalCount,
  activeFilterCount,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className='sticky top-14 w-full bg-white py-4 pb-5 px-5 sm:px-8 text-base flex justify-between items-center z-20'>
      <button
        onClick={onToggleFilter}
        className='flex items-center gap-2  hover:text-gray-700 transition-colors cursor-pointer'
      >
        <span
          className={`font-medium text-sm sm:text-base  font-syne uppercase group ${hasActiveFilters ? 'text-black' : ''}`}
        >
          Filtrera och ordna{' '}
          {hasActiveFilters && (
            <span className='inline-flex font-arimo items-center font-medium text-base text-black '>
              ({activeFilterCount})
            </span>
          )}
          {/* <ArrowRight
            strokeWidth={1.75}
            className='w-4 h-4 ml-1 inline group-hover:translate-x-1 transition-transform'
          /> */}
        </span>
      </button>
      <span className='text-sm sm:text-base'>
        {totalCount}{' '}
        <span className=''>
          {totalCount === 1 ? 'produkt' : 'produkter'}
        </span>
      </span>
    </div>
  );
}
