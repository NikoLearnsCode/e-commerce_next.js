'use client';

import {Product} from '@/lib/validators';
import Cards from '@/components/products/product-grid/ProductCard';

type ProductGridProps = {
  products: Product[];
  title?: string;
  emptyMessage?: string;
  className?: string;
};

export default function ProductGrid({
  products,

  emptyMessage = 'Inga produkter tillgängliga.',
  className = '',
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-600'>{emptyMessage}</p>
      </div>
    );
  }



  return (
    <div className={className}>
      <div className='full grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid gap-1'>
        {/* // className={`w-full grid gap-1 ${ */}
        {/* //   count === 1
        //     ? 'grid-cols-1 max-w-md '
        //     : count === 2
        //       ? 'grid-cols-2  sm:grid-cols-2 max-w-4xl  '
        //       : count === 3
        //         ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 max-w-7xl '
        //         : count === 4
        //           ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        //           : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        // }`} */}
        {/* > */}
        {products.map((product) => (
          <Cards key={product.id} product={product} priorityLoading={true} />
        ))}
      </div>
    </div>
  );
}
