import React from "react";

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 px-4 sm:px-6 mt-16 py-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête élégant */}
        <div className="text-center mb-12 mt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Politique d'utilisation des cookies
          </h1>
          <div className="w-24 h-1 bg-slate-900 mx-auto"></div>
        </div>

        {/* Carte principale */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="absolute right-0 -top-5 flex items-center gap-3 p-2 bg-black rounded-xl animate-pulse">
            <svg className="w-4 h-4 text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs font-medium text-slate-100">
              <strong className="underline">Dernière mise à jour :</strong> 31 octobre 2025
            </p>
          </div>

          <p className="text-lg leading-relaxed text-slate-600 mb-8">
            Un cookie est un petit fichier texte enregistré sur votre appareil lorsque vous visitez un site web. 
            Les cookies sont utilisés pour mémoriser vos préférences, améliorer la sécurité et personnaliser 
            votre expérience.
          </p>

          {/* Section Pourquoi */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Pourquoi utilisons-nous des cookies ?
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-700 font-medium">Fonctionnement du site</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-slate-700 font-medium">Analyse du trafic</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-slate-700 font-medium">Préférences de navigation</p>
              </div>
            </div>
          </div>

          {/* Section Types de cookies */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Types de cookies utilisés
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-2 h-2 bg-slate-900 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Cookies nécessaires</h3>
                  <p className="text-slate-600 text-sm">Essentiels au fonctionnement du site</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-2 h-2 bg-slate-900 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Cookies de performance</h3>
                  <p className="text-slate-600 text-sm">Améliorent l'expérience utilisateur</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-2 h-2 bg-slate-900 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Cookies de personnalisation</h3>
                  <p className="text-slate-600 text-sm">Enregistrent vos choix (langue, thème...)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section Gestion */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Gestion de vos préférences
              </h2>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-slate-700 leading-relaxed">
                Vous pouvez gérer vos préférences de cookies à tout moment depuis le bandeau de consentement 
                ou en supprimant les cookies dans les paramètres de votre navigateur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}