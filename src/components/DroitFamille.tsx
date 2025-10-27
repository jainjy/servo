import { useState } from "react";
import '@/styles/font.css'

export default function DroitFamille() {
    const [openModal, setOpenModal] = useState(null);

    const closeModal = () => setOpenModal(null);

    return (
        <div className="min-h-screen bg-slate-50 text-gray-100 mt-12 flex flex-col">
            {/* HEADER */}
            <header
                style={{ backgroundImage: 'url("/fam.jfif")', backgroundSize: 'cover' }}
                className="relative border-b py-8 bg-black overflow-hidden h-60 text-center">
                <div className="absolute bg-black/75 backdrop-blur-sm top-0 left-0 w-full h-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                    <h1 className="text-5xl font-semibold text-slate-100 azonix tracking-widest">Droit de la famille</h1>
                    <p className="text-gray-400 text-sm mt-5">Accompagnement juridique et notarial complet</p>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 max-w-5xl mx-auto px-6 py-12 space-y-16">
                {/* Section 1 */}
                <section>
                    <h2 className="text-2xl text-slate-900 font-semibold mb-6 border-l-4 border-slate-500 pl-3">
                        Nos domaines d’intervention
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {["Divorce", "Succession", "Donation"].map((item) => (
                            <div
                                key={item}
                                className="bg-gray-800 hover:bg-gray-700 transition rounded-xl p-6 shadow-lg"
                            >
                                <h3 className="text-lg font-semibold mb-2">{item}</h3>
                                <p className="text-sm text-gray-400">
                                    Nous vous accompagnons dans vos démarches de {item.toLowerCase()} avec écoute et expertise notariale.
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 2 */}
                <section>
                    <h2 className="text-2xl text-slate-900 font-semibold mb-6 border-l-4 border-slate-500 pl-3">
                        Nos services personnalisés
                    </h2>

                    <div className="space-y-4">
                        <button
                            onClick={() => setOpenModal("estimation")}
                            className="w-full text-left bg-slate-800 hover:bg-slate-700 transition p-4 rounded-lg font-medium"
                        >
                            Demande une estimation
                        </button>

                        <button
                            onClick={() => setOpenModal("notaire")}
                            className="w-full text-left bg-slate-700 hover:bg-slate-600 transition p-4 rounded-lg font-medium"
                        >
                            Accompagnement via un notaire (prise de RDV + envoi de pièces)
                        </button>

                        <button
                            onClick={() => setOpenModal("defiscalisation")}
                            className="w-full text-left bg-slate-800 hover:bg-slate-700 transition p-4 rounded-lg font-medium"
                        >
                            Défiscalisation (programmes neufs, promoteurs)
                        </button>

                        <button
                            onClick={() => setOpenModal("credit")}
                            className="w-full text-left bg-slate-700 hover:bg-slate-600 transition p-4 rounded-lg font-medium"
                        >
                            Aide au montage de dossier crédit d’impôts (Article 244 Quater W)
                        </button>
                    </div>
                </section>
            </main>

            {/* MODALES */}
            {openModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg shadow-xl">
                        <h3 className="text-xl font-semibold mb-4">
                            {openModal === "estimation" && "Demande d’estimation"}
                            {openModal === "notaire" && "Prise de rendez-vous avec un notaire"}
                            {openModal === "defiscalisation" && "Défiscalisation immobilière"}
                            {openModal === "credit" && "Aide au dossier crédit d’impôt"}
                        </h3>

                        {/* FORMULAIRES */}
                        {openModal === "estimation" && (
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nom complet"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <textarea
                                    placeholder="Détails du bien ou de la situation"
                                    rows={4}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                                <button className="bg-blue-600 hover:bg-blue-500 rounded-lg w-full py-2 font-semibold">
                                    Envoyer la demande
                                </button>
                            </form>
                        )}

                        {openModal === "notaire" && (
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nom complet"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <input
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <input
                                    type="date"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <input
                                    type="file"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                                />
                                <button className="bg-blue-600 hover:bg-blue-500 rounded-lg w-full py-2 font-semibold">
                                    Prendre rendez-vous
                                </button>
                            </form>
                        )}

                        {openModal === "defiscalisation" && (
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nom complet"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <input
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <textarea
                                    placeholder="Projet immobilier ou investissement"
                                    rows={4}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                ></textarea>
                                <button className="bg-blue-600 hover:bg-blue-500 rounded-lg w-full py-2 font-semibold">
                                    Demander un accompagnement
                                </button>
                            </form>
                        )}

                        {openModal === "credit" && (
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nom complet"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <input
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                />
                                <textarea
                                    placeholder="Détails de votre demande (type de travaux, dépenses, etc.)"
                                    rows={4}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                                ></textarea>
                                <button className="bg-blue-600 hover:bg-blue-500 rounded-lg w-full py-2 font-semibold">
                                    Soumettre la demande
                                </button>
                            </form>
                        )}

                        <button
                            onClick={closeModal}
                            className="mt-6 w-full text-gray-400 hover:text-gray-200 text-sm"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
