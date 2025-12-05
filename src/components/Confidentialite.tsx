import { useState } from 'react';
import { Lock, Shield, Eye, Database, Cookie, Users, ChevronDown, ExternalLink } from 'lucide-react';

const PrivacyPolicyWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(null);

    const privacySections = [
        {
            id: 'cookies',
            title: 'Cookies & Technologies',
            icon: Cookie,
            content: 'Nous utilisons des cookies essentiels et analytiques pour améliorer votre expérience. Les cookies peuvent être gérés dans vos paramètres de navigateur.'
        },
        {
            id: 'data',
            title: 'Collecte des Données',
            icon: Database,
            content: 'Nous collectons uniquement les données nécessaires au fonctionnement de nos services. Vos informations personnelles sont traitées avec la plus grande confidentialité.'
        },
        {
            id: 'usage',
            title: 'Utilisation des Informations',
            icon: Eye,
            content: 'Vos données servent à personnaliser votre expérience, améliorer nos services et vous fournir un support client adapté. Nous ne vendons pas vos informations.'
        },
        {
            id: 'protection',
            title: 'Protection des Données',
            icon: Shield,
            content: 'Nous implémentons des mesures de sécurité avancées incluant le chiffrement SSL, des pare-feux et des audits réguliers pour protéger vos données.'
        },
        {
            id: 'rights',
            title: 'Vos Droits',
            icon: Users,
            content: 'Conformément au RGPD, vous disposez du droit d\'accès, de rectification, d\'effacement et de portabilité de vos données. Contactez notre DPO pour exercer ces droits.'
        }
    ];

    return (
        <div className="w-full mt-16 max-w-6xl mx-auto py-8">
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm">
                        <Lock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                            Politique de Confidentialité
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow"
                    >
                        {isOpen ? 'Réduire' : 'Développer'}
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                </div>
            </div>

            {/* Contenu principal */}
            <div className={`space-y-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                {/* Introduction */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
                    <div className="flex items-start gap-4">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Notre Engagement pour votre Vie Privée
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                Nous accordons la plus haute importance à la protection de vos données personnelles.
                                Cette politique détaille comment nous collectons, utilisons et protégeons vos informations
                                dans le cadre de notre engagement pour la transparence et la conformité aux réglementations
                                en vigueur, notamment le Règlement Général sur la Protection des Données (RGPD).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sections détaillées */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {privacySections.map((section) => (
                        <div
                            key={section.id}
                            className={`bg-white border rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer ${activeSection === section.id
                                    ? 'border-blue-300 shadow-md ring-2 ring-blue-100'
                                    : 'border-gray-200 hover:border-blue-200'
                                }`}
                            onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg">
                                    <section.icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-gray-900 text-sm">
                                            {section.title}
                                        </h4>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${activeSection === section.id ? 'rotate-180' : ''
                                            }`} />
                                    </div>
                                    <div className={`text-gray-600 text-sm leading-relaxed transition-all ${activeSection === section.id ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
                                        }`}>
                                        {section.content}
                                    </div>
                                    <div className={`text-gray-600 text-sm leading-relaxed ${activeSection === section.id ? 'opacity-0 h-0' : 'opacity-100 line-clamp-2'
                                        }`}>
                                        {section.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bandeau d'informations */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Déclaration de Conformité
                            </h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Notre organisation est certifiée ISO 27001 et conforme au RGPD.
                                Nous effectuons des audits de sécurité trimestriels et maintenons
                                un registre des traitements à jour.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                                <div className="text-xs text-gray-300">Surveillance</div>
                            </div>
                            <div className="w-px bg-gray-700"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white mb-1">256-bit</div>
                                <div className="text-xs text-gray-300">Chiffrement SSL</div>
                            </div>
                            <div className="w-px bg-gray-700"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white mb-1">GDPR</div>
                                <div className="text-xs text-gray-300">Conforme</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact et Actions */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Contact DPO</h4>
                            <p className="text-sm text-gray-600 mb-3">
                                Pour toute question concernant la protection de vos données, contactez notre Délégué à la Protection des Données.
                            </p>
                            <a
                                href="https://holines.xyz/"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Servo
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Préférences</h4>
                            <p className="text-sm text-gray-600 mb-3">
                                Gérez vos préférences en matière de cookies et de marketing.
                            </p>
                            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors">
                                <a href="/cookies">
                                    Gérer les Cookies
                                </a>
                            </button>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
                            <div className="space-y-2">
                                <a
                                    href="/rgpd.pdf"
                                    className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <span>Politique complète (PDF)</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                                <a
                                    href="/mentions-legales"
                                    className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <span>Mentions légales</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                                <a
                                    href="/conditions-utilisation"
                                    className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <span>Conditions d'utilisation</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Version réduite */}
            <div className={`text-center pt-6 border-t border-gray-200 transition-all ${isOpen ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                <p className="text-sm text-gray-600">
                    Nous respectons votre vie privée.
                    <button
                        onClick={() => setIsOpen(true)}
                        className="ml-1 text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                        Cliquez ici pour consulter notre politique de confidentialité complète
                    </button>
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicyWidget;