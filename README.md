# Jokers Hockey - Site Web du Club

Site web vitrine pour le club de hockey sur glace Les Jokers.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-20+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)

## 🏒 À propos

Site web moderne pour le club de hockey Les Jokers, offrant :
- Présentation du club et des équipes
- Actualités et résultats des matchs
- Boutique merchandising
- Formulaire de contact

**🌐 Site en ligne :** [https://jokers.srv759970.hstgr.cloud](https://jokers.srv759970.hstgr.cloud)

## 🛠️ Stack Technique

### Frontend
- **React 18** - Framework UI
- **Vite 5** - Build tool ultra-rapide
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling moderne
- **shadcn/ui** - Composants UI réutilisables
- **Wouter** - Routing SPA léger
- **React Query** - State management & caching

### Backend
- **Express** - Server framework
- **Node.js 20+** - Runtime
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database (Neon serverless)

### Infrastructure
- **PM2** - Process manager
- **Nginx** - Reverse proxy
- **Let's Encrypt** - SSL/TLS
- **Hostinger VPS** - Hosting

## 🚀 Installation

### Prérequis
- Node.js 20 ou supérieur
- npm ou pnpm
- PostgreSQL (ou compte Neon)

### Setup Local

```bash
# Cloner le repo
git clone https://github.com/theflysurfer/jokers-hockey.git
cd jokers-hockey

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
# Éditer .env avec votre DATABASE_URL

# Pusher le schéma vers la base de données
npm run db:push

# Lancer en mode développement
npm run dev
```

Le site sera accessible sur [http://localhost:5000](http://localhost:5000)

## 📁 Structure du Projet

```
jokers-hockey/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages du site
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilitaires
│   └── index.html
├── server/                # Backend Express
│   ├── index.ts           # Point d'entrée
│   ├── routes.ts          # Routes API
│   └── vite.ts            # Config Vite
├── shared/                # Code partagé
│   └── schema.ts          # Schéma base de données
├── .claude/              # Configuration Claude Code
│   ├── skills/           # Skills automatisées
│   └── settings.json     # Hooks
└── attached_assets/      # Assets (logos, images)
```

## 🎯 Scripts Disponibles

```bash
npm run dev       # Démarre le serveur de développement
npm run build     # Build pour production
npm run check     # Vérification TypeScript
npm run db:push   # Synchronise le schéma DB
npm start         # Démarre en production
```

## 🗄️ Base de Données

Le projet utilise **Drizzle ORM** avec PostgreSQL.

### Schéma
Défini dans `shared/schema.ts`

### Migrations
```bash
# Appliquer les changements de schéma
npm run db:push
```

## 🚢 Déploiement

### Production Server
- **URL**: https://jokers.srv759970.hstgr.cloud
- **Server**: Hostinger VPS
- **Process**: PM2 (`jokers-hockey`)

### Déployer Manuellement

```bash
# SSH vers le serveur
ssh automation@69.62.108.82

# Naviguer vers le projet
cd /var/www/jokers

# Pull les dernières modifications
git pull origin main

# Installer et builder
npm install
npm run build

# Synchroniser la base de données
npm run db:push

# Redémarrer l'application
pm2 restart jokers-hockey
```

### Claude Code Skills

Le projet inclut des **skills Claude Code** pour automatiser le déploiement :

- 🚀 **deploy-jokers** - Déploiement automatisé
- 🗄️ **database-migration** - Gestion des migrations
- 📊 **pm2-management** - Monitoring production
- ✅ **build-check** - Vérification pré-déploiement

Utilisez-les simplement en demandant à Claude :
```
"Deploy to production"
"Check the production logs"
"Add a new table to the database"
```

Voir [.claude/README.md](.claude/README.md) pour plus de détails.

## 📄 Pages

- **/** - Page d'accueil
- **/club** - Informations sur le club
- **/equipes** - Présentation des équipes
- **/actualites** - News et résultats
- **/shop** - Boutique
- **/contact** - Formulaire de contact

## 🎨 Design

Design moderne avec :
- **Couleurs** : Violet et jaune (couleurs du club)
- **Typography** : System fonts optimisées
- **Responsive** : Mobile-first design
- **Animations** : Framer Motion

Voir [design_guidelines.md](design_guidelines.md) pour les guidelines complètes.

## 🔧 Configuration

### Variables d'Environnement

Créer un fichier `.env` :

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

### Nginx (Production)

Configuration disponible dans :
- Serveur: `/etc/nginx/sites-available/jokers.srv759970.hstgr.cloud`
- Référence: Voir documentation Hostinger

## 📝 Documentation

- **[claude.md](claude.md)** - Documentation technique complète
- **[.claude/README.md](.claude/README.md)** - Guide Claude Code skills
- **[design_guidelines.md](design_guidelines.md)** - Guidelines design

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📊 Monitoring

### Logs Production
```bash
# PM2 logs
pm2 logs jokers-hockey

# Nginx logs
sudo tail -f /var/log/nginx/jokers_ssl_access.log
```

### Health Check
```bash
# Status PM2
pm2 status jokers-hockey

# Test HTTP
curl -I https://jokers.srv759970.hstgr.cloud
```

## 🔒 Sécurité

- ✅ SSL/TLS via Let's Encrypt
- ✅ HSTS activé
- ✅ Headers de sécurité configurés
- ✅ Variables sensibles dans .env (non commitées)
- ✅ Audit npm régulier

## 📜 License

MIT License - voir [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Julien Fernandez** - [@theflysurfer](https://github.com/theflysurfer)

Développé avec l'aide de [Claude Code](https://claude.com/claude-code)

## 🙏 Remerciements

- Club de hockey Les Jokers
- shadcn/ui pour les composants
- Vercel pour le design system Geist
- Anthropic Claude pour l'assistance au développement

---

**⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !**
