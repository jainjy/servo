import React from "react";

export default function Privacy() {
  return (
    <div className="max-w-4xl mt-14 mx-auto py-12 px-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Politique de confidentialité de Servo
      </h1>

      <p className="mb-4">
        La présente politique de confidentialité explique comment{" "}
        <strong>Servo</strong> collecte, utilise, conserve et protège vos
        informations personnelles lorsque vous utilisez notre plateforme.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        1. Collecte des informations
      </h2>
      <p className="mb-4">
        Nous recueillons des informations personnelles lorsque vous créez un
        compte, utilisez nos services ou interagissez avec notre site. Ces
        informations peuvent inclure :
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Nom, prénom, adresse e-mail, numéro de téléphone</li>
        <li>Informations de connexion et historique de navigation</li>
        <li>Préférences de cookies et données de géolocalisation (avec accord)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        2. Utilisation des informations
      </h2>
      <p className="mb-4">
        Nous utilisons vos données pour :
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Créer et gérer votre compte utilisateur</li>
        <li>Fournir nos services et assurer leur bon fonctionnement</li>
        <li>Personnaliser votre expérience utilisateur</li>
        <li>Améliorer nos produits et nos offres</li>
        <li>Communiquer avec vous concernant votre compte ou nos services</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        3. Protection et sécurité
      </h2>
      <p className="mb-4">
        Nous mettons en œuvre des mesures de sécurité techniques et
        organisationnelles appropriées pour protéger vos données personnelles
        contre tout accès non autorisé, perte, destruction ou divulgation.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        4. Partage des données
      </h2>
      <p className="mb-4">
        Servo ne vend ni ne loue vos données personnelles. Nous pouvons les
        partager uniquement avec :
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Nos prestataires techniques et hébergeurs</li>
        <li>Les autorités légales, si la loi l’exige</li>
        <li>Nos partenaires de confiance, uniquement dans le cadre de nos
        services et avec votre consentement</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        5. Cookies et suivi
      </h2>
      <p className="mb-4">
        Nous utilisons des cookies pour améliorer votre expérience sur le site,
        mesurer l’audience et personnaliser le contenu. Vous pouvez gérer vos
        préférences à tout moment via notre module de{" "}
        <a
          href="/cookies"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          gestion des cookies
        </a>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        6. Durée de conservation
      </h2>
      <p className="mb-4">
        Vos données sont conservées aussi longtemps que nécessaire pour la
        réalisation des finalités décrites dans cette politique, sauf obligation
        légale de conservation plus longue.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        7. Vos droits
      </h2>
      <p className="mb-4">
        Conformément au Règlement Général sur la Protection des Données (RGPD),
        vous disposez des droits suivants :
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Droit d’accès, de rectification et de suppression de vos données</li>
        <li>Droit d’opposition et de limitation du traitement</li>
        <li>Droit à la portabilité de vos données</li>
        <li>Droit de retirer votre consentement à tout moment</li>
      </ul>

      <p className="mb-4">
        Pour exercer ces droits, contactez-nous à :{" "}
        <a
          href="mailto:contact@servo.mg"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          contact@servo.mg
        </a>
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        8. Modifications de la politique
      </h2>
      <p className="mb-4">
        Nous pouvons mettre à jour cette politique de confidentialité pour
        refléter les changements dans nos pratiques ou pour respecter la
        législation. Toute mise à jour sera publiée sur cette page.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        9. Contact
      </h2>
      <p className="mb-4">
        Si vous avez des questions concernant cette politique, vous pouvez nous
        contacter par e-mail à{" "}
        <a
          href="mailto:privacy@servo.mg"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          privacy@servo.mg
        </a>
        .
      </p>

      <p className="mt-10 text-sm text-gray-500 text-center">
        Dernière mise à jour : Octobre 2025
      </p>
    </div>
  );
}
