import { Suspense } from 'react';
import DevisContent from './DevisContent';

export default function DevisPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <DevisContent />
    </Suspense>
  );
}