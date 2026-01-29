# Jokers Hockey - Site Web du Club

Site web vitrine pour le club de hockey sur glace Les Jokers.

## Stack Technique

### Frontend
- **Framework**: React 18 + Vite 5
- **Langage**: TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **Routing**: Wouter (SPA routing)
- **State Management**: React Query (@tanstack/react-query)

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express
- **Base de données**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM
- **Schéma**: Défini dans `shared/schema.ts`

### Infrastructure
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt
- **Serveur**: Hostinger VPS (srv759970.hstgr.cloud)

## Structure du Projet

```
jokers-hockey/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Composants React (Header, Footer, NewsCard, etc.)
│   │   ├── pages/         # Pages du site (Home, Club, Equipes, Shop, etc.)
│   │   ├── hooks/         # Custom hooks React
│   │   ├── contexts/      # Contextes React (CartContext)
│   │   └── lib/           # Utilitaires (queryClient, utils)
│   ├── public/            # Assets publics
│   └── index.html         # Point d'entrée HTML
├── server/                # Backend Express
│   ├── index.ts           # Point d'entrée serveur
│   ├── routes.ts          # Routes API
│   ├── vite.ts            # Config Vite dev/prod
│   └── storage.ts         # Interface storage
├── shared/                # Code partagé client/serveur
│   └── schema.ts          # Schéma Drizzle
├── dist/                  # Build production (généré)
│   ├── index.js           # Serveur compilé
│   └── public/            # Assets statiques compilés
├── attached_assets/       # Assets du projet (logos, images)
├── .claude/              # Configuration Claude Code
│   └── skills/           # Skills spécifiques au projet
├── package.json
├── vite.config.ts
├── drizzle.config.ts
├── tailwind.config.ts
└── ecosystem.config.cjs   # Config PM2 (sur serveur)
```

## Commandes Principales

### Développement
```bash
npm run dev              # Démarre dev server (port 5000)
npm run check            # Vérification TypeScript
```

### Base de Données
```bash
npm run db:push          # Push du schéma Drizzle vers la BDD
```

### Build et Production
```bash
npm run build            # Build complet (frontend + backend)
npm start                # Démarre en mode production
```

## Déploiement

### Serveur de Production
- **URL**: https://jokers.srv759970.hstgr.cloud
- **Chemin**: `/var/www/jokers`
- **Port**: 5020
- **Process PM2**: `jokers-hockey`

### Commandes de Déploiement
```bash
# SSH vers le serveur
ssh automation@69.62.108.82

# Déploiement manuel (pas de Git sur serveur pour l'instant)
cd /var/www/jokers
# Uploader manuellement les fichiers modifiés via scp
npm install
npm run build
npm run db:push  # Confirmer interactivement ou créer tables via SQL direct
pm2 restart jokers-hockey

# Vérifier les logs
pm2 logs jokers-hockey
pm2 status
```

**Note:** Utilisez les skills `/deploy-jokers` ou `/database-migration` pour déploiements automatisés.

## Variables d'Environnement

### Production (.env sur serveur)
```env
NODE_ENV=production
PORT=5020
DATABASE_URL=postgresql://postgres:password@localhost:5432/jokers_prod
```

## Pages du Site

1. **Home** (`/`) - Page d'accueil avec hero et présentation
2. **Club** (`/club`) - Informations sur le club
3. **Équipes** (`/equipes`) - Présentation des équipes
4. **Actualités** (`/actualites`) - News et résultats
5. **Shop** (`/shop`) - Boutique merchandising
6. **Contact** (`/contact`) - Formulaire de contact

## Composants Principaux

- **Header**: Navigation principale avec logo
- **Footer**: Pied de page avec liens et infos
- **Hero**: Bannière d'accueil
- **NewsCard**: Carte pour les actualités
- **ProductCard**: Carte produit pour la boutique
- **TeamCategory**: Catégorie d'équipe
- **ContactForm**: Formulaire de contact
- **CartDrawer**: Panier d'achat (drawer)

## Schéma de Base de Données

Le schéma Drizzle est défini dans `shared/schema.ts`. Tables actuelles :
- **users** - Authentification (username, password)
- **matches** - Calendrier et résultats (date, opponent, scores, status, category)
- **announcements** - Archive annonces WhatsApp (✨ Phase 1 MVP)
- **photos** - Galerie photos (title, imageUrl, category, matchId)
- **videos** - Galerie vidéos YouTube (title, youtubeId, category)
- **newsletters** - Abonnements newsletter (email, active)
- **staff** - Membres encadrement (name, role, category, photoUrl, bio)

### Phase 1 MVP - Archive Annonces ✅
- API: `/api/announcements` (GET, POST, PATCH, DELETE, publish)
- Admin: Tab "Annonces" avec markdown editor
- Public: Page `/actualites` avec fetch dynamique et filtre par équipe (U7-U20, Adultes, Général)

## Configuration Nginx

Configuration disponible dans :
- Serveur: `/etc/nginx/sites-available/jokers.srv759970.hstgr.cloud`
- Référence: `C:\Users\julien\OneDrive\Coding\_référentiels de code\Hostinger\apps\03-jokers\nginx.conf`

## Documentation Complète

**Projet:**
- `SPECIFICATIONS_MVP.md` - Specs fonctionnelles Phase 1 & 2 (Archive Annonces + Inscriptions Matchs)
- `PLAN_DEVELOPPEMENT.md` - Plan d'implémentation jour par jour
- `ANALYSE_GAP_ARCHITECTURE.md` - Analyse code existant vs besoins MVP

**Externe:**
- `C:\Users\julien\OneDrive\Coding\_référentiels de code\Hostinger\docs\docs\02-applications\cms-sites\jokers-hockey.md`
- `C:\Users\julien\OneDrive\Coding\_référentiels de code\Hostinger\apps\03-jokers\README.md`

## Maintenance

### Logs
```bash
# PM2
pm2 logs jokers-hockey

# Nginx
sudo tail -f /var/log/nginx/jokers_ssl_access.log
sudo tail -f /var/log/nginx/jokers_ssl_error.log
```

### Monitoring
```bash
pm2 status
pm2 monit
curl -I https://jokers.srv759970.hstgr.cloud
```

### Backup Base de Données
La base de données PostgreSQL est hébergée localement sur le serveur dans le conteneur `postgresql-shared`.

## Ressources

- **Repository GitHub**: (À configurer si besoin)
- **Design Guidelines**: Voir `design_guidelines.md`
- **Replit**: Configuration dans `.replit` et `replit.md`

## Notes Importantes

1. **Build avant déploiement**: Toujours builder localement pour vérifier avant de déployer
2. **Migrations BDD**: `npm run db:push` demande confirmation interactive. En prod: créer tables via SQL direct si besoin
3. **SSL**: Certificat auto-renouvelable via Let's Encrypt. IPv6 listeners requis pour certbot.
4. **Port**: L'application écoute sur le port 5020 (configurable via PORT env var)
5. **Assets**: Les images sont dans `attached_assets/` et compilées dans `dist/public/assets/`
6. **Routes**: `server/index.ts` doit importer et appeler `registerRoutes(app)` après init Payload
7. **Date formatting**: Utiliser `toLocaleDateString()` natif plutôt que date-fns pour éviter bundle issues
