import React from "react";

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 md:px-20 mt-16 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Politique d’utilisation des cookies
      </h1>

      <p className="mb-4">
        <strong>Dernière mise à jour :</strong> 31 octobre 2025
      </p>

      <p className="mb-4">
        Un cookie est un petit fichier texte enregistré sur votre appareil
        lorsque vous visitez un site web. Les cookies sont utilisés pour
        mémoriser vos préférences, améliorer la sécurité et personnaliser votre
        expérience.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Pourquoi utilisons-nous des cookies ?
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Pour garantir le bon fonctionnement du site.</li>
        <li>Pour analyser le trafic et les performances.</li>
        <li>Pour enregistrer vos préférences de navigation.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Quels types de cookies utilisons-nous ?
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>
          <strong>Cookies nécessaires :</strong> essentiels au fonctionnement du
          site.
        </li>
        <li>
          <strong>Cookies de performance :</strong> nous aident à améliorer
          l’expérience utilisateur.
        </li>
        <li>
          <strong>Cookies de personnalisation :</strong> enregistrent vos choix
          (langue, thème...).
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Comment gérer vos préférences ?
      </h2>
      <p className="mb-4">
        Vous pouvez gérer vos préférences de cookies à tout moment depuis le
        bandeau de consentement ou en supprimant les cookies dans les
        paramètres de votre navigateur.
      </p>

      <p className="mt-10 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} Servo. Tous droits réservés.
      </p>
    </div>
  );
}
