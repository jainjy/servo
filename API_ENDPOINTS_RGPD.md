/**
 * ENDPOINTS API À IMPLÉMENTER POUR RGPD
 * 
 * Ces endpoints doivent être ajoutés dans votre backend
 * pour supporter les fonctionnalités RGPD
 */

// ============================================
// 1. EXPORT DES DONNÉES (Droit d'accès)
// ============================================
GET /api/users/export-data
Description: Récupère toutes les données personnelles de l'utilisateur
Authentification: Requis (Bearer Token)
Retour: {
  user: { id, firstName, lastName, email, phone, address, createdAt, updatedAt },
  transactions: [],
  messages: [],
  listings: [],
  preferences: {},
  activityLogs: []
}


// ============================================
// 2. SUPPRESSION DE COMPTE (Droit à l'oubli)
// ============================================
DELETE /api/users/delete-account
Description: Supprime définitivement le compte et les données personnelles
Authentification: Requis
Body: {
  password: string,     // Confirmation mot de passe
  confirmAllSteps: boolean  // Confirmé tous les checkpoints
}
Délai: 30-90 jours avant suppression effective
Retour: { success: true, message: "Compte marqué pour suppression" }


// ============================================
// 3. LIMITATION DU TRAITEMENT
// ============================================
POST /api/users/request-limitation
Description: Demande limitation temporaire du traitement
Authentification: Requis
Body: {
  reason: string,      // Raison (contester, enquête, etc)
  duration: number     // Durée en jours (optionnel)
}
Retour: { success: true, limitationId: "xxx" }


// ============================================
// 4. CONTACT DPO
// ============================================
POST /api/contact/dpo
Description: Envoie un message au DPO
Authentification: Optionnel (non-connecté possible)
Body: {
  name: string,
  email: string,
  subject: string,
  message: string,
  requestType: "general" | "access" | "deletion" | "portability" | "opposition" | "limitation" | "complaint"
}
Retour: { success: true, ticketId: "xxx" }


// ============================================
// 5. GÉRER LES CONSENTEMENTS
// ============================================
GET /api/users/consent-preferences
Description: Récupère les préférences de consentement actuelles
Authentification: Requis
Retour: {
  cookies_necessary: true,
  cookies_performance: boolean,
  geolocation: boolean,
  marketing: boolean,
  analytics: boolean,
  thirdPartySharing: boolean
}

POST /api/users/consent-preferences
Description: Met à jour les préférences de consentement
Authentification: Requis
Body: {
  cookies_necessary: true,
  cookies_performance: boolean,
  geolocation: boolean,
  marketing: boolean,
  analytics: boolean,
  thirdPartySharing: boolean
}
Retour: { success: true, preferences: {...} }


// ============================================
// 6. LISTE LES PARTENAIRES / SOUS-TRAITANTS
// ============================================
GET /api/data-processing/sub-processors
Description: Liste les sous-traitants ayant accès aux données
Authentification: Optionnel
Retour: {
  processors: [
    { name: "Google Analytics", purpose: "Analytics", location: "USA" },
    { name: "Stripe", purpose: "Paiements", location: "USA" },
    { name: "SendGrid", purpose: "Emails", location: "USA" }
  ]
}


// ============================================
// 7. AUDIT TRAIL / LOGS D'ACTIVITÉ
// ============================================
GET /api/users/activity-log
Description: Récupère les logs d'activité de l'utilisateur
Authentification: Requis
Query: ?limit=100&offset=0&type=login|transaction|update
Retour: {
  logs: [
    { timestamp, action, ipAddress, userAgent, details }
  ],
  total: number
}


// ============================================
// 8. RECTIFICATION DE DONNÉES
// ============================================
PUT /api/users/profile
Description: Met à jour les données de profil (déjà existant probablement)
Authentification: Requis
Body: {
  firstName?: string,
  lastName?: string,
  email?: string,
  phone?: string,
  address?: string,
  zipCode?: string,
  city?: string
}
Retour: { success: true, user: {...} }


// ============================================
// EXEMPLE D'IMPLÉMENTATION (Node.js/Express)
// ============================================

app.get('/api/users/export-data', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    const transactions = await Transaction.find({ userId });
    const messages = await Message.find({ $or: [{ from: userId }, { to: userId }] });
    const listings = await Listing.find({ userId });
    const preferences = await UserPreference.findOne({ userId });
    const activityLogs = await ActivityLog.find({ userId }).limit(1000);

    const exportData = {
      user,
      transactions,
      messages,
      listings,
      preferences,
      activityLogs,
      exportedAt: new Date(),
      exportFormat: "JSON",
      rgpdCompliance: true
    };

    // Log l'export pour audit
    await AuditLog.create({
      userId,
      action: 'DATA_EXPORT',
      timestamp: new Date(),
      ipAddress: req.ip
    });

    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: 'Export failed' });
  }
});

app.delete('/api/users/delete-account', authenticate, async (req, res) => {
  try {
    const { password, confirmAllSteps } = req.body;
    const userId = req.user.id;

    if (!confirmAllSteps) {
      return res.status(400).json({ error: 'Toutes les étapes doivent être confirmées' });
    }

    // Vérifier le mot de passe
    const user = await User.findById(userId);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    // Marquer le compte pour suppression (ne pas supprimer immédiatement)
    await User.findByIdAndUpdate(userId, {
      deletedAt: new Date(),
      deletionScheduledFor: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      status: 'PENDING_DELETION'
    });

    // Log l'action
    await AuditLog.create({
      userId,
      action: 'ACCOUNT_DELETION_REQUESTED',
      timestamp: new Date(),
      ipAddress: req.ip
    });

    res.json({ 
      success: true, 
      message: 'Votre compte sera supprimé dans 90 jours' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

app.post('/api/contact/dpo', async (req, res) => {
  try {
    const { name, email, subject, message, requestType } = req.body;

    // Créer ticket DPO
    const dpoTicket = await DPOTicket.create({
      name,
      email,
      subject,
      message,
      requestType,
      status: 'OPEN',
      createdAt: new Date(),
      responseDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    // Envoyer email au DPO
    await sendEmailToDPO({
      ticketId: dpoTicket._id,
      name,
      email,
      requestType,
      message
    });

    res.json({ 
      success: true, 
      ticketId: dpoTicket._id,
      message: 'Votre demande a été enregistrée'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi' });
  }
});


// ============================================
// CONSIDÉRATIONS DE SÉCURITÉ
// ============================================

/*
1. AUTHENTIFICATION
   - Toujours vérifier que l'utilisateur est connecté
   - Pour les données sensibles, demander re-authentification
   - Implémenter rate limiting

2. CHIFFREMENT
   - Données en transit : HTTPS/TLS
   - Données sensibles en DB : chiffrement AES-256
   - Mots de passe : bcrypt avec salt

3. AUDIT & LOGS
   - Logger toutes les actions RGPD (accès, export, suppression)
   - Conserver logs 6 mois minimum
   - Inclure : timestamp, action, userId, IP, userAgent

4. DÉLAIS DE CONSERVATION
   - Emails de confirmation : 1 an
   - Logs d'audit : 6 mois
   - Données transactionnelles : 6 ans (obligations légales)
   - Autres données personnelles : jusqu'à suppression compte

5. NOTIFICATIONS
   - Envoyer email de confirmation pour exports/suppressions
   - Notifier DPO pour plaintes
   - Confirmer réception demandes RGPD

6. VALIDATION DES DONNÉES
   - Valider tous les inputs
   - Sanitizer pour prévenir injections
   - Vérifier droits utilisateur avant traitement
*/
