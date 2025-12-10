import {
  Globe2,
  Lightbulb,
  Map,
  Plane,
  Radar,
  Route,
  ShieldCheck,
  SignalHigh,
  Star,
} from "lucide-react";
import React from "react";

// Thème de couleurs
const colors = {
  logo: "#556B2F" /* logo / accent - Olive green */,
  "primary-dark": "#6B8E23" /* Sruvol / fonds légers - Yellow-green */,
  "light-bg": "#FFFFFF" /* fond de page / bloc texte - White */,
  separator: "#D3D3D3" /* séparateurs / bordures, UI - Light gray */,
  "secondary-text":
    "#8B4513" /* touche premium / titres secondaires - Saddle brown */,
  // Couleurs complémentaires ajoutées
  "accent-light": "#98FB98" /* accent clair - Pale green */,
  "accent-warm": "#DEB887" /* accent chaud - Burlywood */,
  "neutral-dark": "#2F4F4F" /* texte foncé / titres - Dark slate gray */,
  "hover-primary": "#7BA05B" /* état hover primary - Medium olive green */,
  "hover-secondary": "#A0522D" /* état hover secondary - Sienna */,
  "neutral-light": "#F5F5F5" /* fonds légers - Light gray */,
  success: "#556B2F" /* succès - Olive green */,
  warning: "#8B4513" /* avertissement - Saddle brown */,
};

