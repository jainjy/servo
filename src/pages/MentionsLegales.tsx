import React from "react";
import { Building, Mail, Phone, MapPin, FileText, ArrowLeft, Shield, Globe, Scale, Copyright } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MentionsLegales() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto pt-10">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </Button>

                {/* Header - Style similaire à Estrela */}
                <div className="mb-12">
                    <div className="flex">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-logo rounded-2xl mb-6">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white ml-4 mb-4 self-center">
                            Mentions Légales
                        </h1>
                    </div>
                    <div className="w-24 h-1 bg-logo mb-6"></div>
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Conformément aux dispositions légales en vigueur
                        </p>
                        <p className="text-gray-100 dark:text-gray-500 bg-logo rounded-lg p-1 px-5 text-xs animate-pulse mt-2">
                            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                        </p>
                    </div>
                </div>

                {/* Content Container */}
                <div className="space-y-8">
                    {/* Section 1: Éditeur du site */}
                    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-l-4 border-logo">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Building className="w-5 h-5 text-logo dark:text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                1. Éditeur du Site
                            </h2>
                        </div>
                        <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 pl-11">
                            <div className="pb-3 border-b border-gray-100 dark:border-gray-700">
                                <p className="font-semibold text-gray-900 dark:text-white mb-1">Dénomination sociale</p>
                                <p className="text-gray-700 dark:text-gray-300">OLIPLUS</p>
                            </div>
                            <div className="pb-3 border-b border-gray-100 dark:border-gray-700">
                                <p className="font-semibold text-gray-900 dark:text-white mb-1">Forme juridique</p>
                                <p className="text-gray-700 dark:text-gray-300">SARL (Société à Responsabilité Limitée)</p>
                            </div>
                            <div className="pb-3 border-b border-gray-100 dark:border-gray-700">
                                <p className="font-semibold text-gray-900 dark:text-white mb-1">Capital social</p>
                                <p className="text-gray-700 dark:text-gray-300">45 rue Monseigneur de Beaumont, 97400 Saint-Denis.</p>
                            </div>
                            <div className="pb-3 border-b border-gray-100 dark:border-gray-700">
                                <p className="font-semibold text-gray-900 dark:text-white mb-1">Siège social</p>
                                <p className="text-gray-700 dark:text-gray-300">45 rue Monseigneur de Beaumont, 97400 Saint-Denis.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white mb-1">Numéro SIRET</p>
                                <p className="text-gray-700 dark:text-gray-300">OLIPLUS, EURL, immatriculée sous le n° 943 536 540</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Contact */}
                    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-l-4 border-green-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                2. Informations de Contact
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11">
                            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Contact Général
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                            <a href="mailto:contact@servo.mg" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                contact@servo.mg
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                            <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
                                            <p className="text-gray-900 dark:text-white">+261 XX XX XX XX</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Protection des Données
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                                            <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">DPO</p>
                                            <a href="mailto:dpo@oliplus.re" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                                dpo@oliplus.re
                                            </a>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        Contactez notre Délégué à la Protection des Données pour exercer vos droits RGPD
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Hébergement */}
                    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-l-4 border-purple-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                3. Hébergement
                            </h2>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 pl-11">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hébergeur</p>
                                    <p className="font-medium text-gray-900 dark:text-white">À compléter</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Localisation</p>
                                    <p className="font-medium text-gray-900 dark:text-white">À compléter</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sécurité</p>
                                    <p className="font-medium text-gray-900 dark:text-white">SSL/TLS activé</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Conformité</p>
                                    <p className="font-medium text-gray-900 dark:text-white">RGPD compatible</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Propriété intellectuelle */}
                    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-l-4 border-yellow-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                <Copyright className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                4. Propriété Intellectuelle
                            </h2>
                        </div>
                        <div className="space-y-4 pl-11">
                            <p className="text-gray-700 dark:text-gray-300">
                                L'ensemble des éléments composant le site OLIPLUS Platform (textes, graphismes, logos, images, sons, vidéos, etc.) sont la propriété exclusive de OLIPLUS Platform ou de ses partenaires.
                            </p>
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 p-4 rounded-r">
                                <p className="text-gray-700 dark:text-gray-300 font-medium">
                                    Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 5: Protection des données */}
                    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-l-4 border-red-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                5. Protection des Données Personnelles
                            </h2>
                        </div>
                        <div className="space-y-6 pl-11">
                            <p className="text-gray-700 dark:text-gray-300">
                                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi informatique et libertés, vous disposez des droits suivants concernant vos données personnelles :
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: "Droit d'accès", desc: "Accéder à vos données personnelles" },
                                    { title: "Droit de rectification", desc: "Corriger des données inexactes" },
                                    { title: "Droit à l'effacement", desc: "Supprimer vos données" },
                                    { title: "Droit d'opposition", desc: "S'opposer au traitement" },
                                    { title: "Droit à la limitation", desc: "Limiter le traitement" },
                                    { title: "Droit à la portabilité", desc: "Récupérer vos données" }
                                ].map((right, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                        <p className="font-semibold text-gray-900 dark:text-white mb-1">{right.title}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{right.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="text-gray-700 dark:text-gray-300">
                                    Pour exercer ces droits, contactez notre Délégué à la Protection des Données à l'adresse :
                                    <a href="mailto:dpo@oliplus.re" className="text-red-600 dark:text-red-400 font-semibold ml-1 hover:underline">
                                        dpo@oliplus.re
                                    </a>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 6: Responsabilité */}
                    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-l-4 border-gray-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <Scale className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                6. Limitation de Responsabilité
                            </h2>
                        </div>
                        <div className="space-y-4 pl-11">
                            <p className="text-gray-700 dark:text-gray-300">
                                OLIPLUS Platform met tout en œuvre pour assurer l'exactitude et la mise à jour des informations diffusées sur son site. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 italic">
                                <p className="text-gray-700 dark:text-gray-300">
                                    OLIPLUS Platform décline toute responsabilité pour tout dommage direct ou indirect résultant de l'accès ou de l'utilisation de ce site, ou de l'impossibilité d'y accéder.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 7: Loi applicable */}
                    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-l-4 border-indigo-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                7. Droit Applicable
                            </h2>
                        </div>
                        <div className="space-y-4 pl-11">
                            <p className="text-gray-700 dark:text-gray-300">
                                Les présentes mentions légales sont régies par le droit malgache. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents seront ceux de Madagascar.
                            </p>
                            <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-4">
                                <p className="text-gray-700 dark:text-gray-300 font-medium">
                                    Conformément aux dispositions du RGPD, vous disposez également du droit d'introduire une réclamation auprès de l'autorité de contrôle compétente.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="bg-logo rounded-2xl shadow-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Des questions sur nos mentions légales ?
                        </h2>
                        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                            Notre équipe est à votre disposition pour répondre à toutes vos interrogations concernant nos mentions légales et notre politique de protection des données.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="secondary"
                                className="bg-white text-blue-600 hover:bg-gray-100"
                                onClick={() => window.location.href = 'mailto:contact@servo.mg'}
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Nous contacter
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-transparent border-white text-white hover:bg-white/10"
                                onClick={() => navigate('/politique-confidentialite')}
                            >
                                Politique de confidentialité
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}