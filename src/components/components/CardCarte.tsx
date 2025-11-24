import { Lightbulb, Plane, ShieldCheck, Star } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const CardCarte: React.FC = () => {
    return (
        <div className="w-full px-12 py-4 overflow-hidden">
            <div className="flex flex-col shadow-md bg-white rounded-2xl overflow-hidden lg:flex-row">
                {/* Partie gauche - Description */}
                <div className="lg:w-1/2 p-8 flex flex-col justify-between">
                    <div>
                        {/* En-tête */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Carte des Partenaires et Propriétés</h2>
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-full">
                                    Réseau Premium
                                </span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-600 text-xs font-medium">Partenariats stratégiques</span>
                            </div>
                        </div>

                        {/* Description principale */}
                        <div className="mb-8">
                            <p className="text-gray-700 leading-relaxed text-md mb-6">
                                Découvrez notre réseau de partenaires fiables et certifiés. Chaque partenaire est sélectionné
                                selon des critères stricts de qualité, d'expertise et d'engagement pour vous offrir les meilleures
                                solutions adaptées à vos besoins.
                            </p>

                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <p className="flex text-blue-800 font-medium">
                                    <Lightbulb /> <span className="ml-2">Collaboration et innovation au service de votre réussite</span>
                                </p>
                            </div>
                        </div>

                        {/* Points clés */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-green-600 text-lg">✓</span>
                                </div>
                                <span className="text-gray-700">Partenaires certifiés</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-600 text-lg"><Star /></span>
                                </div>
                                <span className="text-gray-700">Expertise reconnue</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-600 text-lg"><ShieldCheck /></span>
                                </div>
                                <span className="text-gray-700">Engagement qualité</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-orange-600 text-lg"><Plane /></span>
                                </div>
                                <span className="text-gray-700">Solutions innovantes</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Partie droite - Emplacement vidéo avec overlay */}
                <div className="lg:w-1/2 relative min-h-[400px] bg-gradient-to-br from-gray-900 to-black">
                    {/* Placeholder vidéo avec fond stylisé */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-white/80 flex items-center justify-center">
                        {/* Éléments visuels style carte */}
                        <div className="absolute inset-0 opacity-60">
                            <img src="https://i.pinimg.com/1200x/62/e8/06/62e806f8470cf0341f9360e6d2e67bfd.jpg" alt="" />
                        </div>

                        {/* Points de repère stylisés */}
                        <div className="absolute top-8 left-8 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center">
                            <span className="text-2xl text-white">🏢</span>
                        </div>

                        <div className="absolute bottom-12 right-12 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                            <span className="text-xl text-white">📍</span>
                        </div>

                        <div className="absolute top-20 right-20 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                            <span className="text-lg text-white">🚀</span>
                        </div>

                        {/* Lignes de connexion */}
                        <div className="absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-white/30 rounded-full opacity-60"></div>
                        <div className="absolute top-1/3 left-1/3 w-1/3 h-0.5 bg-white/30 rounded-full opacity-40 transform -rotate-45"></div>
                    </div>

                    {/* Overlay et bouton centré */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <button
                            onClick={() => window.location.href = "/carte"}
                            className=" backdrop-blur-sm text-gray-100 font-semibold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:text-slate-900 border border-white/50 hover:bg-white flex items-center gap-3 group"
                        >
                            <span className="text-xl"><img src="/map.gif" className='w-10 bg-white/90 rounded-sm p-1' alt="" /></span>
                            <span className="text-lg">Explorer la carte </span>
                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CardCarte