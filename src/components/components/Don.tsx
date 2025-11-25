// components/Donation.tsx
import React, { useState } from 'react';
import {
    Heart,
    Shield,
    Trophy,
    BarChart3,
    CreditCard,
    Building,
    Lock,
    CheckCircle,
    Sparkles,
    Users,
    Target,
    Calendar
} from 'lucide-react';

// Types
interface DonationFormData {
    amount: number;
    customAmount: string;
    frequency: 'once' | 'monthly';
    name: string;
    email: string;
    message: string;
    paymentMethod: 'card' | 'paypal' | 'bank';
    anonymous: boolean;
}

interface DonationOption {
    value: number;
    label: string;
    impact: string;
    popular?: boolean;
}

// Donation options with impact descriptions
const donationOptions: DonationOption[] = [
    {
        value: 15,
        label: '15€',
        impact: 'Nourrit une personne pendant 3 jours'
    },
    {
        value: 30,
        label: '30€',
        impact: 'Fournit des kits éducatifs'
    },
    {
        value: 50,
        label: '50€',
        impact: 'Soutient une famille entière',
        popular: true
    },
    {
        value: 100,
        label: '100€',
        impact: 'Finance un projet communautaire'
    },
    {
        value: 0,
        label: 'Montant libre',
        impact: 'Faites la différence à votre mesure'
    }
];

