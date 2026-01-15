// utils/emailService.js
const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true' || false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Vérifier la connexion au service email
transporter.verify(function(error, success) {
  if (error) {
    // console.log('❌ Erreur configuration email:', error.message);
  } else {
    // console.log('✅ Serveur email prêt à envoyer des messages');
  }
});

// Fonction pour envoyer des emails
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // En mode développement, on affiche juste le contenu
    if (process.env.NODE_ENV === 'development') {

      return { success: true, message: 'Email simulé en mode dev' };
    }

    // En mode production, on envoie réellement
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Plateforme'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Extraire le texte du HTML si pas fourni
    };

    const info = await transporter.sendMail(mailOptions);

    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return { success: false, error: error.message };
  }
};

// Fonction pour envoyer des emails de réinitialisation de mot de passe
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  return sendEmail({
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #777;">
          Ceci est un email automatique, merci de ne pas y répondre.
        </p>
      </div>
    `
  });
};

// Fonction pour envoyer des emails de bienvenue
const sendWelcomeEmail = async (email, firstName) => {
  return sendEmail({
    to: email,
    subject: 'Bienvenue sur notre plateforme !',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Bienvenue ${firstName} !</h2>
        <p>Votre compte a été créé avec succès sur notre plateforme.</p>
        <p>Vous pouvez maintenant :</p>
        <ul>
          <li>Accéder à votre espace personnel</li>
          <li>Consulter nos services</li>
          <li>Créer des formations (si vous êtes professionnel)</li>
          <li>Et bien plus encore...</li>
        </ul>
        <p>Pour commencer, connectez-vous à votre compte :</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Se connecter
          </a>
        </p>
        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #777;">
          L'équipe de la plateforme
        </p>
      </div>
    `
  });
};

// Fonction pour envoyer des notifications
const sendNotificationEmail = async (email, titre, message) => {
  return sendEmail({
    to: email,
    subject: `Notification : ${titre}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${titre}</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
          ${message}
        </div>
        <p>Connectez-vous à votre compte pour plus de détails :</p>
        <p style="text-align: center; margin: 20px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
             style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Voir les détails
          </a>
        </p>
      </div>
    `
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendNotificationEmail,
  transporter
};