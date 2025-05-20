'use client';

import {useState, useMemo, useEffect} from 'react';
import {AnimatePresence} from 'framer-motion';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Product} from '@/lib/validators';
import AccordionSection, {Accordion} from '@/components/shared/Accordion';

import {
  MotionCloseX,
  MotionOverlay,
  MotionDropdown,
} from '@/components/header/AnimatedDropdown';
import {Button} from '@/components/shared/button';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];

  // onFilterChange?: (filters: {
  //   colors: string[];
  //   sizes: string[];
  //   sortOrder?: string;
  // }) => void;
}

export default function FilterPanel({
  isOpen,
  onClose,
  products,

  // onFilterChange,
}: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string | null>(null);

  // Hämta redan satta filter från URL när komponenten laddas
  useEffect(() => {
    const colorParam = searchParams.get('color');
    const sizeParam = searchParams.get('size');
    const sortParam = searchParams.get('sort');

    if (colorParam) setSelectedColors(colorParam.split(','));
    if (sizeParam) setSelectedSizes(sizeParam.split(','));
    if (sortParam) setSortOrder(sortParam);
  }, [searchParams]);

  // Tar ut unika färger och storlekar från alla produkter.
  const {uniqueColors, uniqueSizes} = useMemo(() => {
    const colorSet = new Set<string>();
    const sizeSet = new Set<string>();

    products.forEach((p) => {
      if (p.color) colorSet.add(p.color);
      if (p.sizes) p.sizes.forEach((s) => sizeSet.add(s));
    });

    return {
      uniqueColors: Array.from(colorSet).sort(),
      uniqueSizes: sortSizes(Array.from(sizeSet)),
    };
  }, [products]);

  // Hjälpfunktion som sorterar storlekar
  function sortSizes(sizes: string[]) {
    const sizeOrder: {[key: string]: number} = {
      XXS: 0,
      XS: 1,
      S: 2,
      M: 3,
      L: 4,
      XL: 5,
      XXL: 6,
      XXXL: 7,
    };
    const numeric: string[] = [];
    const text: string[] = [];

    sizes.forEach((sz) => {
      if (sz.toUpperCase() in sizeOrder) {
        text.push(sz);
      } else {
        numeric.push(sz);
      }
    });

    text.sort(
      (a, b) => sizeOrder[a.toUpperCase()] - sizeOrder[b.toUpperCase()]
    );
    numeric.sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      return isNaN(numA) || isNaN(numB) ? a.localeCompare(b) : numA - numB;
    });

    return [...text, ...numeric];
  }

  // Checkbox och radioknapp-hantering
  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleSort = (newSort: string) => {
    setSortOrder((prev) => (prev === newSort ? null : newSort));
  };

  // Rensa alla val.
  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setSortOrder(null);
    router.push(pathname);
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedColors.length) params.set('color', selectedColors.join(','));
    if (selectedSizes.length) params.set('size', selectedSizes.join(','));
    if (sortOrder) params.set('sort', sortOrder);

    const url = params.toString() ? `${pathname}?${params}` : pathname;
    router.push(url);

    // onFilterChange?.({
    //   colors: selectedColors,
    //   sizes: selectedSizes,
    //   sortOrder: sortOrder || undefined,
    // });

    onClose();
  };

  const hasActiveFilters =
    !!sortOrder || selectedColors.length > 0 || selectedSizes.length > 0;

  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <>
          <MotionDropdown
            position='right'
            key='filter-dropdown'
            className='max-w-full z-50 min-w-full md:max-w-[500px] md:min-w-[500px]'
          >
            <div className='flex flex-col h-full justify-between py-10 px-10'>
              {/* --- Titel och stängknapp --- */}
              <div className='flex items-center justify-between mb-10'>
                <h1 className='text-base font-semibold uppercase font-syne '>
                  Filtrera och ordna
                </h1>
                <MotionCloseX
                  onClick={onClose}
                  size={18}
                  strokeWidth={1.5}
                  className='mr-2'
                />
              </div>

              {/* --- Innehåll (scroll) --- */}
              <div className='h-[calc(100vh-20rem)]  overflow-y-auto gap-4'>
                <Accordion singleOpen>
                  {/* Storlekar */}
                  {uniqueSizes.length > 0 && (
                    <AccordionSection
                      title='Storlekar'
                      selected={selectedSizes.join(', ')}
                      className='border-b font-medium'
                    >
                      <div className='grid grid-cols-1 gap-3 text-base font-medium'>
                        {uniqueSizes.map((size) => (
                          <CheckboxOption
                            key={size}
                            id={`size-${size}`}
                            label={size}
                            checked={selectedSizes.includes(size)}
                            onChange={() => toggleSize(size)}
                          />
                        ))}
                      </div>
                    </AccordionSection>
                  )}

                  {/* Färger */}
                  {uniqueColors.length > 0 && (
                    <AccordionSection
                      title='Färger'
                      selected={selectedColors.join(', ')}
                      className='border-b font-medium  '
                    >
                      <div className='grid grid-cols-1 gap-4 '>
                        {uniqueColors.map((color) => (
                          <CheckboxOption
                            key={color}
                            id={`color-${color}`}
                            label={color}
                            checked={selectedColors.includes(color)}
                            onChange={() => toggleColor(color)}
                          />
                        ))}
                      </div>
                    </AccordionSection>
                  )}

                  {/* Sortering */}
                  <AccordionSection
                    title='Sortera efter'
                    // selected={sortOrder || 'Standard'}
                    className='border-b font-medium '
                  >
                    <div className='grid grid-cols-1 gap-4'>
                      <RadioOption
                        id='sort-default'
                        label='Standard'
                        checked={!sortOrder}
                        onChange={() => setSortOrder(null)}
                      />
                      <RadioOption
                        id='sort-price-asc'
                        label='Pris: Lägst först'
                        checked={sortOrder === 'price_asc'}
                        onChange={() => toggleSort('price_asc')}
                      />
                      <RadioOption
                        id='sort-price-desc'
                        label='Pris: Högst först'
                        checked={sortOrder === 'price_desc'}
                        onChange={() => toggleSort('price_desc')}
                      />
                      <RadioOption
                        id='sort-name-asc'
                        label='Namn: A-Ö'
                        checked={sortOrder === 'name_asc'}
                        onChange={() => toggleSort('name_asc')}
                      />
                    </div>
                  </AccordionSection>
                </Accordion>
              </div>

              {/* --- Knappar längst ned --- */}
              <div className='flex flex-col'>
                <Button
                  variant='default'
                  className='w-full'
                  onClick={applyFilters}
                >
                  Visa artiklar
                </Button>
                <Button
                  variant='outline'
                  className='mt-2 text-gray-600 w-full'
                  disabled={!hasActiveFilters}
                  onClick={clearFilters}
                >
                  Rensa filter
                </Button>
              </div>
            </div>
          </MotionDropdown>

          {/* Overlay (bakgrundsdimning) */}
          <MotionOverlay
            key='filter-overlay'
            className='z-41'
            onClick={onClose}
          />
        </>
      )}
    </AnimatePresence>
  );
}

