import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Ouvrir le modal
      const tl = gsap.timeline();
      
      tl.set(containerRef.current, { display: 'flex' })
        .fromTo(overlayRef.current, 
          { opacity: 0 },
          { opacity: 1, duration: 0.1, ease: "none" }
        )
        .fromTo(modalRef.current,
          { y: '100%' },
          { y: 0, duration: 0.1, ease: "none" }, 
          "" // Commence un peu avant la fin de l'animation précédente
        );

    } else if (containerRef.current) {
      // Fermer le modal
      const tl = gsap.timeline();
      
      tl.to(modalRef.current,
        { y: '100%', duration: 0.1, ease: "none" }
      )
      .to(overlayRef.current,
        { opacity: 0, duration: 0.1, ease: "none" },
        "" // Chevauchement avec l'animation du modal
      )
      .set(containerRef.current, { display: 'none' });
    }
  }, [isOpen]);

  // Masquer initialement
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.display = 'none';
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-end"
    >
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className="relative z-50 w-full bg-white shadow-2xl rounded-t-lg rounded-s-lg"
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-gray-500 hover:text-gray-700 
                   hover:bg-gray-100 rounded-full transition-all duration-200 
                   transform hover:scale-110"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
        
        {/* Contenu */}
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;