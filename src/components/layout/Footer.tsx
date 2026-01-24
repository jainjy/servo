import React, { useState } from "react";
import ServoLogo from "../components/ServoLogo";
import "../../styles/font.css";
import { Link, useNavigate } from "react-router-dom";
import ApkDownloadModal from "../ApkDownloadModal";
import { MapPin, Phone, Mail, Download, ChevronRight } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  const partners = [
    {
      name: "Olimmo Réunion",
      url: "/professional/2ae50d32-7ec3-4de4-89f0-21218a953cf0",
      logo: "/olimmo.png",
    },
    {
      name: "Guy Hoquet Réunion - Saint-Denis",
      url: "/professional/f716640c-04e6-4eb0-9cd7-690208f011cb",
      logo: "/Reunion.png",
    },
    // {
    //   name: "Expert Immobilier",
    //   url: "#",
    //   logo: "/expert.jpg",
    // },
    // {
    //   name: "Banque Partenaire",
    //   url: "#",
    //   logo: "/banque.png",
    // },
  ];

  const handlePartnerClick = (url: string) => {
    if (url !== "#") {
      navigate(url);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[#556B2F] to-[#6B8E23] text-white py-4 relative overflow-hidden">
      {/* Effets de fond très subtils */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-[#8B4513]/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#556B2F]/10 rounded-full blur-xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Contenu principal - Ultra compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Colonne Logo et description */}
          <div className="md:col-span-2 lg:col-span-4">
            <div className="mb-2">
              <Link to={"/"}>
                <ServoLogo />
              </Link>
            </div>

            <p className="text-white/80 text-xs leading-relaxed mb-2">
              Votre partenaire de confiance pour transformer vos rêves
              immobiliers en réalité.
            </p>

            {/* Bouton Télécharger */}
            <button
              onClick={() => setIsApkModalOpen(true)}
              className="py-1.5 px-3 bg-gradient-to-r from-[#8B4513] to-[#6B8E23] hover:from-[#6B8E23] hover:to-[#556B2F] text-white rounded-lg font-medium flex items-center gap-1.5 text-xs transition-all duration-200 hover:shadow-sm"
            >
              <Download className="w-3 h-3" />
              <span>Télécharger l'app</span>
            </button>
          </div>

          {/* Colonne Partenaires */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold text-white mb-2">
              Partenaires
            </h3>

            <div className="space-y-0.5">
              {partners.map((partner, index) => (
                <button
                  key={index}
                  onClick={() => handlePartnerClick(partner.url)}
                  className="group flex items-center justify-between py-1 px-1 hover:bg-white/5 rounded w-full text-left transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-[#8B4513] rounded-full flex-shrink-0"></div>
                    <span className="text-white/70 text-xs truncate">
                      {partner.name}
                    </span>
                  </div>
                  <ChevronRight className="w-2.5 h-2.5 text-white/40 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Colonne Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold text-white mb-2">Contacts</h3>

            <div className="space-y-1.5">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3 h-3 text-white/70 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white text-xs">
                    45 rue monseigneur de Beaumont
                  </p>
                  <p className="text-white/60 text-xs">Saint Denis</p>
                </div>
              </div>

              <a
                href="tel:+262 692 66 77 55"
                className="flex items-center gap-1.5 group"
              >
                <Phone className="w-3 h-3 text-white/70 flex-shrink-0" />
                <span className="text-white/80 text-xs group-hover:text-white transition-colors">
                  +262 692 66 77 55
                </span>
              </a>

              <a
                href="mailto:contact@oliplus.fr"
                className="flex items-center gap-1.5 group"
              >
                <Mail className="w-3 h-3 text-white/70 flex-shrink-0" />
                <span className="text-white/80 text-xs group-hover:text-white transition-colors">
                  contact@oliplus.re
                </span>
              </a>
            </div>
          </div>

          {/* Colonne Réseaux sociaux */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="text-xs font-semibold text-white mb-2">
              Suivez-nous
            </h3>

            <div className="grid grid-cols-4 gap-1">
              {[
                {
                  name: "Facebook",
                  color: "bg-[#1877F2]",
                  icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                  url: "https://www.facebook.com/profile.php?id=61587021448271"
                },
                {
                  name: "WhatsApp",
                  color: "bg-[#25D366]",
                  icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411",
                  url: "https://wa.me/262692667755"

                },
                {
                  name: "Instagram",
                  color: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
                  icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
                  url: "https://instagram.com/#"
                },
                {
                  name: "LinkedIn",
                  color: "bg-[#0077B5]",
                  icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                  url: "https://linkedin.com/company/#"
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-6 h-6 rounded ${social.color} flex items-center justify-center transition-all duration-150 hover:opacity-90`}
                  aria-label={social.name}
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Partenaires logos - Ultra compact */}
        <div className="mt-3 pt-2 border-t border-white/10">
          <h3 className="text-xs font-semibold text-white/90 mb-1.5 text-center">
            Partenaires officiels
          </h3>
          <div className="flex justify-center items-center gap-3 max-w-2xl mx-auto">
            {partners.map((partner, index) => (
              <button
                key={index}
                onClick={() => handlePartnerClick(partner.url)}
                className="group p-2 bg-black/10 backdrop-blur-sm rounded border border-white/20 hover:border-[#8B4513]/50 hover:bg-black/20 transition-all duration-200 flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded border border-white/15 overflow-hidden group-hover:bg-white/15 transition-all">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-full object-contain p-1 opacity-90 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="text-sm font-bold text-[#8B4513]">
                            ${partner.name.split(" ")[0].charAt(0)}
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
                <span className="text-white/80 text-xs text-center font-medium max-w-[80px]">
                  {partner.name.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Section inférieure - Minimaliste */}
          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-1">
              <div className="text-white/60 text-[10px] order-2 md:order-1">
                &copy; {currentYear} - Tous droits réservés
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1 order-1 md:order-2 mb-1 md:mb-0">
                {["Cookies", "Confidentialité", "Mentions-legales", "CGU", "RGPD"].map(
                  (label) => (
                    <Link
                      key={label}
                      to={`/${label.toLowerCase().replace("é", "e")}`}
                      className="text-white/60 hover:text-[#8B4513] text-[10px] transition-colors px-0.5"
                    >
                      {label}
                    </Link>
                  )
                )}
              </div>

              <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white/5 rounded-full border border-white/10 order-3">
                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                <span className="text-white/70 text-[10px]">
                  Agréée.Certification
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modale */}
        <ApkDownloadModal
          isOpen={isApkModalOpen}
          onClose={() => setIsApkModalOpen(false)}
        />
      </div>
    </footer>
  );
};

export default Footer;