// hjälpkomponenter för checkbox och radio
function CheckboxOption({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onChange();
    }
  };

  return (
    <label htmlFor={id} className='flex items-center space-x-2 cursor-pointer'>
      <div className='relative'>
        <input
          type='checkbox'
          id={id}
          checked={checked}
          onChange={onChange}
          className='sr-only'
        />
        <div
          className={`w-5 h-5 border ${checked ? 'border-black' : 'border-gray-300'} flex items-center justify-center`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role='checkbox'
          aria-checked={checked}
        >
          {checked && (
            <svg
              className='w-4 h-4 text-black'
              viewBox='0 0 20 20'
              fill='currentColor'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          )}
        </div>
      </div>
      <span className='text-xs uppercase font-medium cursor-pointer'>
        {label}
      </span>
    </label>
  );
}

function RadioOption({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onChange();
    }
  };

  return (
    <label htmlFor={id} className='flex items-center space-x-2 cursor-pointer'>
      <div className='relative'>
        <input
          type='radio'
          id={id}
          checked={checked}
          onChange={onChange}
          className='sr-only'
        />
        <div
          className={`w-5 h-5 border ${checked ? 'border-black' : 'border-gray-300'} flex items-center justify-center`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role='radio'
          aria-checked={checked}
        >
          {checked && (
            <svg
              className='w-4 h-4 text-black'
              viewBox='0 0 20 20'
              fill='currentColor'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          )}
        </div>
      </div>
      <span className='text-xs uppercase font-medium cursor-pointer'>
        {label}
      </span>
    </label>
  );
}
