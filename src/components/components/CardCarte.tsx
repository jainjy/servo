import { Globe2, Lightbulb, Map, Plane, Radar, Route, ShieldCheck, SignalHigh, Star } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const CardCarte: React.FC = () => {
  return (
    <div className="w-full px-3 lg:px-12 py-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_minmax(0,1fr)] items-stretch">
        {/* Colonne gauche – contenu */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-3xl shadow-sm px-8 py-10 flex flex-col justify-between">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-3 flex items-center gap-2">
              <Plane className="w-3.5 h-3.5 text-slate-600" />
              Réseau de partenaires
            </p>
            <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4 leading-snug flex items-center gap-2">
              <Map className="w-6 h-6 text-slate-700" />
              Carte des partenaires et propriétés
            </h2>
            <p className="text-sm inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-full">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <Star className="w-3 h-3 text-amber-300" />
              Réseau premium vérifié
            </p>
          </div>

          {/* Texte principal */}
          <div className="space-y-4 mb-8">
            <p className="text-sm leading-relaxed text-slate-600 flex items-start gap-2">
              <Lightbulb className="mt-0.5 w-4 h-4 text-amber-400" />
              <span>
                Visualisez instantanément l’implantation de vos partenaires et de vos propriétés sur une carte
                unifiée, pensée pour les décisions rapides et la collaboration entre équipes.
              </span>
            </p>
            <div className="border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 flex items-start gap-2">
              <ShieldCheck className="mt-0.5 w-4 h-4 text-emerald-500" />
              <p className="text-xs font-medium text-slate-700">
                Une vue consolidée pour piloter vos partenariats, suivre votre portefeuille et identifier
                de nouvelles opportunités en quelques clics.
              </p>
            </div>
          </div>

          {/* Points clés */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-8">
            <div className="space-y-1">
              <p className="text-slate-900 font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Partenaires certifiés
              </p>
              <p className="text-slate-500 text-xs">
                Validation systématique des acteurs de votre réseau.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-900 font-medium flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                Expertise sectorielle
              </p>
              <p className="text-slate-500 text-xs">
                Segmentation par typologie de biens et de services.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-900 font-medium flex items-center gap-2">
                <SignalHigh className="w-4 h-4 text-sky-500" />
                Suivi qualité
              </p>
              <p className="text-slate-500 text-xs">
                Indicateurs de performance et historique des collaborations.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-900 font-medium flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-slate-700" />
                Vision internationale
              </p>
              <p className="text-slate-500 text-xs">
                Cartographie multi-pays avec filtres avancés.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => (window.location.href = "/carte")}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white text-sm font-medium px-5 py-3 shadow-sm hover:bg-slate-800 transition-colors"
            >
              Explorer la carte
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
           
          </div>
        </div>

        {/* Colonne droite – visuel carte */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-950">
          {/* Fond image / vidéo */}
          <div className="absolute inset-0">
            <img
              src="https://i.pinimg.com/1200x/62/e8/06/62e806f8470cf0341f9360e6d2e67bfd.jpg"
              alt="Carte des partenaires"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-slate-900/30" />
          </div>

          {/* Radar LED renforcé */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* disque principal */}
              <div className="h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
              {/* anneaux ping multipliés */}
              <div className="absolute inset-10 rounded-full border border-emerald-400/40 animate-[ping_3s_ease-out_infinite]" />
              <div className="absolute inset-4 rounded-full border border-sky-400/30 animate-[ping_4.5s_ease-out_infinite]" />
              {/* balayage radar */}
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(16,185,129,0.2)_60deg,transparent_120deg)] animate-[spin_5s_linear_infinite]" />
            </div>
          </div>

          {/* Petits points aléatoires animés en arrière-plan */}
          <div className="pointer-events-none absolute inset-0">
            <span className="block absolute top-10 left-8 h-1.5 w-1.5 rounded-full bg-emerald-400/80 animate-[ping_3.5s_linear_infinite]" />
            <span className="block absolute top-20 right-10 h-1 w-1 rounded-full bg-sky-400/80 animate-[ping_4.2s_linear_infinite]" />
            <span className="block absolute bottom-10 left-16 h-1 w-1 rounded-full bg-amber-300/80 animate-[ping_2.8s_linear_infinite]" />
            <span className="block absolute bottom-16 right-20 h-1.5 w-1.5 rounded-full bg-emerald-300/80 animate-[ping_5s_linear_infinite]" />
          </div>

          {/* Overlay contenu */}
          <div className="relative h-full flex flex-col justify-between p-6 lg:p-8">
            {/* Badges en haut */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs font-medium text-slate-100 flex items-center gap-1.5">
                  <SignalHigh className="w-3.5 h-3.5 text-emerald-300" />
                  Vue carte en temps réel
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 border border-slate-700 px-2 py-1 rounded-full bg-slate-900/60">
                <Map className="w-3.5 h-3.5 text-sky-300" />
                Propriétés & partenaires
              </span>
            </div>

            {/* Bloc « mini carte » */}
            <div className="mt-auto">
              <div className="relative bg-slate-900/80 border border-slate-700 rounded-2xl p-5 backdrop-blur-md overflow-hidden">
                
                <div className="relative rounded-[14px] bg-slate-950/80 border border-slate-800 p-4 space-y-4">
                  {/* Bar du haut */}
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Radar className="w-3.5 h-3.5 text-emerald-300" />
                      <span className="font-medium">Carte interactive</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      En ligne
                    </span>
                  </div>

                  {/* Lignes + points + icônes = réseau LED */}
                  <div className="relative h-40">
                    {/* Cadres */}
                    <div className="absolute inset-6 rounded-xl border border-slate-700/60" />
                    <div className="absolute inset-10 rounded-xl border border-slate-700/40" />

                    {/* Trajets lumineux */}
                    <div className="absolute top-7 left-5 right-12 h-px bg-gradient-to-r from-emerald-400/0 via-emerald-400/70 to-emerald-400/0 animate-pulse" />
                    <div className="absolute bottom-6 left-10 right-8 h-px bg-gradient-to-r from-sky-400/0 via-sky-400/70 to-sky-400/0 animate-[pulse_2.2s_ease-in-out_infinite]" />
                    <div className="absolute top-1/2 left-1/4 right-6 h-px bg-slate-500/35 -rotate-6" />

                    {/* Points / nœuds LED */}
                    <div className="absolute top-6 left-10 flex flex-col items-start gap-1">
                      <div className="relative">
                        <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400/30 blur-sm" />
                        <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400">
                          <Globe2 className="w-2.5 h-2.5 text-emerald-950" />
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-200">Hub partenaires</span>
                    </div>

                    <div className="absolute bottom-7 right-10 flex flex-col items-end gap-1">
                      <div className="relative">
                        <span className="absolute inline-flex h-4 w-4 rounded-full bg-sky-400/30 blur-sm" />
                        <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-sky-400">
                          <Route className="w-2.5 h-2.5 text-slate-950" />
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-200">Propriétés actives</span>
                    </div>

                    <div className="absolute top-1/2 right-1/4 flex flex-col items-center gap-1">
                      <div className="relative">
                        <span className="absolute inline-flex h-4 w-4 rounded-full bg-amber-300/40 blur-sm animate-ping" />
                        <span className="relative flex h-3 w-3 items-center justify-center rounded-full bg-amber-300">
                          <SignalHigh className="w-2 h-2 text-amber-950" />
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-300">Nouveau point</span>
                    </div>
                  </div>

                  {/* Légende / chiffres */}
                  <div className="grid grid-cols-3 gap-3 text-[11px]">
                    <div>
                      <p className="text-slate-400">Partenaires</p>
                      <p className="text-slate-50 font-semibold">+120</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Propriétés</p>
                      <p className="text-slate-50 font-semibold">3 500</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Pays</p>
                      <p className="text-slate-50 font-semibold">18</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lien secondaire sous la mini carte */}
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-300">
                <p>Zoom, filtres et détails disponibles dans l’interface complète.</p>
                <button
                  onClick={() => (window.location.href = "/carte")}
                  className="font-medium text-slate-100 hover:text-white underline underline-offset-4"
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
