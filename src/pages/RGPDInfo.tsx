import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RGPDInfo() {
  const navigate = useNavigate();

  const dossiers = [
    {
      title: "Droit d'accès",
      description: "Obtenez une copie de vos données personnelles",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Droit de rectification",
      description: "Modifiez vos données inexactes ou incomplètes",
      icon: Shield,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Droit à l'oubli",
      description: "Demandez la suppression de votre compte et données",
      icon: AlertCircle,
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Droit à la portabilité",
      description: "Récupérez vos données en format structuré",
      icon: CheckCircle,
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Vos Droits RGPD sur SERVO
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Conformité Règlement Général sur la Protection des Données
              </p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Protection de vos données personnelles
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            SERVO Platform s'engage à respecter vos droits fondamentaux concernant la protection de vos données personnelles. 
            Conformément au <strong>Règlement Général sur la Protection des Données (RGPD)</strong> (Règlement UE 2016/679), 
            vous disposez de droits importants sur vos informations.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Cette page vous explique ces droits et comment les exercer auprès de SERVO.
          </p>
        </div>

        {/* Vos Droits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Vos Droits RGPD
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dossiers.map((dossier, idx) => {
              const Icon = dossier.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all p-6"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${dossier.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {dossier.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {dossier.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Détails des droits */}
        <div className="space-y-6 mb-12">
          {/* Droit d'accès */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              1. Droit d'accès
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Vous avez le droit d'accéder à toutes les données personnelles que nous avons collectées à votre sujet.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold mb-2">Les données que vous pouvez télécharger :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Données de profil (nom, email, téléphone, adresse)</li>
                <li>Historique des annonces et transactions</li>
                <li>Messages et communications</li>
                <li>Données de paiement (anonymisées)</li>
                <li>Logs d'activité et préférences</li>
              </ul>
            </div>
          </div>

          {/* Droit de rectification */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600" />
              2. Droit de rectification
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Vous avez le droit de corriger les données personnelles qui sont inexactes ou incomplètes.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold mb-2">Vous pouvez modifier :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Vos informations de profil</li>
                <li>Votre adresse email et téléphone</li>
                <li>Vos informations professionnelles</li>
                <li>Vos préférences de communication</li>
              </ul>
            </div>
          </div>

          {/* Droit à l'oubli */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
              3. Droit à l'oubli (Suppression)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Vous pouvez demander la suppression définitive de votre compte et de vos données personnelles.
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-800 dark:text-red-200">
              <p className="font-semibold mb-2">⚠️ Attention :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Cette action est irréversible</li>
                <li>Votre compte sera définitivement supprimé</li>
                <li>Les données archivées à titre légal seront conservées</li>
                <li>Délai : 30 à 90 jours selon obligations légales</li>
              </ul>
            </div>
          </div>

          {/* Droit à la portabilité */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-purple-600" />
              4. Droit à la portabilité
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Vous avez le droit de recevoir vos données dans un format structuré, couramment utilisé et lisible par machine.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold mb-2">Formats disponibles :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>JSON (format structuré)</li>
                <li>CSV (format tabulaire)</li>
                <li>Transfert vers autre plateforme</li>
              </ul>
            </div>
          </div>

          {/* Droit d'opposition */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              5. Droit d'opposition
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Vous pouvez vous opposer au traitement de vos données pour certaines finalités.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold mb-2">Vous pouvez refuser :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Communications marketing</li>
                <li>Personnalisation de contenu</li>
                <li>Profilage automatique</li>
                <li>Partage avec partenaires publicitaires</li>
              </ul>
            </div>
          </div>

          {/* Droit à la limitation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              6. Droit à la limitation du traitement
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Vous pouvez demander à limiter temporairement le traitement de vos données.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold mb-2">Cas possibles :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Contester l'exactitude des données</li>
                <li>Contester la légalité du traitement</li>
                <li>Demander une enquête</li>
                <li>Exercer un droit d'opposition</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comment exercer vos droits */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6">
            Comment exercer vos droits ?
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Via votre compte SERVO
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  Accédez à la section "Gestion des Droits RGPD" dans vos paramètres pour télécharger vos données ou demander la suppression.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Contacter notre DPO
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  Email : <a href="mailto:dpo@servo.mg" className="font-semibold hover:underline">dpo@servo.mg</a>
                </p>
                <p className="text-blue-800 dark:text-blue-200 text-sm mt-1">
                  Délai de réponse : 30 jours maximum conformément au RGPD
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Saisir votre autorité de protection des données
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  Vous avez le droit de déposer plainte auprès de votre autorité nationale de protection des données.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            onClick={() => navigate("/gestion-droits-rgpd")}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Gérer mes droits RGPD
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/contact-dpo")}
            className="flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Contacter le DPO
          </Button>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pour plus d'informations, consultez notre <a href="/politique-confidentialite" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">politique de confidentialité complète</a>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
