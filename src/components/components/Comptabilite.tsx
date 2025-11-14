import React, { useState, useEffect } from 'react';

// Types et interfaces
interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  paymentMethod: string;
  client?: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface Invoice {
  id: string;
  number: string;
  client: string;
  date: Date;
  dueDate: Date;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  items: InvoiceItem[];
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  accountsReceivable: number;
  cashFlow: number;
  taxEstimate: number;
  profitMargin: number;
}

interface ComptabiliteEntrepriseProps {
  entrepriseId: string;
  regimeFiscal?: 'auto-entrepreneur' | 'sas' | 'sarl' | 'ei';
  anneeFiscale?: number;
}

const ComptabiliteEntreprise: React.FC<ComptabiliteEntrepriseProps> = ({ 
  entrepriseId, 
  regimeFiscal = 'sarl',
  anneeFiscale = 2024
}) => {
  // États
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [factures, setFactures] = useState<Invoice[]>([]);
  const [resumeFinancier, setResumeFinancier] = useState<FinancialSummary>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    accountsReceivable: 0,
    cashFlow: 0,
    taxEstimate: 0,
    profitMargin: 0
  });
  const [ongletActif, setOngletActif] = useState<'tableau-bord' | 'transactions' | 'factures' | 'rapports'>('tableau-bord');
  const [periodeSelectionnee, setPeriodeSelectionnee] = useState<'mois' | 'trimestre' | 'annee'>('mois');
  const [nouvelleTransaction, setNouvelleTransaction] = useState<Partial<Transaction>>({
    type: 'income',
    category: 'services',
    paymentMethod: 'virement'
  });

  // Données simulées
  useEffect(() => {
    const transactionsSimulees: Transaction[] = [
      {
        id: '1',
        date: new Date('2024-01-15'),
        amount: 12500,
        description: 'Prestation de services conseil - Client A',
        category: 'services',
        type: 'income',
        paymentMethod: 'virement',
        client: 'Entreprise A',
        status: 'completed'
      },
      {
        id: '2',
        date: new Date('2024-01-10'),
        amount: 2450,
        description: 'Achat matériel informatique',
        category: 'equipement',
        type: 'expense',
        paymentMethod: 'carte',
        status: 'completed'
      },
      {
        id: '3',
        date: new Date('2024-01-08'),
        amount: 8500,
        description: 'Développement application mobile',
        category: 'developpement',
        type: 'income',
        paymentMethod: 'virement',
        client: 'Startup B',
        status: 'completed'
      },
      {
        id: '4',
        date: new Date('2024-01-05'),
        amount: 1200,
        description: 'Frais de déplacement professionnel',
        category: 'deplacement',
        type: 'expense',
        paymentMethod: 'carte',
        status: 'completed'
      }
    ];

    const facturesSimulees: Invoice[] = [
      {
        id: '1',
        number: 'FAC-2024-001',
        client: 'Entreprise A',
        date: new Date('2024-01-01'),
        dueDate: new Date('2024-01-31'),
        amount: 12500,
        status: 'paid',
        items: [
          { description: 'Prestation conseil stratégique', quantity: 50, unitPrice: 250 }
        ]
      },
      {
        id: '2',
        number: 'FAC-2024-002',
        client: 'Startup B',
        date: new Date('2024-01-15'),
        dueDate: new Date('2024-02-15'),
        amount: 8500,
        status: 'unpaid',
        items: [
          { description: 'Développement application mobile', quantity: 1, unitPrice: 8500 }
        ]
      },
      {
        id: '3',
        number: 'FAC-2024-003',
        client: 'Société C',
        date: new Date('2024-01-20'),
        dueDate: new Date('2024-02-20'),
        amount: 32000,
        status: 'unpaid',
        items: [
          { description: 'Audit système informatique', quantity: 1, unitPrice: 20000 },
          { description: 'Formation équipe technique', quantity: 2, unitPrice: 6000 }
        ]
      }
    ];

    setTransactions(transactionsSimulees);
    setFactures(facturesSimulees);
    calculerResumeFinancier(transactionsSimulees, facturesSimulees);
  }, []);

  // Calcul du résumé financier
  const calculerResumeFinancier = (transactions: Transaction[], factures: Invoice[]) => {
    const totalRevenue = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const accountsReceivable = factures
      .filter(i => i.status === 'unpaid')
      .reduce((sum, i) => sum + i.amount, 0);

    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    
    // Estimation des taxes selon le régime fiscal
    const tauxImposition = regimeFiscal === 'auto-entrepreneur' ? 0.22 : 
                          regimeFiscal === 'sas' ? 0.28 : 
                          regimeFiscal === 'sarl' ? 0.25 : 0.22;
    const taxEstimate = netProfit * tauxImposition;

    setResumeFinancier({
      totalRevenue,
      totalExpenses,
      netProfit,
      accountsReceivable,
      cashFlow: totalRevenue - totalExpenses,
      taxEstimate,
      profitMargin
    });
  };

  // Gestion des nouvelles transactions
  const ajouterTransaction = () => {
    if (!nouvelleTransaction.amount || !nouvelleTransaction.description) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: new Date(),
      amount: nouvelleTransaction.amount!,
      description: nouvelleTransaction.description!,
      category: nouvelleTransaction.category || 'divers',
      type: nouvelleTransaction.type || 'income',
      paymentMethod: nouvelleTransaction.paymentMethod || 'virement',
      client: nouvelleTransaction.client,
      status: 'completed'
    };

    setTransactions(prev => [transaction, ...prev]);
    calculerResumeFinancier([transaction, ...transactions], factures);
    
    // Réinitialiser le formulaire
    setNouvelleTransaction({
      type: 'income',
      category: 'services',
      paymentMethod: 'virement'
    });
  };

  // Rendu du tableau de bord
  const renderTableauDeBord = () => (
    <div className="space-y-6">
      {/* Cartes indicateurs financiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-700">Chiffre d'Affaires</h3>
          <div className="text-2xl font-bold text-gray-900 mt-2">
            {resumeFinancier.totalRevenue.toLocaleString('fr-FR')} €
          </div>
          <div className="text-sm text-green-600 mt-1">+8.2% vs période précédente</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-700">Dépenses</h3>
          <div className="text-2xl font-bold text-gray-900 mt-2">
            {resumeFinancier.totalExpenses.toLocaleString('fr-FR')} €
          </div>
          <div className="text-sm text-red-600 mt-1">-3.7% vs période précédente</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700">Bénéfice Net</h3>
          <div className="text-2xl font-bold text-gray-900 mt-2">
            {resumeFinancier.netProfit.toLocaleString('fr-FR')} €
          </div>
          <div className="text-sm text-blue-600 mt-1">
            Marge: {resumeFinancier.profitMargin.toFixed(1)}%
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold text-gray-700">Estimation Taxes</h3>
          <div className="text-2xl font-bold text-gray-900 mt-2">
            {resumeFinancier.taxEstimate.toLocaleString('fr-FR')} €
          </div>
          <div className="text-sm text-gray-600 mt-1">Régime: {regimeFiscal.toUpperCase()}</div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setOngletActif('transactions')}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg border border-blue-200 transition-colors"
          >
            <div className="font-medium">Nouvelle Transaction</div>
            <div className="text-sm text-blue-600 mt-1">Enregistrer une opération</div>
          </button>
          <button 
            onClick={() => setOngletActif('factures')}
            className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg border border-green-200 transition-colors"
          >
            <div className="font-medium">Créer Facture</div>
            <div className="text-sm text-green-600 mt-1">Émettre une facture</div>
          </button>
          <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg border border-purple-200 transition-colors">
            <div className="font-medium">Générer Rapport</div>
            <div className="text-sm text-purple-600 mt-1">Rapports financiers</div>
          </button>
          <button className="bg-orange-50 hover:bg-orange-100 text-orange-700 p-4 rounded-lg border border-orange-200 transition-colors">
            <div className="font-medium">Calculer Taxes</div>
            <div className="text-sm text-orange-600 mt-1">Déclaration fiscale</div>
          </button>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Activité Récente</h3>
        <div className="space-y-3">
          {transactions.slice(0, 5).map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <div className="font-medium text-gray-900">{transaction.description}</div>
                  <div className="text-sm text-gray-500">
                    {transaction.date.toLocaleDateString('fr-FR')} • {transaction.category}
                  </div>
                </div>
              </div>
              <div className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('fr-FR')} €
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Rendu des transactions
  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Transactions</h2>
        <select 
          value={periodeSelectionnee}
          onChange={(e) => setPeriodeSelectionnee(e.target.value as any)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="mois">Mois en cours</option>
          <option value="trimestre">Trimestre</option>
          <option value="annee">Année {anneeFiscale}</option>
        </select>
      </div>

      {/* Formulaire nouvelle transaction */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Nouvelle Transaction</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <select 
            value={nouvelleTransaction.type}
            onChange={(e) => setNouvelleTransaction({...nouvelleTransaction, type: e.target.value as 'income' | 'expense'})}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="income">Recette</option>
            <option value="expense">Dépense</option>
          </select>
          
          <input
            type="number"
            placeholder="Montant (€)"
            value={nouvelleTransaction.amount || ''}
            onChange={(e) => setNouvelleTransaction({...nouvelleTransaction, amount: parseFloat(e.target.value)})}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          
          <input
            type="text"
            placeholder="Description"
            value={nouvelleTransaction.description || ''}
            onChange={(e) => setNouvelleTransaction({...nouvelleTransaction, description: e.target.value})}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          
          <select 
            value={nouvelleTransaction.category}
            onChange={(e) => setNouvelleTransaction({...nouvelleTransaction, category: e.target.value})}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="services">Services</option>
            <option value="developpement">Développement</option>
            <option value="conseil">Conseil</option>
            <option value="formation">Formation</option>
            <option value="equipement">Équipement</option>
            <option value="deplacement">Déplacement</option>
            <option value="divers">Divers</option>
          </select>
          
          <button 
            onClick={ajouterTransaction}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium"
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste des transactions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Historique des Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.date.toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{transaction.description}</div>
                    {transaction.client && (
                      <div className="text-gray-500 text-xs">Client: {transaction.client}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'income' ? 'Recette' : 'Dépense'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('fr-FR')} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Rendu des factures
  const renderFactures = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Gestion des Factures</h2>
      
      {/* Statistiques des factures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-green-600">
            {factures.filter(i => i.status === 'paid').length}
          </div>
          <div className="text-gray-600 mt-1">Factures payées</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {factures.filter(i => i.status === 'unpaid').length}
          </div>
          <div className="text-gray-600 mt-1">En attente</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-red-600">
            {resumeFinancier.accountsReceivable.toLocaleString('fr-FR')} €
          </div>
          <div className="text-gray-600 mt-1">Montant en attente</div>
        </div>
      </div>

      {/* Liste des factures */}
      <div className="space-y-4">
        {factures.map(facture => (
          <div key={facture.id} className={`bg-white rounded-lg shadow p-6 border-l-4 ${
            facture.status === 'paid' ? 'border-green-500' : 
            facture.status === 'unpaid' ? 'border-yellow-500' : 'border-red-500'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{facture.number}</h3>
                <p className="text-gray-600">Client: {facture.client}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                  facture.status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : facture.status === 'unpaid'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {facture.status === 'paid' ? 'Payée' : 
                   facture.status === 'unpaid' ? 'En attente' : 'En retard'}
                </span>
                <div className="text-xl font-bold text-gray-900 mt-1">
                  {facture.amount.toLocaleString('fr-FR')} €
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              <div>
                <span className="font-medium">Date d'émission:</span> {facture.date.toLocaleDateString('fr-FR')}
              </div>
              <div>
                <span className="font-medium">Date d'échéance:</span> {facture.dueDate.toLocaleDateString('fr-FR')}
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                Télécharger PDF
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Relancer client
              </button>
              {facture.status === 'unpaid' && (
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Marquer comme payée
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Rendu des rapports
  const renderRapports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Rapports Financiers</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bilan comptable */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bilan Comptable</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Actifs circulants</span>
              <span className="font-medium">{(resumeFinancier.totalRevenue * 0.4).toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Immobilisations</span>
              <span className="font-medium">{(resumeFinancier.totalRevenue * 0.3).toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Passifs</span>
              <span className="font-medium">{(resumeFinancier.totalExpenses * 0.6).toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between items-center py-2 font-semibold text-gray-900">
              <span>Capital</span>
              <span>{resumeFinancier.netProfit.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </div>

        {/* Compte de résultat */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Compte de Résultat</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Chiffre d'affaires</span>
              <span className="font-medium text-green-600">{resumeFinancier.totalRevenue.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Charges d'exploitation</span>
              <span className="font-medium text-red-600">{resumeFinancier.totalExpenses.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Charges financières</span>
              <span className="font-medium text-red-600">{(resumeFinancier.totalExpenses * 0.1).toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between items-center py-2 font-semibold text-gray-900">
              <span>Résultat net</span>
              <span>{resumeFinancier.netProfit.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </div>

        {/* Trésorerie */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Situation de Trésorerie</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Solde actuel</span>
              <span className="font-medium">{resumeFinancier.cashFlow.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Créances clients</span>
              <span className="font-medium">{resumeFinancier.accountsReceivable.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Dettes fournisseurs</span>
              <span className="font-medium">{(resumeFinancier.totalExpenses * 0.3).toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between items-center py-2 font-semibold text-gray-900">
              <span>Trésorerie nette</span>
              <span>{(resumeFinancier.cashFlow + resumeFinancier.accountsReceivable).toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </div>

        {/* Analyse de rentabilité */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Analyse de Rentabilité</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Marge bénéficiaire</span>
                <span>{resumeFinancier.profitMargin.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(resumeFinancier.profitMargin, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Taux de charges</span>
                <span>{((resumeFinancier.totalExpenses / resumeFinancier.totalRevenue) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${Math.min((resumeFinancier.totalExpenses / resumeFinancier.totalRevenue) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center pt-4">
              <div className="text-sm text-gray-600">Estimation taxes à payer</div>
              <div className="text-2xl font-bold text-yellow-600">
                {resumeFinancier.taxEstimate.toLocaleString('fr-FR')} €
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions d'export */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Export des Rapports</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
            Générer rapport PDF complet
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">
            Exporter vers Excel
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium">
            Préparer déclaration fiscale
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* En-tête */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Comptabilité d'Entreprise</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span>Régime fiscal: {regimeFiscal.toUpperCase()}</span>
                <span>•</span>
                <span>Année: {anneeFiscale}</span>
                <span>•</span>
                <span>Période: {periodeSelectionnee}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">Solde: {resumeFinancier.cashFlow.toLocaleString('fr-FR')} €</div>
              <div className="text-sm text-gray-600">Trésorerie disponible</div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {(['tableau-bord', 'transactions', 'factures', 'rapports'] as const).map(onglet => (
              <button
                key={onglet}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  ongletActif === onglet
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setOngletActif(onglet)}
              >
                {onglet === 'tableau-bord' && 'Tableau de Bord'}
                {onglet === 'transactions' && 'Transactions'}
                {onglet === 'factures' && 'Factures'}
                {onglet === 'rapports' && 'Rapports Financiers'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {ongletActif === 'tableau-bord' && renderTableauDeBord()}
        {ongletActif === 'transactions' && renderTransactions()}
        {ongletActif === 'factures' && renderFactures()}
        {ongletActif === 'rapports' && renderRapports()}
      </main>
    </div>
  );
};

export default ComptabiliteEntreprise;