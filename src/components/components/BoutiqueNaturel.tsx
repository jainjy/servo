import React, { useRef, useState } from 'react';
import { Leaf, Heart, Sparkles, Star, ShoppingCart, Plus, Minus, Eye, ArrowRight, Truck, Shield, Clock, ShoppingCartIcon, AlertTriangle, Search } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    rating: number;
    benefits: string[];
    inStock: boolean;
    featured: boolean;
}

interface ProductCardProps {
    product: Product;
    onQuickView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group overflow-hidden">
            {/* Badge Featured */}
            {product.featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    ⭐ Produit Phare
                </div>
            )}

            {/* Image */}
            <div className="relative overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Quick View Button */}
                <button
                    onClick={() => onQuickView(product)}
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                    <Eye className="w-4 h-4 text-gray-700" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Category */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        {product.category}
                    </span>
                    <div className="flex items-center text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs ml-1 text-gray-600">{product.rating}</span>
                    </div>
                </div>

                {/* Name & Description */}
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                </p>

                {/* Benefits */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {product.benefits.slice(0, 2).map((benefit, index) => (
                        <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                            {benefit}
                        </span>
                    ))}
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-emerald-600">
                            {product.price.toFixed(2)}€
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                                {product.originalPrice.toFixed(2)}€
                            </span>
                        )}
                    </div>

                    <button className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors hover:scale-105">
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>

                {/* Stock Status */}
                <div className={`text-xs mt-2 ${product.inStock ? 'text-green-100 font-bold bg-green-600 w-20 flex rounded-full p-2 ' : 'text-red-100 font-bold bg-red-600 w-36 flex rounded-full p-2'}`}>
                    {product.inStock ? (
                        <>
                            <ShoppingCartIcon className="w-3 h-3 mr-1" />
                            En stock
                        </>
                    ) : (
                        <>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Rupture de stock
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

/*************  Windsurf Command  *************/
/**
 * BoutiqueBienEtre component
 *
 * Displays the e-commerce store page with hero section, features, categories, products grid, newsletter and quick view modal.
 *
 * @return {React.Component} A React component representing the e-commerce store page.
 */
/*******  fa6afbdf-4435-41c0-b7fb-23033d190e5a  *******/const BoutiqueBienEtre: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('tous');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    const sectionRef = useRef<HTMLDivElement>(null);

    const scrollToSection = () => {
        sectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };
    const products: Product[] = [
        {
            id: 1,
            name: "Huile Essentielle de Lavande",
            description: "Huile essentielle pure pour relaxation et sommeil réparateur. Produit 100% naturel et biologique.",
            price: 12.90,
            originalPrice: 15.90,
            image: "https://i.pinimg.com/736x/4d/11/69/4d1169db7a9cdde4d0182d0bfb73bb52.jpg",
            category: "Huiles Essentielles",
            rating: 4.8,
            benefits: ["Relaxation", "Sommeil", "Anti-stress"],
            inStock: true,
            featured: true
        },
        {
            id: 2,
            name: "Thé Vert Matcha Bio",
            description: "Matcha premium japonais riche en antioxydants pour l'énergie et la concentration.",
            price: 24.50,
            image: "https://i.pinimg.com/1200x/2c/e5/54/2ce554437d2e0e036297bd67dae73037.jpg",
            category: "Thés & Infusions",
            rating: 4.9,
            benefits: ["Énergie", "Antioxydants", "Concentration"],
            inStock: true,
            featured: true
        },
        {
            id: 3,
            name: "Bougie Naturelle à la Cire de Soja",
            description: "Bougie parfumée aux huiles essentielles, cire 100% végétale, mèche coton.",
            price: 18.00,
            image: "https://i.pinimg.com/1200x/13/e0/b5/13e0b52ed51c7dfe7b7d89bbd9b1f058.jpg",
            category: "Ambiance & Relaxation",
            rating: 4.6,
            benefits: ["Ambiance", "Naturel", "Longue durée"],
            inStock: true,
            featured: false
        },
        {
            id: 4,
            name: "Roller Stress Stop aux Plantes",
            description: "Synergie d'huiles essentielles en roller pour apaiser instantanément les tensions.",
            price: 9.90,
            image: "https://i.pinimg.com/736x/7b/15/c1/7b15c1eea303a45bb231665e2aebac05.jpg",
            category: "Soins Bien-être",
            rating: 4.7,
            benefits: ["Stress", "Rapidité", "Pratique"],
            inStock: true,
            featured: false
        },
        {
            id: 5,
            name: "Complexe de Vitamines Bio",
            description: "Mélange de vitamines et minéraux essentiels pour booster votre immunité naturellement.",
            price: 29.90,
            image: "https://i.pinimg.com/1200x/bd/14/6a/bd146a09437e560fbd86d37240b3585b.jpg",
            category: "Compléments Alimentaires",
            rating: 4.5,
            benefits: ["Immunité", "Énergie", "Naturel"],
            inStock: false,
            featured: false
        },
        {
            id: 6,
            name: "Diffuseur Ultrasonique Bambou",
            description: "Diffuseur design en bambou pour purifier l'air et diffuser vos huiles essentielles.",
            price: 45.00,
            originalPrice: 55.00,
            image: "https://i.pinimg.com/736x/51/b4/41/51b44175cf8228773b048a51864bfaad.jpg",
            category: "Accessoires",
            rating: 4.8,
            benefits: ["Design", "Silencieux", "Efficace"],
            inStock: true,
            featured: true
        }
    ];

    const categories = [
        { id: 'tous', name: 'Tous les produits', count: products.length },
        { id: 'Huiles Essentielles', name: 'Huiles Essentielles', count: products.filter(p => p.category === 'Huiles Essentielles').length },
        { id: 'Thés & Infusions', name: 'Thés & Infusions', count: products.filter(p => p.category === 'Thés & Infusions').length },
        { id: 'Soins Bien-être', name: 'Soins Bien-être', count: products.filter(p => p.category === 'Soins Bien-être').length },
        { id: 'Compléments Alimentaires', name: 'Compléments', count: products.filter(p => p.category === 'Compléments Alimentaires').length },
        { id: 'Accessoires', name: 'Accessoires', count: products.filter(p => p.category === 'Accessoires').length }
    ];

    const filteredProducts = selectedCategory === 'tous'
        ? products
        : products.filter(product => product.category === selectedCategory);

    // Appliquer le filtre de recherche sur les produits filtrés par catégorie
    const searchFilteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.benefits.some(benefit => benefit.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const features = [
        {
            icon: <Leaf className="w-6 h-6" />,
            title: "100% Naturel",
            description: "Des produits biologiques et naturels certifiés"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Qualité Premium",
            description: "Sélection rigoureuse des meilleurs ingrédients"
        },
        {
            icon: <Truck className="w-6 h-6" />,
            title: "Livraison Rapide",
            description: "Expédition sous 24h et livraison offerte dès 50€"
        },
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Bien-être Garanti",
            description: "Des résultats visibles pour votre santé naturelle"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50/30">
            {/* Hero Section */}
            <div className="bg-gradient-to-r rounded-lg from-emerald-600 to-teal-600 text-white py-8">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-4xl font-bold mb-6">
                        Boutique & Produits Naturels
                    </h1>
                    <p className="text-md text-emerald-100 max-w-2xl mx-auto mb-8 leading-relaxed">
                        Découvrez notre sélection de produits 100% naturels pour prendre soin de vous
                        et retrouver l'harmonie entre corps et esprit.
                    </p>
                    <button onClick={scrollToSection} className="bg-white text-emerald-600 px-8 py-2 rounded-full font-bold transition-transform shadow-lg">
                        Découvrir la Boutique
                        <ArrowRight className="w-5 h-5 ml-2 inline" />
                    </button>
                </div>
            </div>

            {/* Features */}
            <div className="max-w-6xl mx-auto py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg border border-emerald-100">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Categories */}
                <div ref={sectionRef} className='bg-white py-5 px-2 rounded-2xl shadow-lg mb-12'>
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                            Nos Catégories
                        </h2>

                        {/* Barre de recherche */}
                        <div className="mb-8 max-w-md mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.id
                                        ? 'bg-emerald-600 text-white shadow-lg'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                        }`}
                                >
                                    {category.name}
                                    <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${selectedCategory === category.id
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {category.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="mb-16">
                        {searchFilteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {searchFilteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onQuickView={setQuickViewProduct}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                                    Aucun produit trouvé
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {searchQuery
                                        ? `Aucun produit ne correspond à "${searchQuery}"`
                                        : 'Aucun produit disponible dans cette catégorie'}
                                </p>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        Réinitialiser la recherche
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {/* Newsletter */}
                <div className="bg-white  rounded-2xl p-8 text-slate-900 text-center">
                    <h3 className="text-2xl  font-bold mb-4">
                        Recevez nos Conseils Bien-être
                    </h3>
                    <p className="text-amber-800 text-xs mb-6 max-w-md mx-auto">
                        Inscrivez-vous à notre newsletter et recevez des conseils exclusifs
                        et 10% de réduction sur votre première commande.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Votre email"
                            className="flex-1 px-4 py-3 rounded-lg text-gray-900 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-100"
                        />
                        <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                            S'abonner
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick View Modal */}
            {quickViewProduct && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="grid md:grid-cols-2 gap-8 p-6">
                            {/* Image */}
                            <div className="relative">
                                <img
                                    src={quickViewProduct.image}
                                    alt={quickViewProduct.name}
                                    className="w-full h-64 md:h-80 object-cover rounded-2xl"
                                />
                                {quickViewProduct.featured && (
                                    <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        Produit Phare
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="space-y-4">
                                <button
                                    onClick={() => setQuickViewProduct(null)}
                                    className="ml-auto block text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>

                                <div>
                                    <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                        {quickViewProduct.category}
                                    </span>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                        {quickViewProduct.name}
                                    </h3>
                                    <div className="flex items-center mt-1">
                                        <div className="flex text-amber-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(quickViewProduct.rating) ? 'fill-current' : ''}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600 ml-2">({quickViewProduct.rating})</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 leading-relaxed">
                                    {quickViewProduct.description}
                                </p>

                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-900">Bienfaits :</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {quickViewProduct.benefits.map((benefit, index) => (
                                            <span
                                                key={index}
                                                className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm"
                                            >
                                                {benefit}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl font-bold text-emerald-600">
                                            {quickViewProduct.price.toFixed(2)}€
                                        </span>
                                        {quickViewProduct.originalPrice && (
                                            <span className="text-lg text-gray-400 line-through">
                                                {quickViewProduct.originalPrice.toFixed(2)}€
                                            </span>
                                        )}
                                    </div>

                                    <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center">
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Ajouter au panier
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoutiqueBienEtre;