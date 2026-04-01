// MesAnnoncesPage.tsx
// Page de gestion des annonces immobilières pour particulier (role: user)
//
// Routes backend utilisées :
//   GET    /properties/user/:userId?status=all         → liste des annonces
//   GET    /properties/stats?userId=xxx                → statistiques
//   PATCH  /properties/:id                             → changer statut / dépublier / vendu / loué
//   DELETE /properties/:id                             → supprimer
//   GET    /demandes/immobilier/property/:propertyId   → demandes de visite d'un bien
//   PATCH  /demandes/immobilier/:id/statut             → valider / refuser une demande
//   DELETE /demandes/immobilier/:id                    → supprimer une demande

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Plus, Search, Eye, Heart, Edit, Trash2, Archive,
  MapPin, Ruler, Clock, CheckCircle, X, ChevronLeft,
  ChevronRight, Loader2, MoreVertical, Images, AlertCircle,
  Crown, ArrowRight, Lock, BedDouble, Bath, RefreshCw,
  Building2, Phone, Mail, Calendar, User, MessageSquare,
  Sparkles, TrendingUp, Bell,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import AuthService from "@/services/authService";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_BIEN: Record<string, string> = {
  house: "Maison / Villa", apartment: "Appartement", villa: "Villa",
  land: "Terrain", studio: "Studio", commercial: "Local commercial",
  professionnel: "Local professionnel", fonds_de_commerce: "Fonds de commerce",
  appartements_neufs: "Appt. neufs (VEFA)", scpi: "SCPI",
  villa_d_exception: "Villa d'exception", villas_neuves: "Villas neuves (VEFA)",
  parking: "Parking", hotel: "Hôtel", gite: "Gîte",
  maison_d_hote: "Maison d'hôte", domaine: "Domaine",
  appartement_meuble: "Appt. meublé", villa_meuble: "Villa meublée",
  villa_non_meuble: "Villa non meublée", cellier: "Cellier", cave: "Cave",
};

const LISTING_TYPE: Record<string, string> = {
  sale: "Vente", rent: "Location", both: "Vente & Location",
};

const STATUT_CONFIG: Record<string, { label: string; dot: string; pill: string }> = {
  pending:  { label: "Brouillon",        dot: "bg-amber-400",   pill: "bg-amber-50 text-amber-700 border-amber-200"    },
  for_sale: { label: "À vendre",         dot: "bg-emerald-400", pill: "bg-emerald-50 text-emerald-700 border-emerald-200"},
  for_rent: { label: "À louer",          dot: "bg-violet-400",  pill: "bg-violet-50 text-violet-700 border-violet-200"  },
  sold:     { label: "Vendu",            dot: "bg-stone-400",   pill: "bg-stone-100 text-[#8B4513] border-stone-200"    },
  rented:   { label: "Loué",             dot: "bg-stone-400",   pill: "bg-stone-100 text-[#8B4513] border-stone-200"    },
  both:     { label: "Vente & Location", dot: "bg-blue-400",    pill: "bg-blue-50 text-blue-700 border-blue-200"        },
};

const STATUT_DEMANDE: Record<string, { label: string; color: string }> = {
  "en attente": { label: "En attente",  color: "bg-amber-100 text-amber-700"   },
  "validée":    { label: "Validée",     color: "bg-emerald-100 text-emerald-700" },
  "refusée":    { label: "Refusée",     color: "bg-red-100 text-red-700"        },
  "archivée":   { label: "Archivée",    color: "bg-stone-100 text-[#8B4513]"    },
  "terminée":   { label: "Terminée",    color: "bg-blue-100 text-blue-700"      },
};

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Property {
  id: string;
  title: string;
  type: string;
  status: string;
  price: number;
  surface: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  city: string;
  images: string[];
  listingType: string;
  rentType?: string;
  views: number;
  favorites?: any[];
  createdAt: string;
  publishedAt?: string;
  features: string[];
  socialLoan?: boolean;
  isSHLMR?: boolean;
  socialType?: string;
  socialTypeLabel?: string;
}

interface Demande {
  id: number;
  statut: string;
  description?: string;
  contactNom: string;
  contactPrenom: string;
  contactEmail: string;
  contactTel: string;
  dateSouhaitee?: string;
  heureSouhaitee?: string;
  createdAt: string;
  propertyId: string;
  property?: any;
}

