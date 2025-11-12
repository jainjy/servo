import { Suspense } from 'react';
import DevisContent from './DevisContent';

export default function DevisPage() {
  return (
    <Suspense fallback={<div className='flex flex-col gap-4'>
      <img src="/loading.gif" alt="" className='w-24 h-24'/>
      Chargement...</div>}>
      <DevisContent />
    </Suspense>
  );
}