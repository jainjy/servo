import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import ServoLogo from "../components/ServoLogo";
import "../../styles/font.css";
import { Link, useNavigate } from 'react-router-dom';
import ApkDownloadModal from '../ApkDownloadModal';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const partners = [
    { name: "Olimmo Réunion", url: "/professional/89220134-7f2f-4a82-9660-1e422cad9b0d" },
    { name: "Agence Partenaire", url: "#" },
    { name: "Expert Immobilier", url: "#" },
    { name: "Banque Partenaire", url: "#" },
  ];

  const handlePartnerClick = (url: string) => {
    if (url !== "#") {
      navigate(url);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[#556B2F] to-[#6B8E23] text-white py-16 relative overflow-hidden">
      {/* Effets de fond décoratifs */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-20"></div>
      
      {/* Motifs décoratifs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#8B4513]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#556B2F]/20 rounded-full blur-3xl"></div>
      
      {/* Pattern subtil */}
      <div className="absolute inset-0 opacity-[0.02] bg-[length:40px_40px] bg-repeat" style={{
        backgroundImage: `radial-gradient(circle, #FFFFFF 1px, transparent 1px)`
      }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Colonne Logo et description - Pleine largeur sur mobile */}
          <div className="md:col-span-2 lg:col-span-4">
            <div className="mb-8">
              <Link to={"/"} className="inline-block group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0  rounded-lg"></div>
                    <ServoLogo />
                  </div>
                </div>
              </Link>
            </div>

            <div className="relative p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-[#8B4513] text-white text-xs font-bold rounded-full">
                Notre vision
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                Votre partenaire de confiance pour transformer vos rêves immobiliers en réalité. 
                Nous allions expertise, innovation et passion pour vous offrir un service d'exception.
              </p>
            </div>

            {/* Bouton d'action mobile */}
            <div className="mt-8 lg:hidden">
              <button
                onClick={() => setIsApkModalOpen(true)}
                className="w-full py-3 px-6 bg-gradient-to-r from-[#8B4513] to-[#6B8E23] hover:from-[#6B8E23] hover:to-[#556B2F] text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <img src="/google.png" alt="Google Play" className='w-6 h-6' />
                <span>Télécharger l'application</span>
              </button>
            </div>
          </div>

          {/* Colonne Partenaires */}
          <div className="md:col-span-1 lg:col-span-3">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/20 relative">
                <span className="relative">
                  Partenaires
                  <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#8B4513] rounded-full"></span>
                </span>
              </h3>
            </div>

            <div className="space-y-3">
              {partners.map((partner, index) => (
                <button
                  key={index}
                  onClick={() => handlePartnerClick(partner.url)}
                  className="group relative flex items-center justify-between py-3 px-4 hover:bg-gradient-to-r from-white/10 to-transparent rounded-xl transition-all duration-300 hover:pl-6 hover:shadow-lg w-full text-left"
                >
                  <div className="relative overflow-hidden">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#8B4513] rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="text-white/80 group-hover:text-white text-sm transition-colors duration-200 font-medium">
                        {partner.name}
                      </span>
                    </div>
                  </div>

                  <svg
                    className="w-4 h-4 text-white/60 group-hover:text-[#8B4513] transform group-hover:translate-x-1 transition-all duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Colonne Contact */}
         <div className="lg:col-span-3">
            <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b border-white/10">
              Contact
            </h3>

            <div className="space-y-6">
              {/* Adresse */}
              <div className="group flex items-start gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-[#556B2F] flex items-center justify-center border border-white/10 group-hover:border-[#8B4513]/30 transition-colors duration-200">
                    <MapPin className="w-5 h-5  text-white group-hover:text-[#8B4513] transition-colors duration-200" />
                  </div>
                </div>

                <div className="overflow-hidden flex-1">
                  <p className="text-white text-sm font-medium">123 Rue de l'Immobilier</p>
                  <p className="text-white/70 text-xs mt-1 group-hover:text-white/90 transition-colors duration-200">
                    75000 Paris
                  </p>
                </div>
              </div>

              {/* Téléphone */}
              <a href="tel:+33123456789" className="group flex items-start gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-[#556B2F] flex items-center justify-center border border-white/10 group-hover:border-[#8B4513]/30 transition-colors duration-200">
                    <Phone className="w-5 h-5 text-white group-hover:text-[#8B4513] transition-colors duration-200" />
                  </div>
                </div>

                <div className="overflow-hidden flex-1">
                  <span className="text-white/90 hover:text-[#8B4513] transition-colors duration-200 text-sm block relative overflow-hidden font-medium">
                    +33 1 23 45 67 89
                  </span>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:contact@servo.fr" className="group flex items-start gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-[#556B2F] flex items-center justify-center border border-white/10 group-hover:border-[#8B4513]/30 transition-colors duration-200">
                    <Mail className="w-5 h-5 text-white group-hover:text-[#8B4513] transition-colors duration-200" />
                  </div>
                </div>

                <div className="overflow-hidden flex-1">
                  <span className="text-white/90 hover:text-[#8B4513] transition-colors duration-200 text-sm block relative overflow-hidden font-medium">
                    contact@oliplus.fr
                  </span>
                </div>
              </a>
            </div>
          </div>


          {/* Colonne Réseaux sociaux et newsletter */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/20 relative">
              <span className="relative">
                Suivez-nous
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#8B4513] rounded-full"></span>
              </span>
            </h3>

            {/* Réseaux sociaux */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {[
                {
                  name: 'Facebook',
                  icon: 'M22 12c0-5.53-4.47-10-10-10S2 6.47 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.83c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 2.89h-2.3v6.99C18.34 21.13 22 16.99 22 12z',
                  color: 'hover:bg-blue-600',
                  url: 'https://facebook.com/servo'
                },
                {
                  name: 'Twitter',
                  icon: 'M22.46 6c-.77.35-1.5.59-2.28.69a4.02 4.02 0 001.76-2.22 7.92 7.92 0 01-2.53.97A3.98 3.98 0 0015.5 4a4 4 0 00-4 4c0 .31.04.62.1.9A11.35 11.35 0 013 5.16a3.99 3.99 0 001.24 5.35 4.187 4.187 0 01-1.8-.5v.05a4 4 0 003.21 3.92 4.06 4.06 0 01-1.79.07 4.02 4.02 0 003.75 2.8A8 8 0 012 19.54 11.28 11.28 0 007.29 21c7.55 0 11.68-6.25 11.68-11.68 0-.18-.01-.35-.02-.53A8.35 8.35 0 0022.46 6z',
                  color: 'hover:bg-sky-500',
                  url: 'https://twitter.com/servo'
                },
                {
                  name: 'LinkedIn',
                  icon: 'M4.98 3.5A2.5 2.5 0 002.5 6c0 1.38 1.13 2.5 2.48 2.5h.02c1.38 0 2.5-1.12 2.5-2.5a2.5 2.5 0 00-2.5-2.5zM3 8.5h4v11H3v-11zm7.5 0h3.68v1.56h.05c.51-.96 1.76-1.97 3.63-1.97 3.88 0 4.6 2.55 4.6 5.86v6.55H17v-5.81c0-1.39-.02-3.19-1.94-3.19-1.94 0-2.24 1.52-2.24 3.08v5.92h-4v-11z',
                  color: 'hover:bg-blue-700',
                  url: 'https://linkedin.com/company/servo'
                },
                {
                  name: 'Instagram',
                  icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                  color: 'hover:bg-pink-600',
                  url: 'https://instagram.com/servo'
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color} hover:border-transparent`}
                  aria-label={social.name}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>

            {/* Bouton APK Desktop */}
            <div className="hidden lg:block">
              <button
                onClick={() => setIsApkModalOpen(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#8B4513] to-[#6B8E23] hover:from-[#6B8E23] hover:to-[#556B2F] text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <img src="/google.png" alt="Google Play" className='w-5 h-5' />
                <span className="text-sm">Télécharger l'app</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modale de téléchargement APK */}
        <ApkDownloadModal
          isOpen={isApkModalOpen}
          onClose={() => setIsApkModalOpen(false)}
        />

        {/* Section inférieure */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-3"> 
                <div>
                  <div className="text-white/70 text-sm">
                    &copy; {currentYear} - Tous droits réservés
                  </div>
                </div>
              </div>
            </div>

            {/* Liens légaux */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              
              {[
                { to: '/cookies', label: 'Cookies' },
                { to: '/politique-confidentialite', label: 'Confidentialité' },
                { to: '/mentions-legales', label: 'Mentions légales' },
                { to: '/terms', label: 'Conditions d\'utilisation' },
                { to: '/gestion-droits-rgpd', label: 'Mes droits RGPD' },
                // { to: '/contact-dpo', label: 'Contact DPO' },
              ].map((link, index) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-white/80 hover:text-[#8B4513] transition-colors duration-300 text-sm relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B4513] group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Badge certification */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white/10 to-transparent rounded-full border border-white/20">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/90 text-sm">Agréée • Certification</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;