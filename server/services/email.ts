import nodemailer from 'nodemailer';

const isDevelopment = process.env.NODE_ENV === 'development';

// Mailhog for testing, production SMTP for live
const transporter = nodemailer.createTransport({
  host: isDevelopment ? 'localhost' : process.env.SMTP_HOST || 'localhost',
  port: isDevelopment ? 1025 : parseInt(process.env.SMTP_PORT || '1025'),
  secure: false, // Mailhog doesn't use SSL
  ...(process.env.SMTP_USER && {
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  }),
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions) {
  const from = process.env.EMAIL_FROM || 'Les Jokers d\'Aubagne <noreply@rollerhockeyaubagne.net>';

  try {
    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log('\n===== EMAIL SENT =====');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    if (isDevelopment) {
      console.log(`Mailhog: http://localhost:8025`);
    }
    console.log('======================\n');

    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Email templates
export const emailTemplates = {
  passwordReset: (name: string, resetLink: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px 20px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏒 Les Jokers d'Aubagne</h1>
        </div>
        <div class="content">
          <h2>Réinitialisation de mot de passe</h2>
          <p>Bonjour ${name},</p>
          <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          <p style="text-align: center;">
            <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>
          </p>
          <p><small>Ce lien expire dans 1 heure.</small></p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe actuel reste inchangé.</p>
          <p>Sportivement,<br>L'équipe des Jokers</p>
        </div>
        <div class="footer">
          <p>Les Jokers d'Aubagne - Roller Hockey Club<br>
          Gymnase du Charrel, Aubagne</p>
        </div>
      </div>
    </body>
    </html>
  `,

  accountActivated: (name: string, username: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px 20px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Bienvenue aux Jokers!</h1>
        </div>
        <div class="content">
          <h2>Votre compte a été activé</h2>
          <p>Bonjour ${name},</p>
          <p>Bonne nouvelle ! Votre compte a été validé par un administrateur. Vous pouvez maintenant vous connecter et accéder à votre espace membre.</p>
          <p><strong>Nom d'utilisateur :</strong> ${username}</p>
          <p style="text-align: center;">
            <a href="https://jokers.srv759970.hstgr.cloud/login" class="button">Se connecter</a>
          </p>
          <p>Vous aurez accès à :</p>
          <ul>
            <li>📅 Calendrier des matchs et entraînements</li>
            <li>📸 Galerie photos et vidéos</li>
            <li>📢 Actualités du club</li>
            <li>👤 Votre profil personnel</li>
          </ul>
          <p>Bienvenue dans la famille des Jokers ! 💜💛</p>
          <p>Sportivement,<br>L'équipe des Jokers</p>
        </div>
        <div class="footer">
          <p>Les Jokers d'Aubagne - Roller Hockey Club<br>
          Gymnase du Charrel, Aubagne</p>
        </div>
      </div>
    </body>
    </html>
  `,

  newRegistration: (adminName: string, userName: string, userEmail: string, userId: number) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px 20px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .info-box { background: white; padding: 15px; border-left: 4px solid #7c3aed; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Nouvelle inscription</h1>
        </div>
        <div class="content">
          <h2>Action requise</h2>
          <p>Bonjour ${adminName},</p>
          <p>Une nouvelle demande d'inscription est en attente de validation :</p>
          <div class="info-box">
            <p><strong>Nom :</strong> ${userName}</p>
            <p><strong>Email :</strong> ${userEmail}</p>
            <p><strong>ID :</strong> #${userId}</p>
          </div>
          <p style="text-align: center;">
            <a href="https://jokers.srv759970.hstgr.cloud/admin/users" class="button">Gérer les utilisateurs</a>
          </p>
          <p>Veuillez examiner cette demande et activer le compte si elle est légitime.</p>
        </div>
        <div class="footer">
          <p>Notification automatique - Les Jokers d'Aubagne</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