interface Stats {
  total: number;
  published: number;
  pending: number;
  archived: number;
  totalViews: number;
  avgViews: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK : vérification abonnement
// ─────────────────────────────────────────────────────────────────────────────

const useSubscriptionCheck = () => {
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/subscriptions/my-subscription");
        const sub = res.data?.subscription;
        const valid =
          sub &&
          sub.status === "active" &&
          sub.endDate &&
          new Date(sub.endDate) > new Date() &&
          (sub.plan?.planType?.includes("immobilier") ||
            sub.plan?.professionalCategory?.includes("real-estate") ||
            sub.plan?.planType?.includes("immobilier_vente_user"));
        setHasSubscription(!!valid);
      } catch {
        setHasSubscription(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { hasSubscription, loading };
};

// ─────────────────────────────────────────────────────────────────────────────
// MODAL GALERIE
// ─────────────────────────────────────────────────────────────────────────────

const GalerieModal: React.FC<{ property: Property; onClose: () => void }> = ({
  property, onClose,
}) => {
  const [idx, setIdx] = useState(0);
  const imgs = property.images ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-[#6B8E23] leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              {property.title}
            </h3>
            <p className="sans text-xs text-[#8B4513] mt-0.5">{imgs.length} photo(s)</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-[#8B4513]" />
          </button>
        </div>

        {imgs.length === 0 ? (
          <div className="sans flex flex-col items-center justify-center py-16 text-[#8B4513]">
            <Images className="h-12 w-12 mb-3 text-[#8B4513]" />
            <p className="text-sm">Aucune image disponible</p>
          </div>
        ) : (
          <div className="p-4">
            <div className="relative bg-stone-100 rounded-2xl overflow-hidden mb-3" style={{ aspectRatio: "16/9" }}>
              <img src={imgs[idx]} alt="" className="w-full h-full object-cover" />
              {imgs.length > 1 && (
                <>
                  <button onClick={() => setIdx((p) => (p === 0 ? imgs.length - 1 : p - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow transition-all">
                    <ChevronLeft className="h-4 w-4 text-[#6B8E23]" />
                  </button>
                  <button onClick={() => setIdx((p) => (p === imgs.length - 1 ? 0 : p + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow transition-all">
                    <ChevronRight className="h-4 w-4 text-[#6B8E23]" />
                  </button>
                  <span className="sans absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                    {idx + 1} / {imgs.length}
                  </span>
                </>
              )}
            </div>
            {imgs.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {imgs.map((img, i) => (
                  <button key={i} onClick={() => setIdx(i)}
                    className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      i === idx ? "border-amber-400 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MODAL DEMANDES DE VISITE
// GET /demandes/immobilier/property/:propertyId
// PATCH /demandes/immobilier/:id/statut
// DELETE /demandes/immobilier/:id
// ─────────────────────────────────────────────────────────────────────────────

const DemandesModal: React.FC<{ property: Property; onClose: () => void }> = ({
  property, onClose,
}) => {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchDemandes = useCallback(async () => {
    setLoading(true);
    try {
      // ── Route exacte : GET /demandes/immobilier/property/:propertyId ──
      const res = await api.get(`/demandes/immobilier/property/${property.id}`);
      setDemandes(res.data ?? []);
    } catch (err) {
      console.error("Erreur chargement demandes:", err);
      toast.error("Impossible de charger les demandes");
    } finally {
      setLoading(false);
    }
  }, [property.id]);

  useEffect(() => { fetchDemandes(); }, [fetchDemandes]);

  // ── PATCH /demandes/immobilier/:id/statut ──
  const handleStatut = async (id: number, statut: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/demandes/immobilier/${id}/statut`, { statut });
      toast.success(`Demande ${statut}`);
      fetchDemandes();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setUpdatingId(null);
    }
  };

  // ── DELETE /demandes/immobilier/:id ──
  const handleDelete = async (id: number) => {
    if (!window.confirm("Archiver cette demande ?")) return;
    setUpdatingId(id);
    try {
      await api.delete(`/demandes/immobilier/${id}`);
      toast.success("Demande archivée");
      fetchDemandes();
    } catch {
      toast.error("Erreur lors de l'archivage");
    } finally {
      setUpdatingId(null);
    }
  };

  const pending  = demandes.filter((d) => d.statut === "en attente");
  const validated = demandes.filter((d) => d.statut === "validée");
  const others   = demandes.filter((d) => !["en attente", "validée"].includes(d.statut));

  const Section: React.FC<{ title: string; items: Demande[]; accent: string }> = ({ title, items, accent }) =>
    items.length === 0 ? null : (
      <div className="mb-5">
        <p className={`sans text-xs font-bold uppercase tracking-widest mb-2 ${accent}`}>{title}</p>
        <div className="space-y-3">
          {items.map((d) => {
            const cfg = STATUT_DEMANDE[d.statut] ?? { label: d.statut, color: "bg-stone-100 text-[#8B4513]" };
            const isLoading = updatingId === d.id;
            return (
              <div key={d.id} className="bg-white border border-stone-100 rounded-2xl p-4 hover:border-amber-100 transition-colors">
                {/* Header demande */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-[#6B8E23]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#6B8E23] text-sm leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                        {d.contactPrenom} {d.contactNom}
                      </p>
                      <p className="sans text-xs text-[#8B4513]">
                        {new Date(d.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <span className={`sans text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>

                {/* Contacts */}
                <div className="sans space-y-1.5 mb-3">
                  <a href={`mailto:${d.contactEmail}`}
                    className="flex items-center gap-2 text-xs text-[#6B8E23] hover:text-amber-600 transition-colors">
                    <Mail className="h-3 w-3 flex-shrink-0" />{d.contactEmail}
                  </a>
                  <a href={`tel:${d.contactTel}`}
                    className="flex items-center gap-2 text-xs text-[#6B8E23] hover:text-amber-600 transition-colors">
                    <Phone className="h-3 w-3 flex-shrink-0" />{d.contactTel}
                  </a>
                  {d.dateSouhaitee && (
                    <p className="flex items-center gap-2 text-xs text-[#6B8E23]">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      {new Date(d.dateSouhaitee).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      {d.heureSouhaitee && ` · ${d.heureSouhaitee}`}
                    </p>
                  )}
                </div>

                {/* Description */}
                {d.description && (
                  <p className="sans text-xs text-[#6B8E23] italic bg-stone-50 rounded-xl px-3 py-2 mb-3 line-clamp-2">
                    {d.description}
                  </p>
                )}

                {/* Actions */}
                {d.statut === "en attente" && (
                  <div className="flex gap-2">
                    <button onClick={() => handleStatut(d.id, "validée")} disabled={isLoading}
                      className="sans flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50">
                      {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                      Valider
                    </button>
                    <button onClick={() => handleStatut(d.id, "refusée")} disabled={isLoading}
                      className="sans flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition-colors border border-red-200 disabled:opacity-50">
                      {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                      Refuser
                    </button>
                  </div>
                )}

                {d.statut === "validée" && (
                  <div className="flex gap-2">
                    <button onClick={() => handleStatut(d.id, "terminée")} disabled={isLoading}
                      className="sans flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-xl transition-colors border border-blue-200 disabled:opacity-50">
                      {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                      Terminer la visite
                    </button>
                    <button onClick={() => handleDelete(d.id)} disabled={isLoading}
                      className="sans p-2 hover:bg-stone-100 rounded-xl transition-colors text-[#8B4513] hover:text-red-500 disabled:opacity-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {!["en attente", "validée"].includes(d.statut) && (
                  <button onClick={() => handleDelete(d.id)} disabled={isLoading}
                    className="sans flex items-center gap-1.5 text-xs text-[#8B4513] hover:text-red-500 transition-colors disabled:opacity-50">
                    {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Archive className="h-3 w-3" />}
                    Archiver
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-stone-50 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-stone-100 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="sans text-xs text-amber-600 font-semibold uppercase tracking-wide mb-0.5">Demandes de visite</p>
              <h3 className="font-bold text-[#6B8E23] leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                {property.title}
              </h3>
              <p className="sans text-xs text-[#8B4513] mt-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3" />{property.address}, {property.city}
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded-full transition-colors mt-1">
              <X className="h-5 w-5 text-[#8B4513]" />
            </button>
          </div>

          {/* Compteurs */}
          {!loading && (
            <div className="flex gap-3 mt-4">
              {[
                { label: "En attente", count: pending.length, color: "text-amber-600 bg-amber-50" },
                { label: "Validées",   count: validated.length, color: "text-emerald-600 bg-emerald-50" },
                { label: "Autres",     count: others.length, color: "text-[#6B8E23] bg-stone-100" },
              ].map((s) => (
                <div key={s.label} className={`sans flex-1 text-center rounded-xl py-2 ${s.color}`}>
                  <p className="text-lg font-bold">{s.count}</p>
                  <p className="text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-400 mb-3" />
              <p className="sans text-sm text-[#8B4513]">Chargement des demandes…</p>
            </div>
          ) : demandes.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-10 w-10 text-[#8B4513] mx-auto mb-3" />
              <p className="sans text-[#8B4513] text-sm font-medium">Aucune demande de visite</p>
              <p className="sans text-[#8B4513] text-xs mt-1">Les demandes apparaîtront ici lorsque des visiteurs s'intéresseront à votre bien.</p>
            </div>
          ) : (
            <>
              <Section title={`En attente · ${pending.length}`}   items={pending}   accent="text-amber-600" />
              <Section title={`Validées · ${validated.length}`}   items={validated} accent="text-emerald-600" />
              <Section title={`Autres · ${others.length}`}        items={others}    accent="text-[#8B4513]" />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4 border-t border-stone-100 flex-shrink-0 flex items-center justify-between">
          <button onClick={fetchDemandes} className="sans flex items-center gap-1.5 text-xs text-[#6B8E23] hover:text-amber-600 transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />Actualiser
          </button>
          <button onClick={onClose} className="sans px-4 py-2 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-stone-800 transition-colors">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY CARD
// ─────────────────────────────────────────────────────────────────────────────

const PropertyCard: React.FC<{
  property: Property;
  onEdit: () => void;
  onDelete: () => void;
  onGalerie: () => void;
  onDemandes: () => void;
  onStatusChange: (id: string, status: string, publishedAt?: string | null) => void;
  demandesCount?: number;
  pendingDemandesCount?: number;
}> = ({ property, onEdit, onDelete, onGalerie, onDemandes, onStatusChange, demandesCount = 0, pendingDemandesCount = 0 }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const statusCfg = STATUT_CONFIG[property.status] ?? STATUT_CONFIG["pending"];
  const mainImg = property.images?.[0];
  const isPublished = ["for_sale", "for_rent", "both"].includes(property.status);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Options du menu contextuel ──
  const menuItems = () => {
    const items: { label: string; icon: React.ReactNode; action: () => void; color?: string }[] = [];

    if (isPublished) {
      // Dépublier → PATCH /properties/:id
      items.push({
        label: "Dépublier (brouillon)",
        icon: <Archive className="h-3.5 w-3.5" />,
        action: () => onStatusChange(property.id, "pending", null),
      });

      // Marquer vendu (si vente) → PATCH /properties/:id
      if (property.listingType === "sale" || property.listingType === "both") {
        items.push({
          label: "Marquer comme vendu",
          icon: <CheckCircle className="h-3.5 w-3.5" />,
          action: () => onStatusChange(property.id, "sold"),
          color: "text-emerald-600",
        });
      }

      // Marquer loué (si location) → PATCH /properties/:id
      if (property.listingType === "rent" || property.listingType === "both") {
        items.push({
          label: "Marquer comme loué",
          icon: <CheckCircle className="h-3.5 w-3.5" />,
          action: () => onStatusChange(property.id, "rented"),
          color: "text-violet-600",
        });
      }
    } else {
      // Publier → PATCH /properties/:id
      const pubStatus = property.listingType === "rent" ? "for_rent"
        : property.listingType === "both" ? "both"
        : "for_sale";
      items.push({
        label: "Publier l'annonce",
        icon: <CheckCircle className="h-3.5 w-3.5" />,
        action: () => onStatusChange(property.id, pubStatus, new Date().toISOString()),
        color: "text-emerald-600",
      });
    }

    // Supprimer → DELETE /properties/:id
    items.push({
      label: "Supprimer définitivement",
      icon: <Trash2 className="h-3.5 w-3.5" />,
      action: onDelete,
      color: "text-red-500",
    });

    return items;
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-xl hover:border-amber-100 transition-all duration-300 flex flex-col">
      {/* ── Image ── */}
      <div className="relative h-44 bg-stone-100 flex-shrink-0 overflow-hidden">
        {mainImg ? (
          <img src={mainImg} alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="h-10 w-10 text-[#8B4513]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Badge statut */}
        <div className="absolute top-3 left-3">
          <span className={`sans inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusCfg.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </span>
        </div>

        {/* Badges droite : listing type + photos */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="sans text-xs font-semibold bg-stone-900/70 text-white px-2.5 py-1 rounded-full">
            {LISTING_TYPE[property.listingType] ?? "Vente"}
          </span>
          {(property.images?.length ?? 0) > 0 && (
            <button onClick={onGalerie}
              className="sans text-xs bg-stone-900/70 hover:bg-stone-900 text-white px-2 py-1 rounded-full flex items-center gap-1 transition-colors">
              <Images className="h-3 w-3" />{property.images.length}
            </button>
          )}
        </div>

        {/* Badge demandes en attente */}
        {pendingDemandesCount > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="sans flex items-center gap-1 text-xs font-bold bg-amber-500 text-white px-2.5 py-1 rounded-full shadow">
              <Bell className="h-3 w-3" />
              {pendingDemandesCount} demande{pendingDemandesCount > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Prix */}
        <div className="absolute bottom-3 right-3">
          <span className="sans text-base font-bold text-white drop-shadow-sm">
            {property.price?.toLocaleString("fr-FR")} €
            {property.listingType === "rent" && (
              <span className="text-xs font-normal opacity-80">/mois</span>
            )}
          </span>
        </div>
      </div>

      {/* ── Corps ── */}
      <div className="p-4 flex flex-col flex-grow" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
        {/* Type + Titre */}
        <div className="mb-1.5">
          <span className="sans text-xs text-amber-600 font-semibold uppercase tracking-wide">
            {TYPE_BIEN[property.type] ?? property.type}
          </span>
          <h3 className="text-base font-bold text-[#6B8E23] leading-snug line-clamp-2 mt-0.5">
            {property.title}
          </h3>
        </div>

        {/* Localisation */}
        <div className="sans flex items-center gap-1 text-xs text-[#8B4513] mb-3">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="line-clamp-1">{property.address}, {property.city}</span>
        </div>

        {/* Caractéristiques */}
        <div className="sans flex flex-wrap items-center gap-3 text-xs text-[#6B8E23] mb-4">
          <span className="flex items-center gap-1"><Ruler className="h-3 w-3" />{property.surface} m²</span>
          {!!property.rooms && <span className="flex items-center gap-1"><Home className="h-3 w-3" />{property.rooms} p.</span>}
          {!!property.bedrooms && <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" />{property.bedrooms} ch.</span>}
          {!!property.bathrooms && <span className="flex items-center gap-1"><Bath className="h-3 w-3" />{property.bathrooms} sdb</span>}
        </div>

        {/* Stats vues/favoris/demandes */}
        <div className="sans flex items-center gap-3 mb-4 p-2.5 bg-stone-50 rounded-xl text-xs">
          <span className="flex items-center gap-1.5 text-[#6B8E23]">
            <Eye className="h-3.5 w-3.5 text-amber-400" />
            <strong className="text-[#6B8E23]">{property.views ?? 0}</strong>
          </span>
          <span className="flex items-center gap-1.5 text-[#6B8E23]">
            <Heart className="h-3.5 w-3.5 text-rose-400" />
            <strong className="text-[#6B8E23]">{property.favorites?.length ?? 0}</strong>
          </span>
          {demandesCount > 0 && (
            <span className="flex items-center gap-1.5 text-[#6B8E23]">
              <MessageSquare className="h-3.5 w-3.5 text-violet-400" />
              <strong className="text-[#6B8E23]">{demandesCount}</strong>
            </span>
          )}
          <span className="flex items-center gap-1.5 text-[#8B4513] ml-auto">
            <Clock className="h-3 w-3" />
            {new Date(property.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          {/* Demandes de visite → GET /demandes/immobilier/property/:propertyId */}
          <button onClick={onDemandes}
            className={`sans flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border-2 transition-all relative ${
              pendingDemandesCount > 0
                ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "border-stone-200 text-[#6B8E23] hover:border-stone-300 hover:bg-stone-50"
            }`}>
            <MessageSquare className="h-3.5 w-3.5" />
            Demandes
            {pendingDemandesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {pendingDemandesCount}
              </span>
            )}
          </button>

          {/* Modifier → navigate vers page édition */}
          <button onClick={onEdit}
            className="sans flex-1 flex items-center justify-center gap-1.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors">
            <Edit className="h-3.5 w-3.5" />Modifier
          </button>

          {/* Menu contextuel */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen((p) => !p)}
              className="p-2 border-2 border-stone-200 hover:border-amber-300 rounded-xl text-[#6B8E23] hover:text-amber-600 transition-all">
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-52 bg-white border border-stone-100 rounded-2xl shadow-xl overflow-hidden z-30">
                {menuItems().map((item) => (
                  <button key={item.label}
                    onClick={() => { item.action(); setMenuOpen(false); }}
                    className={`sans w-full text-left px-4 py-2.5 text-xs font-medium flex items-center gap-2.5 hover:bg-stone-50 transition-colors ${item.color ?? "text-[#6B8E23]"}`}>
                    {item.icon}{item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────

const StatCard: React.FC<{ label: string; value: number | string; icon: React.ReactNode; color: string }> = ({
  label, value, icon, color,
}) => (
  <div className="bg-white border border-stone-100 rounded-2xl p-5 flex items-center justify-between">
    <div>
      <p className="sans text-xs text-[#6B8E23] uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color }}>{value}</p>
    </div>
    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
      {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5", style: { color } })}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// BANNIÈRE ABONNEMENT
// ─────────────────────────────────────────────────────────────────────────────

const AbonnementBanner: React.FC<{ onSubscribe: () => void }> = ({ onSubscribe }) => (
  <div className="relative overflow-hidden bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
    <div className="absolute right-0 top-0 w-64 h-full opacity-5"
      style={{ background: "radial-gradient(circle at 80% 50%, #f59e0b 0%, transparent 70%)" }} />
    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
      <Lock className="h-6 w-6 text-amber-400" />
    </div>
    <div className="flex-1">
      <p className="sans font-bold text-white mb-0.5">Abonnement requis pour créer des annonces</p>
      <p className="sans text-[#8B4513] text-sm">
        Publiez des annonces immobilières illimitées pour{" "}
        <strong className="text-amber-400">35 € HT / mois</strong> (42 € TTC).
      </p>
    </div>
    <button onClick={onSubscribe}
      className="sans flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#6B8E23] font-bold text-sm px-5 py-2.5 rounded-xl transition-colors flex-shrink-0">
      <Crown className="h-4 w-4" />S'abonner<ArrowRight className="h-3.5 w-3.5" />
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE PRINCIPALE
// ─────────────────────────────────────────────────────────────────────────────

const MesAnnoncesPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasSubscription, loading: subLoading } = useSubscriptionCheck();

  // Utilisateur courant
  const currentUser = AuthService.getCurrentUser();
  const userId = currentUser?.id;

  const [properties, setProperties]   = useState<Property[]>([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [stats, setStats]             = useState<Stats>({ total: 0, published: 0, pending: 0, archived: 0, totalViews: 0, avgViews: 0 });

  // Modals
  const [galerieProperty, setGalerieProperty]   = useState<Property | null>(null);
  const [demandesProperty, setDemandesProperty] = useState<Property | null>(null);

  // Compteurs de demandes par property (chargés en parallèle)
  const [demandesCountMap, setDemandesCountMap] = useState<Record<string, { total: number; pending: number }>>({});

  // Filtres
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType]     = useState("");
  const [filterListing, setFilterListing] = useState("");

  // ── Chargement annonces ──────────────────────────────────────────────────
  // Route : GET /properties/user/:userId?status=all
  const fetchProperties = useCallback(async (silent = false) => {
    if (!userId) return;
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await api.get(`/properties/user/${userId}?status=all`);
      const data: Property[] = res.data ?? [];
      setProperties(data);
    } catch (err) {
      console.error("Erreur fetch properties:", err);
      toast.error("Impossible de charger vos annonces");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  // ── Chargement stats ─────────────────────────────────────────────────────
  // Route : GET /properties/stats?userId=xxx
  const fetchStats = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/properties/stats?userId=${userId}`);
      setStats(res.data);
    } catch (err) {
      console.error("Erreur fetch stats:", err);
    }
  }, [userId]);

  // ── Chargement compteurs de demandes ─────────────────────────────────────
  // Route : GET /demandes/immobilier/property/:propertyId
  const fetchDemandesCount = useCallback(async (props: Property[]) => {
    const published = props.filter((p) => ["for_sale", "for_rent", "both"].includes(p.status));
    if (published.length === 0) return;

    const results = await Promise.allSettled(
      published.map((p) => api.get(`/demandes/immobilier/property/${p.id}`))
    );

    const map: Record<string, { total: number; pending: number }> = {};
    results.forEach((r, i) => {
      const pid = published[i].id;
      if (r.status === "fulfilled") {
        const demandes: Demande[] = r.value.data ?? [];
        map[pid] = {
          total: demandes.length,
          pending: demandes.filter((d) => d.statut === "en attente").length,
        };
      } else {
        map[pid] = { total: 0, pending: 0 };
      }
    });
    setDemandesCountMap(map);
  }, []);

  useEffect(() => {
    fetchProperties();
    fetchStats();
  }, [fetchProperties, fetchStats]);

  useEffect(() => {
    if (properties.length > 0) fetchDemandesCount(properties);
  }, [properties, fetchDemandesCount]);

  // ── Refresh global ───────────────────────────────────────────────────────
  const handleRefresh = async () => {
    await fetchProperties(true);
    await fetchStats();
  };

  // ── DELETE /properties/:id ───────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer définitivement cette annonce ? Cette action est irréversible.")) return;
    try {
      await api.delete(`/properties/${id}`);
      toast.success("Annonce supprimée");
      fetchProperties(true);
      fetchStats();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  // ── PATCH /properties/:id ────────────────────────────────────────────────
  const handleStatusChange = async (id: string, status: string, publishedAt?: string | null) => {
    try {
      const payload: Record<string, any> = { status };
      if (publishedAt !== undefined) payload.publishedAt = publishedAt;
      else if (["for_sale", "for_rent", "both"].includes(status)) {
        payload.publishedAt = new Date().toISOString();
      }
      await api.patch(`/properties/${id}`, payload);
      toast.success("Statut mis à jour");
      fetchProperties(true);
      fetchStats();
    } catch {
      toast.error("Erreur lors du changement de statut");
    }
  };

  // ── Navigation création ──────────────────────────────────────────────────
  const handleCreateClick = () => {
    if (subLoading) return;
    navigate(hasSubscription ? "/mon-compte/immobilier/nouvelle-annonce" : "/mon-compte/subscription/user/payment");
  };

  // ── Filtres ──────────────────────────────────────────────────────────────
  const filtered = properties.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !search || p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
    const matchStatus  = !filterStatus  || p.status === filterStatus;
    const matchType    = !filterType    || p.type === filterType;
    const matchListing = !filterListing || p.listingType === filterListing;
    return matchSearch && matchStatus && matchType && matchListing;
  });

  const hasFilters = !!(search || filterStatus || filterType || filterListing);
  const totalPendingDemandes = Object.values(demandesCountMap).reduce((acc, v) => acc + v.pending, 0);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .sans { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }
        @media (max-width: 640px) { .card-grid { grid-template-columns: 1fr; } }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      {/* ── Modals ── */}
      {galerieProperty  && <GalerieModal  property={galerieProperty}  onClose={() => setGalerieProperty(null)}  />}
      {demandesProperty && <DemandesModal property={demandesProperty} onClose={() => { setDemandesProperty(null); fetchDemandesCount(properties); }} />}
    <div className=" h-[60px] w-full ">

    </div>
      {/* ── Header ── */}
      <div className="bg-white border-b border-stone-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#6B8E23]">Mes annonces</h1>
                <p className="sans text-sm text-[#8B4513]">
                  {stats.total} bien{stats.total > 1 ? "s" : ""} · {stats.published} publié{stats.published > 1 ? "s" : ""}
                  {totalPendingDemandes > 0 && (
                    <span className="ml-2 text-amber-600 font-semibold">
                      · {totalPendingDemandes} demande{totalPendingDemandes > 1 ? "s" : ""} en attente
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleRefresh} disabled={refreshing}
                className="p-2.5 border-2 border-stone-200 hover:border-stone-300 rounded-xl text-[#6B8E23] hover:text-[#6B8E23] transition-all disabled:opacity-50"
                title="Actualiser">
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>
              <button onClick={handleCreateClick} disabled={subLoading}
                className="sans flex items-center gap-2 bg-[#6B8E23] hover:bg-[#6B8E23]/90 texte-white font-bold text-sm px-5 py-2.5 rounded-xl shadow shadow-amber-200 transition-all disabled:opacity-50">
                {subLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                <span className="hidden sm:inline texte-white">Nouvelle annonce</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contenu ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Bannière abonnement */}
        {!subLoading && !hasSubscription && (
          <AbonnementBanner onSubscribe={() => navigate("/abonnement-immobilier")} />
        )}

        {/* Stats — GET /properties/stats?userId=xxx */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 fade-up">
            <StatCard label="Total"        value={stats.total}      icon={<Home />}         color="#78716c" />
            <StatCard label="Publiées"     value={stats.published}  icon={<CheckCircle />}  color="#059669" />
            <StatCard label="Brouillons"   value={stats.pending}    icon={<Clock />}        color="#d97706" />
            <StatCard label="Vues totales" value={stats.totalViews} icon={<TrendingUp />}   color="#6366f1" />
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4 mb-6 fade-up">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Recherche texte */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B4513]" />
              <input
                className="sans w-full pl-10 pr-4 py-2.5 border-2 border-stone-100 focus:border-amber-300 rounded-xl text-sm text-[#6B8E23] placeholder-stone-400 outline-none transition-colors bg-stone-50"
                placeholder="Titre, adresse, ville…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filtre statut */}
            <select
              className="sans px-4 py-2.5 border-2 border-stone-100 focus:border-amber-300 rounded-xl text-sm text-[#8B4513] bg-stone-50 outline-none transition-colors cursor-pointer"
              value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Tous les statuts</option>
              {Object.entries(STATUT_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>

            {/* Filtre type annonce */}
            <select
              className="sans px-4 py-2.5 border-2 border-stone-100 focus:border-amber-300 rounded-xl text-sm text-[#8B4513] bg-stone-50 outline-none transition-colors cursor-pointer"
              value={filterListing} onChange={(e) => setFilterListing(e.target.value)}>
              <option value="">Vente & Location</option>
              {Object.entries(LISTING_TYPE).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>

            {/* Filtre type bien */}
            <select
              className="sans px-4 py-2.5 border-2 border-stone-100 focus:border-amber-300 rounded-xl text-sm text-[#8B4513] bg-stone-50 outline-none transition-colors cursor-pointer"
              value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">Tous les biens</option>
              {Object.entries(TYPE_BIEN).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>

            {/* Reset */}
            {hasFilters && (
              <button
                onClick={() => { setSearch(""); setFilterStatus(""); setFilterType(""); setFilterListing(""); }}
                className="sans px-4 py-2.5 border-2 border-stone-200 hover:border-red-200 rounded-xl text-sm text-[#6B8E23] hover:text-red-500 transition-colors flex items-center gap-2">
                <X className="h-3.5 w-3.5" />Réinitialiser
              </button>
            )}
          </div>

          {hasFilters && (
            <p className="sans text-xs text-[#8B4513] mt-3">
              {filtered.length} annonce{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-amber-400 mb-4" />
            <p className="sans text-sm text-[#8B4513]">Chargement de vos annonces…</p>
          </div>
        )}

        {/* ── Grille annonces ── */}
        {!loading && filtered.length > 0 && (
          <div className="card-grid fade-up">
            {filtered.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={() => navigate(`/immobilier/modifier/${property.id}`)}
                onDelete={() => handleDelete(property.id)}
                onGalerie={() => setGalerieProperty(property)}
                onDemandes={() => setDemandesProperty(property)}
                onStatusChange={handleStatusChange}
                demandesCount={demandesCountMap[property.id]?.total ?? 0}
                pendingDemandesCount={demandesCountMap[property.id]?.pending ?? 0}
              />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 fade-up">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Home className="h-9 w-9 text-amber-200" />
            </div>
            <h3 className="text-xl font-bold text-[#6B8E23] mb-2">
              {hasFilters ? "Aucune annonce ne correspond à vos filtres" : "Vous n'avez pas encore d'annonces"}
            </h3>
            <p className="sans text-[#8B4513] text-sm mb-6 max-w-sm mx-auto">
              {hasFilters
                ? "Essayez de modifier ou réinitialiser vos filtres."
                : "Publiez votre premier bien immobilier et touchez des milliers d'acheteurs potentiels."}
            </p>
            {!hasFilters && (
              <button onClick={handleCreateClick}
                className="sans inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#6B8E23] font-bold px-6 py-3 rounded-xl shadow shadow-amber-200 transition-all">
                <Plus className="h-4 w-4" />
                {hasSubscription ? "Créer une annonce" : "S'abonner et créer une annonce"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Pied de page */}
        {!loading && filtered.length > 0 && (
          <p className="sans text-center text-[#8B4513] text-xs mt-8">
            {filtered.length} annonce{filtered.length > 1 ? "s" : ""} affichée{filtered.length > 1 ? "s" : ""}
            {properties.length !== filtered.length && ` · ${properties.length} au total`}
          </p>
        )}
      </div>
    </div>
  );
};

export default MesAnnoncesPage;