
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Mail,
  User,
  Building,
  Calendar,
  Star,
  ArrowRight,
} from "lucide-react";
const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, plan, metiers, metiersLabel } = location.state || {};
  console.log({ user, plan, metiers, metiersLabel } );
  const handleGoToDashboard = () => {
    navigate("/pro");
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-1">
            <div className="bg-white rounded-t-2xl p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-200 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
                Félicitations !
              </CardTitle>
              <p className="text-gray-600 text-lg mb-2">
                Votre inscription professionnelle est confirmée. Essai gratuit
                de 2 mois activé.
              </p>
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                <Star className="h-4 w-4" />
                Compte Professionnel Activé
              </div>
            </div>
          </div>
          <CardContent className="p-8">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informations utilisateur */}
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Vos informations
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Nom complet</p>
                      <p className="font-semibold">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{user?.email}</p>
                    </div>
                  </div>

                  {user?.companyName && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Building className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Entreprise</p>
                        <p className="font-semibold">{user.companyName}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Détails de l'abonnement */}
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Votre abonnement
                </h3>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Forfait:</span>
                      <span className="font-bold text-blue-700">
                        {plan?.planTitle}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Période:</span>
                      <span className="font-semibold">
                        {plan?.period === "month" ? "Mensuel" : "Annuel"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                      <span className="text-gray-600">Montant:</span>
                      <span className="font-bold text-xl text-green-600">
                        {plan?.price} €
                      </span>
                    </div>
                  </div>
                </div>

                {/* Métiers */}
                {metiers && metiers.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Vos métiers ({metiers.length})
                    </h4>
                    <div className="space-y-2">
                      {metiers.map((metier, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-green-50 text-green-700 rounded-lg text-sm"
                        >
                          <CheckCircle className="h-4 w-4" />
                          {metiersLabel[metier]}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prochaines étapes */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-4 text-lg">
                🚀 Prochaines étapes pour démarrer
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-xs">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">
                      Vérifiez votre email
                    </p>
                    <p className="text-blue-700">
                      Confirmation et accès à la plateforme
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-xs">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">
                      Complétez votre profil
                    </p>
                    <p className="text-blue-700">
                      Ajoutez photos et descriptions
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-xs">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">
                      Configurez vos services
                    </p>
                    <p className="text-blue-700">
                      Définissez tarifs et disponibilités
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-xs">4</span>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">
                      Recevez vos premières demandes
                    </p>
                    <p className="text-blue-700">
                      Commencez à développer votre activité
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-200"
              onClick={handleGoToDashboard}
            >
              Accéder à mon tableau de bord
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default SuccessPage;