const CardCarte: React.FC = () => {
  return (
    <div
      className="w-full px-3 lg:px-12 py-8"
      style={{ backgroundColor: colors["light-bg"] }}
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_minmax(0,1fr)] items-stretch">
        {/* Colonne gauche – contenu */}
        <div
          className="bg-white/90 backdrop-blur-sm border rounded-3xl shadow-sm px-8 py-2 lg:py-10 flex flex-col justify-between"
          style={{
            borderColor: colors["separator"],
            backgroundColor: `${colors["light-bg"]}E6`,
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 flex items-center gap-2"
              style={{ color: colors["secondary-text"] }}
            >
              <Plane
                className="w-3.5 h-3.5"
                style={{ color: colors["secondary-text"] }}
              />
              Réseau de partenaires
            </p>
            <h2
              className="text-lg lg:text-4xl font-semibold mb-4 leading-snug flex items-center gap-2"
              style={{ color: colors["neutral-dark"] }}
            >
              <Map
                className="w-6 h-6"
                style={{ color: colors["primary-dark"] }}
              />
              Carte des partenaires et propriétés
            </h2>
            <p
              className="text-sm inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: colors["primary-dark"],
                color: colors["light-bg"],
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                  style={{ backgroundColor: colors["accent-light"] }}
                />
                <span
                  className="relative inline-flex h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: colors["accent-light"] }}
                />
              </span>
              <Star
                className="w-3 h-3"
                style={{ color: colors["accent-warm"] }}
              />
              Réseau premium vérifié
            </p>
          </div>

          {/* Texte principal */}
          <div className="space-y-4 mb-8">
            <p
              className="text-sm leading-relaxed flex items-start gap-2"
              style={{ color: colors["neutral-dark"] }}
            >
              <Lightbulb
                className="mt-0.5 w-4 h-4"
                style={{ color: colors["accent-warm"] }}
              />
              <span>
                Visualisez instantanément l'implantation de vos partenaires et
                de vos propriétés sur une carte unifiée, pensée pour les
                décisions rapides et la collaboration entre équipes.
              </span>
            </p>
            <div
              className="border rounded-2xl px-4 py-3 flex items-start gap-2"
              style={{
                borderColor: colors["separator"],
                backgroundColor: colors["neutral-light"],
              }}
            >
              <ShieldCheck
                className="mt-0.5 w-4 h-4"
                style={{ color: colors["primary-dark"] }}
              />
              <p
                className="text-xs font-medium"
                style={{ color: colors["neutral-dark"] }}
              >
                Une vue consolidée pour piloter vos partenariats, suivre votre
                portefeuille et identifier de nouvelles opportunités en quelques
                clics.
              </p>
            </div>
          </div>

          {/* Points clés */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-8">
            <div className="space-y-1">
              <p
                className="font-medium flex items-center gap-2"
                style={{ color: colors["neutral-dark"] }}
              >
                <ShieldCheck
                  className="w-4 h-4"
                  style={{ color: colors["primary-dark"] }}
                />
                Partenaires certifiés
              </p>
              <p
                className="text-xs"
                style={{ color: colors["secondary-text"] }}
              >
                Validation systématique des acteurs de votre réseau.
              </p>
            </div>
            <div className="space-y-1">
              <p
                className="font-medium flex items-center gap-2"
                style={{ color: colors["neutral-dark"] }}
              >
                <Star
                  className="w-4 h-4"
                  style={{ color: colors["accent-warm"] }}
                />
                Expertise sectorielle
              </p>
              <p
                className="text-xs"
                style={{ color: colors["secondary-text"] }}
              >
                Segmentation par typologie de biens et de services.
              </p>
            </div>
            <div className="space-y-1">
              <p
                className="font-medium flex items-center gap-2"
                style={{ color: colors["neutral-dark"] }}
              >
                <SignalHigh
                  className="w-4 h-4"
                  style={{ color: colors["primary-dark"] }}
                />
                Suivi qualité
              </p>
              <p
                className="text-xs"
                style={{ color: colors["secondary-text"] }}
              >
                Indicateurs de performance et historique des collaborations.
              </p>
            </div>
            <div className="space-y-1">
              <p
                className="font-medium flex items-center gap-2"
                style={{ color: colors["neutral-dark"] }}
              >
                <Globe2
                  className="w-4 h-4"
                  style={{ color: colors["primary-dark"] }}
                />
                Vision internationale
              </p>
              <p
                className="text-xs"
                style={{ color: colors["secondary-text"] }}
              >
                Cartographie multi-pays avec filtres avancés.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => (window.location.href = "/carte")}
              className="inline-flex items-center gap-2 rounded-full text-sm font-medium px-5 py-3 shadow-sm transition-colors"
              style={{
                backgroundColor: colors["primary-dark"],
                color: colors["light-bg"],
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors["hover-primary"];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors["primary-dark"];
              }}
            >
              Explorer la carte
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Colonne droite – visuel carte */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{ backgroundColor: colors["neutral-dark"] }}
        >
          {/* Fond image / vidéo */}
          <div className="absolute inset-0">
            <img
              src="https://i.pinimg.com/1200x/62/e8/06/62e806f8470cf0341f9360e6d2e67bfd.jpg"
              alt="Carte des partenaires"
              className="w-full h-full object-cover opacity-80"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top right, ${colors["neutral-dark"]} 0%, ${colors["neutral-dark"]}80 50%, ${colors["neutral-dark"]}30 100%)`,
              }}
            />
          </div>

          {/* Radar LED renforcé */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* disque principal */}
              <div
                className="h-64 w-64 rounded-full blur-3xl animate-pulse"
                style={{ backgroundColor: `${colors["primary-dark"]}30` }}
              />
              {/* anneaux ping multipliés */}
              <div
                className="absolute inset-10 rounded-full border animate-[ping_3s_ease-out_infinite]"
                style={{ borderColor: `${colors["primary-dark"]}60` }}
              />
              <div
                className="absolute inset-4 rounded-full border animate-[ping_4.5s_ease-out_infinite]"
                style={{ borderColor: `${colors["accent-light"]}40` }}
              />
              {/* balayage radar */}
              <div
                className="absolute inset-0 rounded-full animate-[spin_5s_linear_infinite]"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0deg, ${colors["primary-dark"]}40 60deg, transparent 120deg)`,
                }}
              />
            </div>
          </div>

          {/* Petits points aléatoires animés en arrière-plan */}
          <div className="pointer-events-none absolute inset-0">
            <span
              className="block absolute top-10 left-8 h-1.5 w-1.5 rounded-full animate-[ping_3.5s_linear_infinite]"
              style={{ backgroundColor: colors["primary-dark"] }}
            />
            <span
              className="block absolute top-20 right-10 h-1 w-1 rounded-full animate-[ping_4.2s_linear_infinite]"
              style={{ backgroundColor: colors["accent-light"] }}
            />
            <span
              className="block absolute bottom-10 left-16 h-1 w-1 rounded-full animate-[ping_2.8s_linear_infinite]"
              style={{ backgroundColor: colors["accent-warm"] }}
            />
            <span
              className="block absolute bottom-16 right-20 h-1.5 w-1.5 rounded-full animate-[ping_5s_linear_infinite]"
              style={{ backgroundColor: colors["primary-dark"] }}
            />
          </div>

          {/* Overlay contenu */}
          <div className="relative h-full flex flex-col justify-between p-6 lg:p-8">
            {/* Badges en haut */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                    style={{ backgroundColor: colors["primary-dark"] }}
                  />
                  <span
                    className="relative inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: colors["primary-dark"] }}
                  />
                </span>
                <span
                  className="text-[10px] lg:text-xs font-medium flex items-center gap-1.5"
                  style={{ color: colors["light-bg"] }}
                >
                  <SignalHigh
                    className="w-3.5 h-3.5"
                    style={{ color: colors["primary-dark"] }}
                  />
                  Vue carte en temps réel
                </span>
              </div>
              <span
                className="inline-flex items-center gap-1 text-[11px] border px-2 py-1 rounded-full"
                style={{
                  color: colors["light-bg"],
                  borderColor: colors["separator"],
                  backgroundColor: `${colors["neutral-dark"]}99`,
                }}
              >
                <Map
                  className="w-3.5 h-3.5"
                  style={{ color: colors["primary-dark"] }}
                />
                Propriétés & partenaires
              </span>
            </div>

            {/* Bloc « mini carte » */}
            <div className="mt-auto">
              <div
                className="relative border rounded-2xl p-5 backdrop-blur-md overflow-hidden"
                style={{
                  backgroundColor: `${colors["neutral-dark"]}CC`,
                  borderColor: colors["separator"],
                }}
              >
                <div
                  className="relative rounded-[14px] border p-4 space-y-4"
                  style={{
                    backgroundColor: `${colors["neutral-dark"]}CC`,
                    borderColor: colors["separator"],
                  }}
                >
                  {/* Bar du haut */}
                  <div
                    className="flex items-center justify-between text-[11px]"
                    style={{ color: colors["light-bg"] }}
                  >
                    <span className="flex items-center gap-1.5">
                      <Radar
                        className="w-3.5 h-3.5"
                        style={{ color: colors["primary-dark"] }}
                      />
                      <span className="font-medium">Carte interactive</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span
                        className="h-1.5 w-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: colors["primary-dark"] }}
                      />
                      En ligne
                    </span>
                  </div>

                  {/* Lignes + points + icônes = réseau LED */}
                  <div className="relative h-40">
                    {/* Cadres */}
                    <div
                      className="absolute inset-6 rounded-xl border"
                      style={{ borderColor: `${colors["separator"]}99` }}
                    />
                    <div
                      className="absolute inset-10 rounded-xl border"
                      style={{ borderColor: `${colors["separator"]}66` }}
                    />

                    {/* Trajets lumineux */}
                    <div
                      className="absolute top-7 left-5 right-12 h-px animate-pulse"
                      style={{
                        background: `linear-gradient(to right, ${colors["primary-dark"]}00, ${colors["primary-dark"]}B3, ${colors["primary-dark"]}00)`,
                      }}
                    />
                    <div
                      className="absolute bottom-6 left-10 right-8 h-px animate-[pulse_2.2s_ease-in-out_infinite]"
                      style={{
                        background: `linear-gradient(to right, ${colors["accent-light"]}00, ${colors["accent-light"]}B3, ${colors["accent-light"]}00)`,
                      }}
                    />
                    <div
                      className="absolute top-1/2 left-1/4 right-6 h-px -rotate-6"
                      style={{ backgroundColor: `${colors["separator"]}50` }}
                    />

                    {/* Points / nœuds LED */}
                    <div className="absolute top-6 left-10 flex flex-col items-start gap-1">
                      <div className="relative">
                        <span
                          className="absolute inline-flex h-4 w-4 rounded-full blur-sm"
                          style={{
                            backgroundColor: `${colors["primary-dark"]}50`,
                          }}
                        />
                        <span
                          className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full"
                          style={{ backgroundColor: colors["primary-dark"] }}
                        >
                          <Globe2
                            className="w-2.5 h-2.5"
                            style={{ color: colors["neutral-dark"] }}
                          />
                        </span>
                      </div>
                      <span
                        className="text-[10px]"
                        style={{ color: colors["light-bg"] }}
                      >
                        Hub partenaires
                      </span>
                    </div>

                    <div className="absolute bottom-7 right-10 flex flex-col items-end gap-1">
                      <div className="relative">
                        <span
                          className="absolute inline-flex h-4 w-4 rounded-full blur-sm"
                          style={{
                            backgroundColor: `${colors["accent-light"]}50`,
                          }}
                        />
                        <span
                          className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full"
                          style={{ backgroundColor: colors["accent-light"] }}
                        >
                          <Route
                            className="w-2.5 h-2.5"
                            style={{ color: colors["neutral-dark"] }}
                          />
                        </span>
                      </div>
                      <span
                        className="text-[10px]"
                        style={{ color: colors["light-bg"] }}
                      >
                        Propriétés actives
                      </span>
                    </div>

                    <div className="absolute top-1/2 right-1/4 flex flex-col items-center gap-1">
                      <div className="relative">
                        <span
                          className="absolute inline-flex h-4 w-4 rounded-full blur-sm animate-ping"
                          style={{
                            backgroundColor: `${colors["accent-warm"]}66`,
                          }}
                        />
                        <span
                          className="relative flex h-3 w-3 items-center justify-center rounded-full"
                          style={{ backgroundColor: colors["accent-warm"] }}
                        >
                          <SignalHigh
                            className="w-2 h-2"
                            style={{ color: colors["neutral-dark"] }}
                          />
                        </span>
                      </div>
                      <span
                        className="text-[9px]"
                        style={{ color: colors["light-bg"] }}
                      >
                        Nouveau point
                      </span>
                    </div>
                  </div>

                  {/* Légende / chiffres */}
                  <div className="grid grid-cols-3 gap-3 text-[11px]">
                    <div>
                      <p style={{ color: colors["separator"] }}>Partenaires</p>
                      <p
                        className="font-semibold"
                        style={{ color: colors["light-bg"] }}
                      >
                        +120
                      </p>
                    </div>
                    <div>
                      <p style={{ color: colors["separator"] }}>Propriétés</p>
                      <p
                        className="font-semibold"
                        style={{ color: colors["light-bg"] }}
                      >
                        3 500
                      </p>
                    </div>
                    <div>
                      <p style={{ color: colors["separator"] }}>Pays</p>
                      <p
                        className="font-semibold"
                        style={{ color: colors["light-bg"] }}
                      >
                        18
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lien secondaire sous la mini carte */}
              <div
                className="mt-4 grid gap-4 lg:flex items-center justify-between text-[11px]"
                style={{ color: colors["light-bg"] }}
              >
                <p>
                  Zoom, filtres et détails disponibles dans l'interface
                  complète.
                </p>
                <button
                  onClick={() => (window.location.href = "/carte")}
                  className="font-medium underline underline-offset-4"
                  style={{ color: colors["light-bg"] }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors["accent-light"];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors["light-bg"];
                  }}
                >
                  Ouvrir la carte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCarte;
