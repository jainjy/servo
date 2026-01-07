import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  Loader2,
  ShieldAlert,
  Trash2,
  FileText,
  Download,
  Building,
  Briefcase,
  Users,
  Package,
  Home,
} from "lucide-react";
import { toast } from "react-toastify";

const DeleteAccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [password, setPassword] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [exportData, setExportData] = useState(null);
  const [steps, setSteps] = useState({
    understood: false,
    dataExport: false,
    consequences: false,
    confirm: false,
    professionalData: false,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const isProfessional = user?.role === "professional";

  const handleInputChange = (step) => {
    setSteps((prev) => ({
      ...prev,
      [step]: !prev[step],
    }));
  };

  const handleExportData = async () => {
    try {
      setExportLoading(true);
      const response = await api.get("/users/export-data");
      setExportData(response.data);

      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `donnees-personnelles-${user?.id}-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Vos données ont été exportées avec succès");
      setSteps((prev) => ({ ...prev, dataExport: true }));
    } catch (error) {
      console.error("Erreur lors de l'export des données:", error);
      toast.error("Erreur lors de l'export des données");
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      console.log("bollean", allStepsCompleted());
      const response = await api.delete("/users/delete-account", {
        data: {
          password,
          confirmAllSteps: allStepsCompleted(),
        },
      });

      if (response.data.success) {
        toast.success("Votre compte a été supprimé avec succès");
        await logout();
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);

      if (error.response?.status === 401) {
        toast.error("Mot de passe incorrect");
      } else if (error.response?.status === 403) {
        toast.error("Vous devez accepter toutes les conditions");
        console.error("Toutes les étapes de confirmation n'ont pas été complétées", error);
      } else {
        toast.error("Erreur lors de la suppression du compte");
      }
    } finally {
      setIsLoading(false);
      setShowDialog(false);
    }
  };

  const completionPercentage = () => {
    const relevantSteps = isProfessional
      ? Object.values(steps)
      : Object.entries(steps)
          .filter(([key]) => key !== "professionalData")
          .map(([, value]) => value);
    
    return (relevantSteps.filter((step) => step).length / relevantSteps.length) * 100;
  };

  const allStepsCompleted = () => {
    return isProfessional
      ? Object.values(steps).every((step) => step)
      : Object.entries(steps)
          .filter(([key]) => key !== "professionalData")
          .every(([, value]) => value);
  };

  if (!user) {
    return null;
  }

  return (
    <div
      className={`w-full px-4 py-6 sm:py-8 md:py-10 ${
        isProfessional
          ? "max-w-5xl mx-auto"
          : "max-w-5xl mx-auto mt-8 sm:mt-12"
      }`}
    >
      {/* Header Section */}
      <div className="mb-6 sm:mb-8 md:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
          {isProfessional ? (
            <>
              <Building className="h-7 w-7 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 break-words">
                  Suppression de votre compte professionnel
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
                  {user.companyName || user.commercialName}
                </p>
              </div>
            </>
          ) : (
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Suppression de votre compte
            </h1>
          )}
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Cette action est définitive et irréversible selon le RGPD
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            Étapes de confirmation
          </span>
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            {Math.round(completionPercentage())}% complété
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
          <div
            className="bg-red-600 h-2 sm:h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage()}%` }}
          />
        </div>
      </div>

      {/* Main Alert */}
      <Alert variant="destructive" className="mb-6 sm:mb-8 text-sm sm:text-base">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <div>
          <AlertTitle>Avertissement important</AlertTitle>
          <AlertDescription className="mt-2 text-xs sm:text-sm">
            La suppression de votre compte entraînera la perte définitive de
            toutes vos données personnelles, historique, messages, services,
            produits, annonces et abonnements associés selon l'article 17 du
            RGPD.
            {isProfessional &&
              " En tant que professionnel, cela affectera également vos clients et vos activités commerciales."}
          </AlertDescription>
        </div>
      </Alert>

      <div className="space-y-4 sm:space-y-6 md:space-y-7">
        {/* Step 1 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-start sm:items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span>Étape 1 : Comprendre les conséquences</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              Prenez connaissance de ce que la suppression implique
              {isProfessional && " pour votre activité professionnelle"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                <span>
                  Suppression définitive de votre profil et données personnelles
                </span>
              </li>

              {isProfessional && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                    <span>
                      Suppression de votre fiche professionnelle et de tous vos
                      services
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                    <span>
                      Perte de tous vos produits, annonces immobilières et
                      publications
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                    <span>
                      Suppression de vos rendez-vous, devis et factures en cours
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                    <span>Annulation de vos abonnements professionnels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                    <span>Impact sur les clients ayant des demandes en cours</span>
                  </li>
                </>
              )}

              <li className="flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                <span>Perte de tous vos messages et conversations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                <span>Annulation de vos abonnements en cours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                <span>Suppression de vos annonces et publications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                <span>
                  Perte de l'historique de vos commandes et réservations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                <span>
                  Cette action est irréversible selon l'article 17 du RGPD
                </span>
              </li>
            </ul>

            <div className="flex items-start sm:items-center gap-2 sm:gap-3 pt-2">
              <Checkbox
                id="understood"
                checked={steps.understood}
                onCheckedChange={() => handleInputChange("understood")}
                className="mt-1 sm:mt-0"
              />
              <Label
                htmlFor="understood"
                className="text-xs sm:text-sm font-medium cursor-pointer"
              >
                Je comprends les conséquences de la suppression de mon compte
                {isProfessional && " professionnel"}
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-start sm:items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <Download className="h-5 w-5 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span>Étape 2 : Export de vos données</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              Avant de supprimer, téléchargez une copie de vos données
              personnelles{isProfessional && " et professionnelles"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs sm:text-sm text-gray-600">
              Conformément à l'article 20 du RGPD, vous avez le droit de
              récupérer vos données personnelles dans un format structuré et
              lisible par machine.
              {isProfessional &&
                " Cela inclut vos données professionnelles, clients, transactions et historique commercial."}
            </p>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm sm:text-base font-medium mb-2">
                Ce que contient l'export {isProfessional && "(Professionnel)"} :
              </h4>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                <li>• Informations de profil</li>
                <li>• Historique des messages</li>
                <li>• Commandes et réservations</li>
                {isProfessional && (
                  <>
                    <li>• Fiche professionnelle et services</li>
                    <li>• Produits et annonces</li>
                    <li>• Devis et factures</li>
                    <li>• Rendez-vous et demandes clients</li>
                    <li>• Historique des transactions</li>
                    <li>• Données de votre entreprise</li>
                  </>
                )}
                <li>• Préférences et paramètres</li>
                <li>• Historique d'activité</li>
              </ul>
            </div>

            <Button
              onClick={handleExportData}
              disabled={exportLoading}
              variant="outline"
              className="w-full text-xs sm:text-sm h-10 sm:h-auto"
            >
              {exportLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Export en cours...</span>
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Télécharger mes données {isProfessional && "professionnelles"}</span>
                </>
              )}
            </Button>

            {exportData && (
              <Alert className="bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <div>
                  <AlertTitle className="text-sm sm:text-base text-green-800">
                    Export réussi
                  </AlertTitle>
                  <AlertDescription className="text-xs sm:text-sm text-green-700 mt-1">
                    Vos données {isProfessional && "professionnelles "}ont été
                    téléchargées. Vous pouvez maintenant passer à l'étape
                    suivante.
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <div className="flex items-start sm:items-center gap-2 sm:gap-3 pt-2">
              <Checkbox
                id="dataExport"
                checked={steps.dataExport}
                onCheckedChange={() => handleInputChange("dataExport")}
                disabled={!exportData}
                className="mt-1 sm:mt-0"
              />
              <Label
                htmlFor="dataExport"
                className="text-xs sm:text-sm font-medium cursor-pointer"
              >
                J'ai bien exporté une copie de mes données
                {isProfessional && " professionnelles"}
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Professional Step */}
        {isProfessional && (
          <Card className="border-purple-200 bg-purple-50/30 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-start sm:items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <Briefcase className="h-5 w-5 flex-shrink-0 mt-0.5 sm:mt-0 text-purple-600" />
                <span>Étape spécifique : Données professionnelles</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Informations importantes concernant vos activités
                professionnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2 text-sm">
                  ⚠️ Impact sur votre activité professionnelle
                </h4>
                <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
                  <li>• Tous vos services seront supprimés définitivement</li>
                  <li>• Vos produits et annonces ne seront plus visibles</li>
                  <li>• Les demandes clients en cours seront annulées</li>
                  <li>• Vos avis et évaluations seront supprimés</li>
                  <li>• Votre fiche professionnelle disparaîtra du site</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2 text-sm">
                  Recommandations avant suppression
                </h4>
                <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                  <li>• Informez vos clients de la fermeture de votre compte</li>
                  <li>• Finalisez toutes les transactions en cours</li>
                  <li>
                    • Téléchargez vos documents professionnels (factures,
                    contrats)
                  </li>
                  <li>• Sauvegardez vos contacts clients importants</li>
                  <li>• Archivez vos données commerciales et comptables</li>
                </ul>
              </div>

              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <Checkbox
                  id="professionalData"
                  checked={steps.professionalData}
                  onCheckedChange={() => handleInputChange("professionalData")}
                  className="mt-1 sm:mt-0"
                />
                <Label
                  htmlFor="professionalData"
                  className="text-xs sm:text-sm font-medium cursor-pointer"
                >
                  J'ai pris en compte l'impact sur mon activité professionnelle
                  et sauvegardé mes données commerciales importantes
                </Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-start sm:items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <FileText className="h-5 w-5 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span>Étape 3 : Conséquences légales et obligations</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              Informations sur les délais et obligations légales
              {isProfessional && " (y compris obligations commerciales)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2 text-sm">
                Délais de suppression selon le RGPD
              </h4>
              <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                <li>• Suppression immédiate des données accessibles</li>
                <li>• Suppression des backups sous 30 jours maximum</li>
                <li>
                  • Conservation de certaines données pour obligations légales
                  (facturation) : 10 ans
                </li>
                <li>
                  • Droit à l'oubli effectif dans un délai maximum de 1 mois
                </li>
              </ul>
            </div>

            {isProfessional && (
              <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-800 mb-2 text-sm">
                  Obligations légales spécifiques aux professionnels
                </h4>
                <p className="text-xs sm:text-sm text-purple-700">
                  En tant que professionnel, certaines données pourront être
                  conservées plus longtemps pour des raisons légales : factures
                  clients, contrats signés, données comptables, obligations
                  fiscales, et archives commerciales.
                </p>
              </div>
            )}

            <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2 text-sm">
                Exceptions à la suppression immédiate
              </h4>
              <p className="text-xs sm:text-sm text-yellow-700">
                Certaines données pourront être conservées pour des raisons
                légales : factures, transactions financières, ou pour faire
                respecter nos conditions d'utilisation.
              </p>
            </div>

            <div className="flex items-start sm:items-center gap-2 sm:gap-3 pt-2">
              <Checkbox
                id="consequences"
                checked={steps.consequences}
                onCheckedChange={() => handleInputChange("consequences")}
                className="mt-1 sm:mt-0"
              />
              <Label
                htmlFor="consequences"
                className="text-xs sm:text-sm font-medium cursor-pointer"
              >
                Je comprends les délais et obligations légales
                {isProfessional && " pour mon activité professionnelle"}
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card className="border-red-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-start sm:items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span>Étape 4 : Confirmation finale</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              Dernière étape avant la suppression définitive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-800 mb-2 text-sm">
                ⚠️ Action irréversible
              </h4>
              <p className="text-xs sm:text-sm text-red-700 mb-2">
                En cochant cette case, vous confirmez que vous avez bien :
              </p>
              <ul className="text-xs sm:text-sm text-red-700 space-y-1">
                <li>
                  • Exporté vos données personnelles
                  {isProfessional && " et professionnelles"}
                </li>
                <li>
                  • Pris connaissance des conséquences
                  {isProfessional && " sur votre activité"}
                </li>
                <li>
                  • Sauvegardé les informations importantes
                  {isProfessional && " (clients, transactions, documents)"}
                </li>
                {isProfessional && <li>• Informé vos clients si nécessaire</li>}
                <li>• Compris que cette action est définitive</li>
              </ul>
            </div>

            <div className="flex items-start sm:items-center gap-2 sm:gap-3">
              <Checkbox
                id="confirm"
                checked={steps.confirm}
                onCheckedChange={() => handleInputChange("confirm")}
                className="mt-1 sm:mt-0"
              />
              <Label
                htmlFor="confirm"
                className="text-xs sm:text-sm font-medium cursor-pointer"
              >
                Je confirme vouloir supprimer définitivement mon compte
                {isProfessional &&
                  " professionnel et toutes mes données associées"}
              </Label>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 sm:pt-6 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" asChild className="w-full sm:w-auto text-sm">
              <Link to={isProfessional ? "/pro/profile" : "/mon-compte"}>
                Annuler
              </Link>
            </Button>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={!allStepsCompleted()}
                  className="w-full sm:w-auto gap-2 text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Supprimer mon compte{isProfessional && " professionnel"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-sm sm:max-w-md md:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-base sm:text-lg text-red-600">
                    Dernière vérification
                    {isProfessional && " - Compte Professionnel"}
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm">
                    Pour confirmer la suppression, veuillez entrer votre mot de
                    passe.
                    {isProfessional &&
                      " Cette action affectera également vos clients et votre activité commerciale."}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <Alert variant="destructive" className="text-xs sm:text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <AlertDescription>
                      {isProfessional ? (
                        <div className="space-y-1 ml-2">
                          <p className="font-medium">Cette action supprimera définitivement :</p>
                          <ul className="list-disc pl-4 space-y-0.5">
                            <li>Votre compte professionnel</li>
                            <li>Tous vos services et produits</li>
                            <li>Vos annonces et publications</li>
                            <li>Votre historique commercial</li>
                            <li>Vos relations clients</li>
                          </ul>
                        </div>
                      ) : (
                        "Cette action supprimera définitivement votre compte et toutes vos données."
                      )}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs sm:text-sm">
                      Mot de passe actuel
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Entrez votre mot de passe"
                      className="text-sm"
                    />
                  </div>

                  {isProfessional && (
                    <Alert
                      variant="default"
                      className="bg-orange-50 border-orange-200 text-xs sm:text-sm"
                    >
                      <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <AlertDescription className="text-orange-700 ml-2">
                        <strong>Note pour les professionnels :</strong>
                        Après suppression, vos clients ne pourront plus vous
                        contacter ni accéder à vos services.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                    className="text-sm"
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isLoading || !password}
                    className="text-sm"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Suppression...
                      </>
                    ) : (
                      `Supprimer${isProfessional ? " mon activité" : ""}`
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>

      {/* RGPD Info */}
      <div className="mt-8 sm:mt-10 p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
          Vos droits selon le RGPD
          {isProfessional && " (Professionnels inclus)"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              Article 17 - Droit à l'effacement
            </h4>
            <p>
              Vous avez le droit d'obtenir l'effacement de vos données
              personnelles dans les meilleurs délais.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              Article 20 - Droit à la portabilité
            </h4>
            <p>
              Vous avez le droit de recevoir vos données dans un format
              structuré et lisible par machine.
            </p>
          </div>
          {isProfessional && (
            <>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Article 6 - Base légale du traitement
                </h4>
                <p>
                  Les données professionnelles peuvent être traitées pour
                  l'exécution d'un contrat.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Article 30 - Registre des activités
                </h4>
                <p>
                  En tant que professionnel, vous avez des obligations
                  supplémentaires de gestion des données.
                </p>
              </div>
            </>
          )}
        </div>
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600 border-t border-gray-200 pt-4 sm:pt-6">
          <p>
            Pour toute question concernant la protection de vos données,
            contactez notre DPO à :{" "}
            <a
              href="mailto:dpo@oliplus.re"
              className="text-blue-600 hover:underline font-medium"
            >
              dpo@oliplus.re
            </a>
            {isProfessional && (
              <span>
                {" "}
                ou notre service dédié aux professionnels :{" "}
                <a
                  href="mailto:pro@servo.fr"
                  className="text-blue-600 hover:underline font-medium"
                >
                  pro@servo.fr
                </a>
              </span>
            )}
          </p>
          {isProfessional && (
            <p className="text-gray-600 italic">
              <strong>Note :</strong> En cas de cessation d'activité, pensez
              également à vous désinscrire des organismes professionnels.
            </p>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {isProfessional && (
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
            <Briefcase className="h-5 w-5 flex-shrink-0" />
            Récapitulatif pour votre activité
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="font-medium text-gray-900">Produits/Annonces :</span>
                <span className="text-red-700">
                  {exportData?.content?.products?.length || 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="font-medium text-gray-900">Biens immobiliers :</span>
                <span className="text-red-700">
                  {exportData?.content?.properties?.length || 0}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="font-medium text-gray-900">Clients :</span>
                <span className="text-red-700">
                  {exportData?.interactions?.orders?.asProvider?.length || 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="font-medium text-gray-900">Documents :</span>
                <span className="text-red-700">
                  {exportData?.documents?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccountPage;
