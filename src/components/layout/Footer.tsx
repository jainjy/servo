import React from 'react';
import logo from '../../assets/logo.png';
import "../../styles/font.css";
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container w-full flex flex-col md:flex-row justify-between">
        <div className='lg:pb-0 pb-4 flex flex-col gap-2'>
          {/* Titre */}
          <h1 className="text-3xl lg:text-2xl font-bold text-gray-400 ">
            Nos <span className="bg-white  bg-clip-text text-transparent">Partenaires</span>
          </h1>

          {/* Liste des partenaires */}
          <div className='ml-4 flex-col grid grid-cols-2 lg:flex  max-w-md mx-auto w-full'>
            <div className='relative group cursor-pointer'>
              <span className="text-gray-300 text-lg font-medium py-2 block group-hover:text-gray-100 transition-colors duration-300">
                Partenaire 1
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-100 to-purple-100 group-hover:w-1/2 transition-all duration-300"></div>
            </div>

            <div className='relative group cursor-pointer'>
              <span className="text-gray-300 text-lg font-medium py-2 block group-hover:text-gray-100 transition-colors duration-300">
                Partenaire 2
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-100 to-purple-100 group-hover:w-1/2 transition-all duration-300"></div>
            </div>

            <div className='relative group cursor-pointer'>
              <span className="text-gray-300 text-lg font-medium py-2 block group-hover:text-gray-100 transition-colors duration-300">
                Partenaire 3
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-100 to-purple-100 group-hover:w-1/2 transition-all duration-300"></div>
            </div>

            <div className='relative group cursor-pointer'>
              <span className="text-gray-300 text-lg font-medium py-2 block group-hover:text-gray-100 transition-colors duration-300">
                Partenaire 4
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-100 to-purple-100 group-hover:w-1/2 transition-all duration-300"></div>
            </div>

            <div className='relative group cursor-pointer'>
              <span className="text-gray-300 text-lg font-medium py-2 block group-hover:text-gray-100 transition-colors duration-300">
                Partenaire 5
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-100 to-purple-100 group-hover:w-1/2 transition-all duration-300"></div>
            </div>

            <div className='relative group cursor-pointer'>
              <span className="text-gray-300 text-lg font-medium py-2 block group-hover:text-gray-100 transition-colors duration-300">
                Partenaire 6
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-100 to-purple-100 group-hover:w-1/2 transition-all duration-300"></div>
            </div>
          </div>
        </div>
        {/* Logo et description */}

        <div className="mb-8 md:mb-0 md:w-1/3">
          <div className='flex gap-4 items-center mb-4'>
            <div className="p-1 w-12 rounded-full bg-black border-black border-2">
              {/* Remplacement de <Image> par <img> */}
              <img
                src={logo}
                alt="Servo Logo"
                className="w-10 h-10 rounded-full"
              />
            </div>
            <h2 className="text-2xl azonix font-bold text-white ">Servo</h2>
          </div>
          <p className="text-gray-400">
            Votre partenaire de confiance pour trouver le bien immobilier de vos rêves.
          </p>
        </div>

        {/* Contacts et réseaux sociaux */}
        <div className="">
          <h3 className="font-semibold text-white mb-3">Contact</h3>
          <p>123 Rue de l'Immobilier</p>
          <p>75000 Paris, France</p>
          <p>Tél : <a href="tel:+33123456789" className="hover:text-white">+33 1 23 45 67 89</a></p>
          <p>Email : <a href="mailto:contact@immoplus.fr" className="hover:text-white">contact@immoplus.fr</a></p>

          <div className="flex mt-4 space-x-4">
            {/* Icônes de réseaux sociaux (SVG) - Inchangé */}
            <a href="https://facebook.com/immoplus" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.53-4.47-10-10-10S2 6.47 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.83c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 2.89h-2.3v6.99C18.34 21.13 22 16.99 22 12z" /></svg>
            </a>
            <a href="https://twitter.com/immoplus" aria-label="Twitter" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.5.59-2.28.69a4.02 4.02 0 001.76-2.22 7.92 7.92 0 01-2.53.97A3.98 3.98 0 0015.5 4a4 4 0 00-4 4c0 .31.04.62.1.9A11.35 11.35 0 013 5.16a3.99 3.99 0 001.24 5.35 4.187 4.187 0 01-1.8-.5v.05a4 4 0 003.21 3.92 4.06 4.06 0 01-1.79.07 4.02 4.02 0 003.75 2.8A8 8 0 012 19.54 11.28 11.28 0 007.29 21c7.55 0 11.68-6.25 11.68-11.68 0-.18-.01-.35-.02-.53A8.35 8.35 0 0022.46 6z" /></svg>
            </a>
            <a href="https://linkedin.com/company/immoplus" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5A2.5 2.5 0 002.5 6c0 1.38 1.13 2.5 2.48 2.5h.02c1.38 0 2.5-1.12 2.5-2.5a2.5 2.5 0 00-2.5-2.5zM3 8.5h4v11H3v-11zm7.5 0h3.68v1.56h.05c.51-.96 1.76-1.97 3.63-1.97 3.88 0 4.6 2.55 4.6 5.86v6.55H17v-5.81c0-1.39-.02-3.19-1.94-3.19-1.94 0-2.24 1.52-2.24 3.08v5.92h-4v-11z" /></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Servo. Tous droits réservés.
        <Link
          to="/cookies"
          className="ml-4 underline text-slate-400 hover:text-white transition"
        >
          Cookies
        </Link>
      </div>



    </footer>
  );
};

export default Footer;