import type {Metadata} from 'next';
import {getInitialProducts} from '@/actions/product';
import SearchInfiniteScroll from '@/components/products/product-grid/SearchInfinitePagination';

type Props = {
  searchParams: Promise<{q?: string}>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const {q = ''} = await searchParams;

  return {
    title: q ? `Sökresultat för "${q}" | NC` : 'Sök produkter | NC',
    description: q
      ? `Se våra produkter som matchar "${q}"`
      : 'Sök bland vårt sortiment av produkter',
  };
}

export default async function SearchPage({searchParams}: Props) {
  const {q = ''} = await searchParams;

  const result = q
    ? await getInitialProducts({
        query: q,
        limit: 8,
      })
    : {products: [], hasMore: false, totalCount: 0};

  console.log('FROM SSR', result);

  return (
    <div className='w-full flex justify-center py-4'>
      <div className='w-full'>
        <SearchInfiniteScroll
          query={q}
          initialHasMore={result.hasMore}
          initialProducts={result.products}
          totalCount={result.totalCount}
        />
      </div>
    </div>
  );
}