const Donation: React.FC = () => {
    const [formData, setFormData] = useState<DonationFormData>({
        amount: 50,
        customAmount: '',
        frequency: 'once',
        name: '',
        email: '',
        message: '',
        paymentMethod: 'card',
        anonymous: false
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [showCustomAmount, setShowCustomAmount] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleAmountSelect = (amount: number) => {
        if (amount === 0) {
            setShowCustomAmount(true);
            setFormData(prev => ({ ...prev, amount: 0 }));
        } else {
            setShowCustomAmount(false);
            setFormData(prev => ({ ...prev, amount, customAmount: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulation de traitement
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Donation submitted:', {
                ...formData,
                finalAmount: showCustomAmount ? parseFloat(formData.customAmount) || 0 : formData.amount
            });
            alert('Merci pour votre généreux don ! Votre soutien transforme des vies.');
            // Reset form
            setFormData({
                amount: 50,
                customAmount: '',
                frequency: 'once',
                name: '',
                email: '',
                message: '',
                paymentMethod: 'card',
                anonymous: false
            });
            setShowCustomAmount(false);
        } catch (error) {
            console.error('Error processing donation:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsProcessing(false);
        }
    };

    const getFinalAmount = (): number => {
        return showCustomAmount ? parseFloat(formData.customAmount) || 0 : formData.amount;
    };

    const impactStories = [
        {
            icon: <Users className="w-6 h-6" />,
            title: "Communauté",
            description: "Plus de 10,000 personnes aidées chaque année"
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: "Efficacité",
            description: "92% des fonds directement aux projets"
        },
        {
            icon: <Calendar className="w-6 h-6" />,
            title: "Durabilité",
            description: "Engagés depuis 15 ans pour un changement durable"
        }
    ];

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl pt-16 mx-auto">
                {/* Header Section */}
                <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
                    <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
                    <img src="https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg" className='h-full object-cover w-full' alt="" />
                </div>
                <div className="text-center mb-10">
                    <h1 className="text-xl lg:text-4xl font-bold text-gray-100 mb-4">
                        Votre Soutien <span className="text-red-500">Transforme</span> des Vies
                    </h1>
                    <p className="text-md text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Rejoignez notre communauté de donateurs engagés et participez à créer
                        un impact durable pour les générations futures. Chaque don compte.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Donation Form - Takes 2/3 on large screens */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center mb-6">
                                <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
                                <h2 className="text-2xl font-bold text-gray-900">Faire un Don</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Frequency Selection */}
                                <div>
                                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                                        Choisissez votre engagement
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, frequency: 'once' }))}
                                            className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${formData.frequency === 'once'
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                                                    : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="text-2xl font-bold mb-2">Don Unique</div>
                                            <div className="text-sm text-gray-600">Soutien immédiat</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, frequency: 'monthly' }))}
                                            className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${formData.frequency === 'monthly'
                                                    ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                                                    : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="text-2xl font-bold mb-2">Don Mensuel</div>
                                            <div className="text-sm text-gray-600">Impact continu</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Amount Selection */}
                                <div>
                                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                                        Sélectionnez le montant de votre don
                                    </label>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                        {donationOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => handleAmountSelect(option.value)}
                                                className={`relative p-4 rounded-xl border-2 text-center transition-all duration-200 group ${formData.amount === option.value && !showCustomAmount
                                                        ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
                                                        : 'border-gray-200 hover:border-red-300 hover:shadow-sm'
                                                    } ${option.popular ? 'ring-2 ring-yellow-400' : ''}`}
                                            >
                                                <div className="text-xl font-bold mb-2">{option.label}</div>
                                                <div className="text-xs text-gray-500 group-hover:text-gray-700">
                                                    {option.impact}
                                                </div>
                                                {option.popular && (
                                                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs px-3 py-1 rounded-full font-bold">
                                                        Populaire
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom Amount Input */}
                                    {showCustomAmount && (
                                        <div className="mt-6 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                                            <label className="block text-lg font-semibold text-gray-800 mb-3">
                                                Montant personnalisé
                                            </label>
                                            <div className="flex items-center space-x-4">
                                                <input
                                                    type="number"
                                                    name="customAmount"
                                                    value={formData.customAmount}
                                                    onChange={handleInputChange}
                                                    min="1"
                                                    step="0.01"
                                                    placeholder="Entrez le montant"
                                                    className="flex-1 p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                                                    required
                                                />
                                                <span className="text-xl font-semibold text-gray-600">€</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Personal Information */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                        <Users className="w-5 h-5 mr-2 text-blue-500" />
                                        Vos informations
                                    </h3>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nom complet
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                                placeholder="Votre nom"
                                                required={!formData.anonymous}
                                                disabled={formData.anonymous}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Adresse email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                                placeholder="votre@email.com"
                                                required={!formData.anonymous}
                                                disabled={formData.anonymous}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            name="anonymous"
                                            checked={formData.anonymous}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label className="text-sm text-gray-700">
                                            Faire un don anonyme
                                        </label>
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Un message d'encouragement (optionnel)
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        placeholder="Partagez un message d'espoir avec notre communauté..."
                                    />
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                                        Méthode de paiement sécurisée
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { value: 'card', label: 'Carte', icon: CreditCard },
                                            { value: 'paypal', label: 'PayPal', icon: Building },
                                            { value: 'bank', label: 'Virement', icon: BarChart3 }
                                        ].map(({ value, label, icon: Icon }) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: value as any }))}
                                                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${formData.paymentMethod === value
                                                        ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                                                        : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
                                                    }`}
                                            >
                                                <Icon className="w-8 h-8 mx-auto mb-2" />
                                                <div className="font-semibold">{label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isProcessing || getFinalAmount() <= 0}
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-6 px-8 rounded-xl font-bold text-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform shadow-lg"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                            Traitement en cours...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <Heart className="w-6 h-6 mr-3" />
                                            Faire un don de {getFinalAmount()}€ {formData.frequency === 'monthly' ? 'par mois' : ''}
                                        </div>
                                    )}
                                </button>

                                {/* Security Notice */}
                                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                                    <Lock className="w-4 h-4" />
                                    <span>Paiement 100% sécurisé SSL - Vos données sont protégées</span>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar - Impact and Trust */}
                    <div className="space-y-6">
                        {/* Donation Summary */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                                Récapitulatif de votre don
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-gray-600">Montant du don:</span>
                                    <span className="text-3xl font-bold text-red-600">
                                        {getFinalAmount()}€
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-gray-600">Engagement:</span>
                                    <span className={`font-semibold text-lg ${formData.frequency === 'once' ? 'text-blue-600' : 'text-green-600'
                                        }`}>
                                        {formData.frequency === 'once' ? 'Don unique' : 'Don mensuel'}
                                    </span>
                                </div>

                                {formData.frequency === 'monthly' && (
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="text-gray-600">Impact annuel:</span>
                                        <span className="text-xl font-bold text-green-600">
                                            {(getFinalAmount() * 12).toFixed(0)}€
                                        </span>
                                    </div>
                                )}

                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <div className="flex justify-between items-center text-green-800">
                                        <span>Frais de traitement:</span>
                                        <span className="font-semibold">Offerts</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Impact Stories */}
                        <div className="bg-slate-900 rounded-2xl shadow-xl p-6 text-white">
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <Target className="w-5 h-5 mr-2" />
                                Votre Impact Immédiat
                            </h3>
                            <div className="space-y-4">
                                {impactStories.map((story, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                            {story.icon}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{story.title}</div>
                                            <div className="text-sm text-blue-100">{story.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <Shield className="w-5 h-5 mr-2 text-blue-500" />
                                Confiance et Transparence
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    <div>
                                        <div className="font-semibold text-gray-800">Reconnue d'utilité publique</div>
                                        <div className="text-sm text-gray-600">Depuis 2008</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <BarChart3 className="w-5 h-5 text-green-500" />
                                    <div>
                                        <div className="font-semibold text-gray-800">92% des dons aux projets</div>
                                        <div className="text-sm text-gray-600">Rapports financiers publics</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Users className="w-5 h-5 text-red-500" />
                                    <div>
                                        <div className="font-semibold text-gray-800">50,000 donateurs</div>
                                        <div className="text-sm text-gray-600">Communauté engagée</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Urgency Callout */}
                        <div className="bg-red-50 rounded-2xl border-2 border-red-200 p-6">
                            <div className="text-center">
                                <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
                                <h4 className="font-bold text-red-800 text-lg mb-2">
                                    Votre aide est cruciale
                                </h4>
                                <p className="text-red-600 text-sm">
                                    Chaque don, quel que soit son montant, contribue directement à changer des vies.
                                    Rejoignez-nous dans cette mission essentielle.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Donation;