// components/ProfessionalCategory.tsx - VERSION CORRIGÉE
import React, { useState, useEffect } from "react";
import { Users, Mail, Phone, Search, MapPin } from "lucide-react";
import api from "@/lib/api";

interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  commercialName?: string;
  city?: string;
  zipCode?: string;
  avatar?: string;
  createdAt: string;
  metiers?: Array<{ metier: { id: number; libelle: string } }>;
}

interface ProfessionalCategoryProps {
  category: 'agences' | 'constructeurs' | 'plombiers' | string;
  title: string;
  description: string;
  bannerImage?: string;
}

const ProfessionalCategory: React.FC<ProfessionalCategoryProps> = ({
  category,
  title,
  description,
  bannerImage = 'https://i.pinimg.com/1200x/dd/79/fc/dd79fc2ab5b5d1da2508125a66687c82.jpg'
}) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        let endpoint = `/pro/${category}`;
        const params = new URLSearchParams();
        
        if (cityFilter) params.append('city', cityFilter);
        
        const queryString = params.toString();
        if (queryString) {
          endpoint += `?${queryString}`;
        }
        
        const res = await api.get(endpoint);
        if (res.data.success) {
          setProfessionals(res.data.data);
        }
      } catch (error) {
        console.error(`Erreur API ${category}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfessionals();
  }, [category, cityFilter]);

  const getName = (p: Professional) =>
    p.firstName && p.lastName
      ? `${p.firstName} ${p.lastName}`
      : p.commercialName || p.companyName || "Professionnel";

  const getJob = (p: Professional) =>
    p.metiers?.[0]?.metier.libelle ||
    p.companyName ||
    p.commercialName ||
    "Métier non spécifié";

  // Filtrer localement pour la recherche
  const filteredProfessionals = professionals.filter((p) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      getName(p).toLowerCase().includes(searchLower) ||
      getJob(p).toLowerCase().includes(searchLower) ||
      p.email.toLowerCase().includes(searchLower) ||
      (p.city && p.city.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div style={{
      backgroundColor: "#FFFFFF",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      marginTop: "40px"
    }}>
      {/* Contenu principal */}
      <main style={{
        padding: "40px",
        maxWidth: 1400,
        margin: "0 auto"
      }}>
        
        {/* Bannière */}
        <div style={{
          width: "100%",
          height: 200,
          backgroundImage: `url('${bannerImage}')`, 
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 20,
          padding: "32px 40px",
          boxShadow: `0 8px 30px #D3D3D330`,
          border: `1px solid #D3D3D3`,
          marginBottom: 48,
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Overlay sombre pour améliorer la lisibilité */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 1
          }} />
          
          <div style={{ position: "relative", zIndex: 2 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 700,
              color: "white",
              marginBottom: 16,
              textAlign: "center",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)"
            }}>
              {title}
            </h2>
            <p style={{
              color: "white",
              fontSize: 16,
              textAlign: "center",
              maxWidth: 800,
              margin: "0 auto",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)"
            }}>
              {description}
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div style={{
          backgroundColor: "white",
          padding: "24px 32px",
          borderRadius: 16,
          boxShadow: `0 4px 20px #D3D3D320`,
          border: `1px solid #D3D3D3`,
          marginBottom: 32
        }}>
          <div style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center"
          }}>
            {/* Recherche par nom/métier/email */}
            <div style={{ flex: 1, minWidth: 300 }}>
              <div style={{ position: "relative" }}>
                <Search size={22} style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6B8E23"
                }} />
                <input
                  type="text"
                  placeholder="Nom, métier, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: "14px 20px 14px 48px",
                    width: "100%",
                    borderRadius: 12,
                    border: `2px solid #D3D3D3`,
                    fontSize: 15,
                    outline: "none",
                    transition: "all 0.3s",
                    backgroundColor: "white"
                  }}
                />
              </div>
            </div>
            
            {/* Filtre par ville */}
            <div style={{ minWidth: 200 }}>
              <div style={{ position: "relative" }}>
                <MapPin size={18} style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6B8E23"
                }} />
                <input
                  type="text"
                  placeholder="Ville..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  style={{
                    padding: "14px 20px 14px 42px",
                    width: "100%",
                    borderRadius: 12,
                    border: `2px solid #D3D3D3`,
                    fontSize: 15,
                    outline: "none",
                    transition: "all 0.3s",
                    backgroundColor: "white"
                  }}
                />
              </div>
            </div>
            
            
          </div>
        </div>

        {/* Compteur de résultats */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 16
        }}>
          <div style={{
            fontSize: 16,
            color: "#8B4513",
            padding: "10px 20px",
            backgroundColor: "#8B451310",
            borderRadius: 20,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 10
          }}>
            <Users size={18} />
            {filteredProfessionals.length} {title.toLowerCase()}
            {searchTerm && ` pour "${searchTerm}"`}
          </div>
        </div>

        {/* Contenu */}
        {loading ? (
          <div style={{
            textAlign: "center",
            padding: 60,
            color: "#8B4513"
          }}>
            <div style={{
              width: 50,
              height: 50,
              border: `4px solid #D3D3D3`,
              borderTopColor: "#6B8E23",
              borderRadius: "50%",
              margin: "0 auto 20px",
              animation: "spin 1s linear infinite"
            }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            Chargement des {title.toLowerCase()}...
          </div>
        ) : (
          <>
            {/* Grille des cartes */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: 32
            }}>
              {filteredProfessionals.map((p) => (
                <ProfessionalCard key={p.id} professional={p} />
              ))}
            </div>

            {filteredProfessionals.length === 0 && !loading && (
              <NoResults 
                searchTerm={searchTerm}
                onReset={() => {
                  setSearchTerm("");
                  setCityFilter("");
                }}
                title={title}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

// Composant Carte Professionnel
const ProfessionalCard: React.FC<{ professional: Professional }> = ({ professional }) => {
  const theme = {
    logo: "#556B2F",
    primaryDark: "#6B8E23",
    separator: "#D3D3D3",
    secondaryText: "#8B4513"
  };

  const getName = () =>
    professional.firstName && professional.lastName
      ? `${professional.firstName} ${professional.lastName}`
      : professional.commercialName || professional.companyName || "Professionnel";

  const getJob = () =>
    professional.metiers?.[0]?.metier.libelle ||
    professional.companyName ||
    professional.commercialName ||
    "Métier non spécifié";

  const handleClick = () => {
    window.location.href = `/professional/${professional.id}`;
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: "white",
        borderRadius: 24,
        padding: "24px 28px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        cursor: "pointer",
        alignItems: "center",
        boxShadow: `0 8px 30px ${theme.separator}40`,
        border: `1px solid ${theme.separator}`,
        transition: "all 0.3s ease",
        height: 220
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = `0 20px 40px ${theme.separator}60`;
        e.currentTarget.style.borderColor = theme.primaryDark;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = `0 8px 30px ${theme.separator}40`;
        e.currentTarget.style.borderColor = theme.separator;
      }}
    >
      {/* Décoration */}
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 120,
        height: 120,
        background: `linear-gradient(135deg, ${theme.primaryDark}20, ${theme.logo}20)`,
        borderRadius: "0 24px 0 100px"
      }} />

      {/* Avatar */}
      <div style={{
        position: "relative",
        zIndex: 5,
        marginRight: 24,
        flexShrink: 0
      }}>
        <div style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: `4px solid ${theme.logo}`,
          padding: 3,
          background: "white",
          overflow: "hidden"
        }}>
          {professional.avatar ? (
            <img
              src={professional.avatar}
              alt={getName()}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const initial = document.createElement("div");
                  initial.style.width = "100%";
                  initial.style.height = "100%";
                  initial.style.display = "flex";
                  initial.style.alignItems = "center";
                  initial.style.justifyContent = "center";
                  initial.style.backgroundColor = theme.primaryDark;
                  initial.style.color = "white";
                  initial.style.fontSize = "32px";
                  initial.style.fontWeight = "bold";
                  initial.textContent = professional.firstName?.[0]?.toUpperCase() || professional.companyName?.[0]?.toUpperCase() || "P";
                  parent.appendChild(initial);
                }
              }}
            />
          ) : (
            <div style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.primaryDark,
              color: "white",
              fontSize: "32px",
              fontWeight: "bold"
            }}>
              {professional.firstName?.[0]?.toUpperCase() || professional.companyName?.[0]?.toUpperCase() || "P"}
            </div>
          )}
        </div>
      </div>

      {/* Informations */}
      <div style={{ flex: 1, zIndex: 5 }}>
        <h2 style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 8,
          color: theme.secondaryText
        }}>
          {getName()}
        </h2>

        <div style={{
          fontSize: 14,
          color: theme.primaryDark,
          marginBottom: 12,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <div style={{
            width: 8,
            height: 8,
            backgroundColor: theme.logo,
            borderRadius: "50%"
          }} />
          {getJob()}
        </div>

        {/* Métiers */}
        {professional.metiers && professional.metiers.length > 1 && (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 12
          }}>
            {professional.metiers.slice(0, 3).map((m, index) => (
              <span key={index} style={{
                fontSize: 11,
                backgroundColor: `${theme.logo}20`,
                color: theme.logo,
                padding: "2px 8px",
                borderRadius: 12,
                fontWeight: 500
              }}>
                {m.metier.libelle}
              </span>
            ))}
            {professional.metiers.length > 3 && (
              <span style={{
                fontSize: 11,
                backgroundColor: `${theme.separator}50`,
                color: "#666",
                padding: "2px 8px",
                borderRadius: 12,
                fontWeight: 500
              }}>
                +{professional.metiers.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Contact */}
        <div style={{ fontSize: 13, lineHeight: "20px", color: "#555" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Phone size={12} color={theme.primaryDark} />
            <span>{professional.phone || "Téléphone non renseigné"}</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Mail size={12} color={theme.logo} />
            <span style={{ wordBreak: "break-word" }}>{professional.email}</span>
          </div>
          
          {professional.city && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={12} color={theme.secondaryText} />
              <span>{professional.city}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant Aucun résultat
const NoResults: React.FC<{ searchTerm: string; onReset: () => void; title: string }> = ({
  searchTerm,
  onReset,
  title
}) => (
  <div style={{
    textAlign: "center",
    padding: "60px 20px",
    color: "#8B4513",
    backgroundColor: "white",
    borderRadius: 20,
    boxShadow: `0 4px 20px #D3D3D330`,
    border: `1px solid #D3D3D3`
  }}>
    <Users size={64} style={{ marginBottom: 20, opacity: 0.5 }} />
    <h3 style={{ fontSize: 24, marginBottom: 12, color: "#8B4513" }}>
      Aucun {title.toLowerCase()} trouvé
    </h3>
    <p style={{ color: "#6B8E23", fontSize: 16, marginBottom: 24 }}>
      {searchTerm
        ? `Aucun résultat ne correspond à votre recherche "${searchTerm}"`
        : `Aucun ${title.toLowerCase()} n'est actuellement disponible`}
    </p>
    <button
      onClick={onReset}
      style={{
        padding: "12px 24px",
        backgroundColor: "#556B2F",
        color: "white",
        border: "none",
        borderRadius: 12,
        fontSize: 16,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.3s"
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6B8E23"}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#556B2F"}
    >
      Voir tous les {title.toLowerCase()}
    </button>
  </div>
);

export default ProfessionalCategory;