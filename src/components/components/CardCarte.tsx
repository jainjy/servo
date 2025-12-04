import { Lightbulb, Plane, ShieldCheck, Star } from 'lucide-react';
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
                        <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-3">
                            Réseau de partenaires
                        </p>
                        <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4 leading-snug">
                            Carte des partenaires et propriétés
                        </h2>
                        <p className="text-sm inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Réseau premium vérifié
                        </p>
                    </div>

                    {/* Texte principal */}
                    <div className="space-y-4 mb-8">
                        <p className="text-sm leading-relaxed text-slate-600">
                            Visualisez instantanément l’implantation de vos partenaires et de vos propriétés sur une carte
                            unifiée, pensée pour les décisions rapides et la collaboration entre équipes.
                        </p>
                        <div className="border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50">
                            <p className="text-xs font-medium text-slate-700">
                                Une vue consolidée pour piloter vos partenariats, suivre votre portefeuille et identifier
                                de nouvelles opportunités en quelques clics.
                            </p>
                        </div>
                    </div>

                    {/* Points clés */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-8">
                        <div className="space-y-1">
                            <p className="text-slate-900 font-medium">Partenaires certifiés</p>
                            <p className="text-slate-500 text-xs">
                                Validation systématique des acteurs de votre réseau.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-900 font-medium">Expertise sectorielle</p>
                            <p className="text-slate-500 text-xs">
                                Segmentation par typologie de biens et de services.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-900 font-medium">Suivi qualité</p>
                            <p className="text-slate-500 text-xs">
                                Indicateurs de performance et historique des collaborations.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-900 font-medium">Vision internationale</p>
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
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/70 to-slate-900/20" />
                    </div>

                    {/* Overlay contenu */}
                    <div className="relative h-full flex flex-col justify-between p-6 lg:p-8">
                        {/* Badges en haut */}
                        <div className="flex items-center justify-between gap-3 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                <span className="text-xs font-medium text-slate-100">
                                    Vue carte en temps réel
                                </span>
                            </div>
                            <span className="text-[11px] text-slate-300 border border-slate-700 px-2 py-1 rounded-full">
                                Propriétés & partenaires
                            </span>
                        </div>

                        {/* Bloc « mini carte » */}
                        <div className="mt-auto">
                            <div className="relative bg-slate-900/70 border border-slate-700 rounded-2xl p-5 backdrop-blur-sm">
                                {/* Bar du haut */}
                                <div className="flex items-center justify-between mb-4 text-[11px] text-slate-300">
                                    <span className="font-medium">Carte interactive</span>
                                    <span className="inline-flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        En ligne
                                    </span>
                                </div>

                                {/* Lignes + points = impression de réseau */}
                                <div className="relative h-40">
                                    <div className="absolute inset-6 border border-slate-700/60 rounded-xl" />
                                    <div className="absolute inset-10 border border-slate-700/40 rounded-xl" />

                                    <div className="absolute top-5 left-7 h-1 w-16 bg-emerald-400/60 rounded-full" />
                                    <div className="absolute bottom-8 right-10 h-1 w-20 bg-sky-400/50 rounded-full" />
                                    <div className="absolute top-1/2 left-1/4 h-px w-1/2 bg-slate-500/40" />
                                    <div className="absolute top-1/3 left-1/2 h-px w-1/3 bg-slate-500/30 -rotate-12" />

                                    {/* Points principaux */}
                                    <div className="absolute top-7 left-10 flex flex-col items-start gap-1">
                                        <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.25)]" />
                                        <span className="text-[10px] text-slate-200">Hub partenaires</span>
                                    </div>
                                    <div className="absolute bottom-9 right-12 flex flex-col items-end gap-1">
                                        <span className="h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_0_6px_rgba(56,189,248,0.25)]" />
                                        <span className="text-[10px] text-slate-200">Propriétés actives</span>
                                    </div>
                                    <div className="absolute top-1/2 right-1/4 flex flex-col items-center gap-1">
                                        <span className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_0_5px_rgba(252,211,77,0.25)]" />
                                        <span className="text-[9px] text-slate-300">Nouveau</span>
                                    </div>
                                </div>

                                {/* Légende / chiffres */}
                                <div className="mt-4 grid grid-cols-3 gap-3 text-[11px]">
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

                            {/* Lien secondaire sous la « mini carte » */}
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

    )
}
export default CardCarte