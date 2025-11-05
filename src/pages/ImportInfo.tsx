import React from "react";

export default function ImportInfo() {
  return (
    <div className="max-w-3xl mt-14 mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">
        Informations sur l’importation de vos coordonnées
      </h1>

      <p className="text-gray-700 mb-4">
        Servo permet à ses utilisateurs professionnels ou particuliers
        d’importer leurs contacts existants afin de faciliter les connexions
        et recommandations sur la plateforme.
      </p>

      <p className="text-gray-700 mb-4">
        Cela signifie que vos coordonnées peuvent avoir été importées par un
        autre utilisateur qui dispose déjà de votre numéro de téléphone ou de
        votre adresse e-mail.
      </p>

      <p className="text-gray-700 mb-4">
        Ces données sont utilisées uniquement à des fins de mise en relation et
        ne sont jamais partagées publiquement sans votre consentement.
      </p>

      <p className="text-gray-700">
        Vous pouvez à tout moment demander la suppression de ces informations
        depuis la page{" "}
        <a
          href="/privacy"
          className="text-blue-600 hover:underline font-medium"
        >
          politique de confidentialité
        </a>{" "}
        ou contacter notre équipe à{" "}
        <a
          href="mailto:contact@servo.mg"
          className="text-blue-600 hover:underline font-medium"
        >
          contact@immoplus.fr
        </a>.
      </p>
    </div>
  );
}
