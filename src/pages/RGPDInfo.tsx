import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RGPDInfo() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-16 p-6 text-gray-800 dark:text-gray-200 leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-6">
        {/* <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button> */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Informations destinées aux personnes qui n’utilisent pas les produits Meta
        </h1>
      </div>

      <p className="mb-4">
        Meta Platforms, Inc. (ci-après « Meta », « nous », « notre » ou « nos ») traite votre nom, votre numéro de mobile et/ou votre adresse e-mail si nous les recevons de la part de nos utilisateur·ices par le biais de la fonctionnalité d’importation de contacts ou de synchronisation de contacts disponible sur Facebook, Messenger ou Instagram (« Importation de contacts »). Nous traitons ces informations même si vous n’êtes pas un·e utilisateur·ice de Facebook, de Messenger ou d’Instagram et/ou si vous n’avez pas de compte chez nous (un·e « non-utilisateur·ice »).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">À propos de l’importation de contacts et de son fonctionnement</h2>
      <p className="mb-4">
        Lorsqu’un·e utilisateur·ice utilise l’importation de contacts et nous accorde l’accès au carnet d’adresses de son appareil, nous accédons aux noms, numéros de téléphone et adresses e-mail de son carnet d’adresses, y compris à ceux des utilisateur·ices de Facebook, de Messenger et/ou d’Instagram et d’autres contacts qui ne sont pas des utilisateur·ices ou qui n’ont pas de compte (c’est-à-dire les non-utilisateur·ices), et les importons quotidiennement sur nos serveurs.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Quelles informations sont recueillies sur les non-utilisateur·ices ?</h2>
      <p className="mb-4">
        Nous recueillons le nom, le numéro de mobile et/ou l’adresse e-mail des contacts d’un·e utilisateur·ice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Comment utilisons-nous les informations d’un·e non-utilisateur·ice ?</h2>
      <p className="mb-4">
        L’importation de contacts est une fonctionnalité facultative qui permet aux utilisateur·ices de choisir d’importer le carnet d’adresses de leur appareil sur Facebook, Messenger et/ou Instagram. Nous traitons les noms, les numéros de téléphone et/ou les adresses e-mail du carnet d’adresses pour voir si l’un des numéros ou l’une des adresses e-mail appartient aux utilisateur·ices. Si le contact d’un·e utilisateur·ice se trouve également sur Facebook, Messenger et/ou Instagram, nous pouvons suggérer ce contact sur Facebook dans la section Vous connaissez peut-être... de l’utilisateur·ice de Facebook afin qu’il ou elle puisse lui envoyer une invitation, ou sur Instagram afin qu’il ou elle puisse suivre son compte.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Partage et durée de conservation</h2>
      <p className="mb-4">
        Meta partage les informations avec les autres entités Meta pour fournir la fonctionnalité d’importation de contacts. Nous conservons les données personnelles aussi longtemps que nécessaire pour fournir cette fonctionnalité ou pour des raisons juridiques.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Comment les non-utilisateur·ices peuvent exercer leurs droits</h2>
      <p className="mb-4">
        Nous offrons aux non-utilisateur·ices la possibilité d’exercer leurs droits en vertu des lois en vigueur. Pour exercer vos droits, contactez-nous via notre formulaire de contact ou votre Autorité de protection des données locale.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Comment transférons-nous des informations ?</h2>
      <p className="mb-4">
        Les informations sont transférées dans le monde entier, notamment vers les États-Unis, l’Irlande, le Danemark et la Suède. Nous utilisons des clauses contractuelles types et des mécanismes conformes aux lois en vigueur pour protéger ces données.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contactez-nous</h2>
      <p>
        Si vous avez des questions sur cette politique ou souhaitez exercer vos droits, contactez-nous via notre formulaire dédié.
      </p>
    </motion.div>
  );
}
