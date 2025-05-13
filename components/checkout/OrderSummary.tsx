import {useCart} from '@/context/CartProvider';

import {Button} from '@/components/shared/button';
import {CheckoutStep} from './CheckoutPage';
import {useState} from 'react';
import AccordionSection from '@/components/shared/Accordion';
import {FloatingLabelInput} from '@/components/shared/floatingLabelInput';
import {ProductListDesktop} from './ProductList';
import { formatPrice } from '@/lib/utils';

// Separate component for the campaign code button
export function CampaignCodeButton() {
  const [campaignCode, setCampaignCode] = useState('');

  const handleApplyCode = () => {
    if (!campaignCode.trim()) return;
    console.log('Applying campaign code:', campaignCode);

  };

  return (
    <AccordionSection
      title='LÄGG TILL KAMPANJKOD'
      defaultOpen={false}
      className='border text-sm my-3 md:my-0 border-gray-400   overflow-hidden'
      headerClassName='flex justify-between items-center p-3 cursor-pointer'
      contentClassName='p-3 space-y-3'
    >
      <FloatingLabelInput
        type='text'
        id='campaignCode'
        label='Kampanjkod'
        value={campaignCode}
        onChange={(e) => setCampaignCode(e.target.value)}
      />
      <Button
        type='button'
        variant='outline'
        className='w-full mt-2 border-gray-400 active:border-gray-600 hover:border-gray-600 shadow-none hover:bg-white'
        onClick={handleApplyCode}
      >
        Använd kod
      </Button>
    </AccordionSection>
  );
}

// Separate component for the order summary totals
export function OrderSummaryTotals() {
  const {totalPrice} = useCart();

  return (
    <div className=' space-y-2 border-t pt-4'>
      <div className='flex justify-between text-sm'>
        <span>Delsumma</span>
        <span>{totalPrice} kr</span>
      </div>
      <div className='flex justify-between text-sm'>
        <span>Frakt</span>
        <span>Gratis</span>
      </div>
      <div className='flex justify-between font-semibold pt-4 border-t'>
        <span>TOTALT</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
    </div>
  );
}

// The main OrderSummary component for desktop view
interface OrderSummaryProps {
  currentStep: CheckoutStep;
  onNext?: () => void;
}

export default function OrderSummary({currentStep, onNext}: OrderSummaryProps) {

  return (
    <div className='hidden md:block bg-white  '>
      <h2 className='text-lg font-medium mb-4'>Varukorg</h2>
      <div className='space-y-4 '>
        {/* Campaign Code Input */}
        <CampaignCodeButton />

        {/* Order Summary */}
        <OrderSummaryTotals />

        {/* Products List */}
        <div className='border-t pt-6'>
          <ProductListDesktop />
        </div>
      </div>
    </div>
  );
}
