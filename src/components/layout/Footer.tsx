import React from 'react';
import logo from '../../assets/logo.png';
import "../../styles/font.css";
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300 py-10 relative overflow-hidden group/footer">
      {/* Effets de fond animés */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-purple-900/5 to-blue-900/5 rounded-full blur-2xl group-hover/footer:scale-110 group-hover/footer:opacity-80 transition-all duration-700"></div>
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-tr from-blue-900/5 to-gray-900/5 rounded-full blur-2xl opacity-0 group-hover/footer:opacity-100 transition-all duration-1000"></div>

      {/* Effet de particules subtiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
            style={{
              left: `${10 + i * 20}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Colonne Logo et description avec animations */}
          <div className="lg:col-span-4">
            <div className="relative mb-4">
              <div className="flex items-center gap-3 group/logo">
                {/* Logo avec animation de glow au survol */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover/logo:opacity-30 transition-opacity duration-500"></div>
                  <div className="relative p-1.5 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 group-hover/logo:border-blue-500/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={logo}
                      alt="Servo Logo"
                      className="w-10 h-10 rounded-lg relative z-10 group-hover/logo:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div>
                  <h2 className="azonix text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover/logo:bg-gradient-to-r group-hover/logo:from-blue-300 group-hover/logo:to-purple-300 transition-all duration-500">
                    Servo
                  </h2>
                  <p className="text-xs text-gray-500 font-medium group-hover/logo:text-gray-400 transition-colors duration-300">
                    Excellence Immobilière
                  </p>
                </div>
                {/* Traînée d'étoiles au survol */}
                <div className="absolute -right-2 top-0 opacity-0 group-hover/logo:opacity-100 group-hover/logo:translate-x-2 transition-all duration-500">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs group-hover:text-gray-300 transition-colors duration-500 hover:pl-2 hover:border-l-2 hover:border-gradient-to-r hover:from-blue-500 hover:to-purple-500">
              Votre partenaire de confiance pour transformer vos rêves immobiliers en réalité.
            </p>
          </div>

          {/* Colonne Partenaires avec animations */}
          <div className="lg:col-span-3">
            <div className="relative mb-6">
              <h3 className="text-lg font-bold text-white group-hover:scale-105 transition-transform duration-300 inline-block">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Partenaires
                </span>
              </h3>
              <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full group-hover:h-8 group-hover:top-2 transition-all duration-300"></div>
            </div>
            
            <div className="space-y-2">
              {[
                { name: "Olimmo réunion", url: "https://www.olimmoreunion.re/" },
                { name: "Partenaire 2", url: "#" },
                { name: "Partenaire 3", url: "#" },
              ].map((partner, index) => (
                <a
                  key={index}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/partner relative flex items-center justify-between py-2 hover:pl-3 transition-all duration-300"
                >
                  {/* Animation de fond au survol */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover/partner:opacity-100 transition-opacity duration-300 -z-10"></div>
                  
                  {/* Texte avec animation de soulignement */}
                  <div className="relative overflow-hidden">
                    <span className="text-gray-400 group-hover/partner:text-white text-sm transition-colors duration-300 block transform group-hover/partner:translate-x-1">
                      {partner.name}
                    </span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover/partner:w-full transition-all duration-500"></span>
                  </div>
                  
                  {/* Icône avec animation de déplacement */}
                  <div className="relative overflow-hidden">
                    <svg 
                      className="w-4 h-4 text-gray-600 group-hover/partner:text-blue-400 transform group-hover/partner:translate-x-1 transition-all duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    {/* Double traînée d'icône */}
                    <svg 
                      className="absolute top-0 left-0 w-4 h-4 text-purple-400/0 group-hover/partner:text-purple-400/30 transform group-hover/partner:translate-x-2 transition-all duration-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Colonne Contact avec animations */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-bold text-white mb-6 group-hover:scale-105 transition-transform duration-300 inline-block">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Contact
              </span>
            </h3>
            
            <div className="space-y-4">
              {[
                {
                  icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
                  title: '123 Rue de l\'Immobilier',
                  subtitle: '75000 Paris',
                  type: 'address'
                },
                {
                  icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
                  title: '+33 1 23 45 67 89',
                  href: 'tel:+33123456789',
                  type: 'phone'
                },
                {
                  icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                  title: 'contact@immoplus.fr',
                  href: 'mailto:contact@immoplus.fr',
                  type: 'email'
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group/contact flex items-start gap-3 hover:translate-x-1 transition-transform duration-300"
                >
                  {/* Icône avec animation de pulsation */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-sm opacity-0 group-hover/contact:opacity-100 group-hover/contact:scale-125 transition-all duration-500"></div>
                    <svg 
                      className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0 relative z-10 group-hover/contact:text-blue-300 group-hover/contact:scale-110 transition-all duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon.split(' ')[0]} />
                      {item.icon.split(' ')[1] && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon.split(' ')[1]} />
                      )}
                    </svg>
                  </div>
                  
                  <div className="overflow-hidden">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm block relative overflow-hidden group/link"
                      >
                        <span className="relative inline-block">
                          {item.title}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover/link:w-full transition-all duration-500"></span>
                        </span>
                        {/* Effet de particules au survol */}
                        <span className="absolute -right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-2 transition-all duration-300">
                          <div className="flex space-x-0.5">
                            {[...Array(2)].map((_, i) => (
                              <div
                                key={i}
                                className="w-0.5 h-0.5 bg-blue-400 rounded-full"
                                style={{ animationDelay: `${i * 0.1}s` }}
                              />
                            ))}
                          </div>
                        </span>
                      </a>
                    ) : (
                      <p className="text-white text-sm">{item.title}</p>
                    )}
                    {item.subtitle && (
                      <p className="text-gray-500 text-xs group-hover/contact:text-gray-400 transition-colors duration-300">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne Réseaux sociaux avec animations */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-6 group-hover:scale-105 transition-transform duration-300 inline-block">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Suivez-nous
              </span>
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {/* Facebook */}
              <a
                href="https://facebook.com/immoplus"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/40 w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden group/facebook transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Facebook"
              >
                {/* Effet de fond animé */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover/facebook:from-white/20 group-hover/facebook:to-white/10 transition-all duration-500"></div>
                
                {/* Effet de pulsation au survol */}
                <div className="absolute inset-0 border-2 border-transparent rounded-lg group-hover/facebook:border-white/30 group-hover/facebook:animate-ping-slow transition-all duration-300"></div>
                
                {/* Icône avec animation de rotation */}
                <svg 
                  className="w-4 h-4 fill-white relative z-10 group-hover/facebook:scale-110 group-hover/facebook:rotate-12 transition-all duration-300" 
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.53-4.47-10-10-10S2 6.47 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.83c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 2.89h-2.3v6.99C18.34 21.13 22 16.99 22 12z" />
                </svg>
                
                {/* Effet de flash au survol */}
                <div className="absolute inset-0 bg-white/0 group-hover/facebook:bg-white/10 group-hover/facebook:animate-flash transition-all duration-300"></div>
              </a>

              {/* Twitter */}
              <a
                href="https://twitter.com/immoplus"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-500 hover:bg-sky-600 hover:shadow-sky-500/40 w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden group/twitter transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Twitter"
              >
                {/* Effet de fond animé */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover/twitter:from-white/20 group-hover/twitter:to-white/10 transition-all duration-500"></div>
                
                {/* Effet de pulsation au survol */}
                <div className="absolute inset-0 border-2 border-transparent rounded-lg group-hover/twitter:border-white/30 group-hover/twitter:animate-ping-slow transition-all duration-300"></div>
                
                {/* Icône avec animation de rotation */}
                <svg 
                  className="w-4 h-4 fill-white relative z-10 group-hover/twitter:scale-110 group-hover/twitter:rotate-12 transition-all duration-300" 
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.5.59-2.28.69a4.02 4.02 0 001.76-2.22 7.92 7.92 0 01-2.53.97A3.98 3.98 0 0015.5 4a4 4 0 00-4 4c0 .31.04.62.1.9A11.35 11.35 0 013 5.16a3.99 3.99 0 001.24 5.35 4.187 4.187 0 01-1.8-.5v.05a4 4 0 003.21 3.92 4.06 4.06 0 01-1.79.07 4.02 4.02 0 003.75 2.8A8 8 0 012 19.54 11.28 11.28 0 007.29 21c7.55 0 11.68-6.25 11.68-11.68 0-.18-.01-.35-.02-.53A8.35 8.35 0 0022.46 6z" />
                </svg>
                
                {/* Effet de flash au survol */}
                <div className="absolute inset-0 bg-white/0 group-hover/twitter:bg-white/10 group-hover/twitter:animate-flash transition-all duration-300"></div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/company/immoplus"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 hover:bg-blue-800 hover:shadow-blue-600/40 w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden group/linkedin transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="LinkedIn"
              >
                {/* Effet de fond animé */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover/linkedin:from-white/20 group-hover/linkedin:to-white/10 transition-all duration-500"></div>
                
                {/* Effet de pulsation au survol */}
                <div className="absolute inset-0 border-2 border-transparent rounded-lg group-hover/linkedin:border-white/30 group-hover/linkedin:animate-ping-slow transition-all duration-300"></div>
                
                {/* Icône avec animation de rotation */}
                <svg 
                  className="w-4 h-4 fill-white relative z-10 group-hover/linkedin:scale-110 group-hover/linkedin:rotate-12 transition-all duration-300" 
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5A2.5 2.5 0 002.5 6c0 1.38 1.13 2.5 2.48 2.5h.02c1.38 0 2.5-1.12 2.5-2.5a2.5 2.5 0 00-2.5-2.5zM3 8.5h4v11H3v-11zm7.5 0h3.68v1.56h.05c.51-.96 1.76-1.97 3.63-1.97 3.88 0 4.6 2.55 4.6 5.86v6.55H17v-5.81c0-1.39-.02-3.19-1.94-3.19-1.94 0-2.24 1.52-2.24 3.08v5.92h-4v-11z" />
                </svg>
                
                {/* Effet de flash au survol */}
                <div className="absolute inset-0 bg-white/0 group-hover/linkedin:bg-white/10 group-hover/linkedin:animate-flash transition-all duration-300"></div>
              </a>

            </div>
          </div>
        </div>

        {/* Section inférieure avec animations */}
        <div className="mt-8 pt-6 border-t border-gray-800 group/bottom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-xs group-hover:text-gray-400 transition-colors duration-300">
              &copy; {currentYear}{' '}
              <span className="text-white font-medium group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                Servo
              </span>
              . Tous droits réservés.
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { to: '/cookies', label: 'Cookies' },
                { to: '/confidentialite', label: 'Confidentialité' },
                { to: '/mentions_legales', label: 'Mentions légales' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group/link text-gray-500 hover:text-gray-300 transition-colors duration-300 text-xs relative"
                >
                  <span className="relative z-10">{link.label}</span>
                  {/* Effet de point animé au survol */}
                  <span className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover/link:opacity-100 group-hover/link:animate-pulse transition-opacity duration-300"></span>
                  {/* Soulignement animé */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover/link:w-full transition-all duration-500"></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;