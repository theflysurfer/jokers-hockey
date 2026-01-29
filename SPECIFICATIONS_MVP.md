# Spécifications MVP - Site Web Jokers

**Version:** 1.0
**Date:** 2026-01-29
**Auteur:** Brainstorming utilisateur + Claude
**Statut:** 📋 Spécifications

---

## 📋 Table des matières

1. [Contexte](#contexte)
2. [Objectifs MVP](#objectifs-mvp)
3. [Phase 1 - Archive Annonces](#phase-1---archive-annonces)
4. [Phase 2 - Inscriptions Matchs](#phase-2---inscriptions-matchs)
5. [Authentification](#authentification)
6. [Schéma de base de données](#schéma-de-base-de-données)
7. [User Stories](#user-stories)
8. [Plan d'implémentation](#plan-dimplémentation)

---

## Contexte

### Club
- **Nom:** Roller Hockey Aubagne (RHA / Les Jokers)
- **Membres:** ~50 personnes (joueurs + parents)
- **Équipes:** U7-U11, U13, U15, U17, U20, Adultes/Débutants, École de patinage
- **Gestion:** 2-3 personnes du bureau

### Communication actuelle
- **Principal:** WhatsApp (communauté + groupes par équipe)
- **Problèmes:**
  - Infos importantes perdues dans le flux
  - Impossible de savoir qui a lu/répondu
  - Nouveaux membres ratent les infos passées
  - Comptage manuel des présences aux matchs
  - Aucun historique

### Stack technique existante
- **Frontend:** React 18 + Vite 5 + TypeScript
- **Backend:** Express + Node.js
- **Database:** PostgreSQL (Neon) + Drizzle ORM
- **UI:** shadcn/ui + Tailwind CSS
- **Déploiement:** PM2 sur Hostinger VPS (port 5020)

---

## Objectifs MVP

### Phase 1 - Archive Annonces ⭐ Priorité #1
Permettre aux membres du bureau de poster des annonces qui ne se perdent pas dans WhatsApp.

### Phase 2 - Inscriptions Matchs ⭐ Priorité #1
Faciliter la gestion des présences aux matchs avec tracking automatique.

### Phase 3 - Fiches Membres (plus tard)
Organigramme, contacts, numéros de maillots.

---

## Phase 1 - Archive Annonces

### Objectifs
1. Poster des annonces depuis l'admin
2. Afficher les annonces sur le site avec recherche/filtres
3. Ne plus perdre les infos importantes
4. Faciliter le partage sur WhatsApp

### Fonctionnalités

#### 1.1 - Création d'annonce (Admin)

**Interface Admin** `/admin/annonces/nouvelle`

**Champs du formulaire:**
- **Titre** (obligatoire, max 100 chars)
- **Contenu** (Markdown, obligatoire)
- **Catégorie** (select):
  - 📢 Annonce officielle
  - ⏰ Action urgente (deadline)
  - 🎓 Formation/Diplômes
  - 🛍️ Commande groupée
  - 🎉 Événement
  - ℹ️ Information générale
- **Deadline** (optionnel, date/heure)
- **Équipe concernée** (select multiple):
  - Toutes les équipes
  - U7-U11
  - U13
  - U15
  - U17
  - U20
  - Adultes/Débutants
  - École de patinage
  - Bureau uniquement
- **Statut** (radio):
  - 🟢 Publiée (visible)
  - 🟡 Brouillon (invisible)
  - 🔴 Archivée (masquée par défaut)

**Actions:**
- Prévisualiser (rendu Markdown)
- Enregistrer brouillon
- Publier
- Générer message WhatsApp (copier-coller)

**Format message WhatsApp généré:**
```
[Catégorie] Titre

[Contenu tronqué à 200 chars...]

👉 Lire la suite: https://jokers.srv759970.hstgr.cloud/actualites/[slug]
```

#### 1.2 - Liste des annonces (Admin)

**Interface** `/admin/annonces`

**Vue tableau:**
| Titre | Catégorie | Deadline | Équipe | Statut | Actions |
|-------|-----------|----------|--------|--------|---------|
| ... | ... | ... | ... | ... | Modifier / Archiver / Dupliquer |

**Filtres:**
- Par catégorie
- Par équipe
- Par statut
- Par date de publication

#### 1.3 - Page publique Actualités

**URL** `/actualites`

**Affichage:**
- Liste chronologique (récentes en haut)
- Card par annonce:
  - Badge catégorie (couleur)
  - Titre
  - Extrait (150 chars)
  - Deadline si applicable (badge rouge si < 48h)
  - Date de publication
  - Bouton "Lire plus"

**Filtres publics:**
- Par catégorie (tabs)
- Recherche full-text (titre + contenu)

**Vue détail** `/actualites/[slug]`
- Titre complet
- Badge catégorie + équipe
- Date + auteur
- Deadline (si applicable)
- Contenu Markdown rendu
- Bouton "Partager sur WhatsApp" (copie lien)

#### 1.4 - Widget Actualités (Homepage)

Sur la page d'accueil, afficher les **3 dernières annonces** avec:
- Titre
- Catégorie
- Date
- Lien "Voir toutes les actualités"

---

## Phase 2 - Inscriptions Matchs

### Objectifs
1. Créer des matchs depuis l'admin
2. Permettre aux parents/joueurs de s'inscrire en 1 clic
3. Donner une vue temps réel à l'entraîneur
4. Historique de présence par joueur
5. Export PDF feuille de match

### Fonctionnalités

#### 2.1 - Création de match (Admin)

**Interface** `/admin/matchs/nouveau`

**Champs:**
- **Date/heure** (obligatoire)
- **Équipe** (select): U7-U11, U13, U15, U17, U20, Adultes
- **Type** (select):
  - Match à domicile
  - Match à l'extérieur
  - Entraînement
  - Tournoi
- **Adversaire** (texte, obligatoire si match)
- **Lieu** (texte, auto-rempli si domicile)
- **Adresse** (si extérieur, pour covoiturage)
- **Heure de convocation** (avant l'heure du match)
- **Notes** (Markdown, optionnel)
- **Statut** (select):
  - 🟢 Confirmé
  - 🟡 À confirmer
  - 🔴 Annulé

**Actions:**
- Enregistrer
- Publier + Générer message WhatsApp

**Message WhatsApp généré:**
```
⚽ Match [Équipe] - [Date formatée]

📍 [Lieu]
🕐 Convocation: [Heure]
🆚 Adversaire: [Nom]

👉 Qui vient? Inscrivez-vous:
https://jokers.srv759970.hstgr.cloud/match/[id]/inscription

📲 Deadline: [24h avant le match]
```

#### 2.2 - Page inscription match (Public)

**URL** `/match/[id]/inscription`

**Affichage:**
- Détails du match (date, lieu, adversaire)
- Countdown deadline
- Formulaire simplifié:
  - **Nom du joueur** (texte ou select si connecté)
  - **Statut** (boutons radio visuels):
    - ✅ Présent
    - ❌ Absent
    - ❓ Peut-être
  - **Note** (optionnel, 100 chars max)
  - Bouton "Enregistrer ma réponse"

**Si déjà inscrit:**
- Afficher réponse actuelle
- Permettre modification jusqu'à la deadline

**Après deadline:**
- Message "Inscriptions closes"
- Afficher sa réponse (lecture seule)

#### 2.3 - Dashboard Entraîneur (Admin)

**Interface** `/admin/matchs/[id]`

**Sections:**

**A. Vue d'ensemble**
- Détails du match
- Deadline inscriptions
- Statistiques:
  - X présents confirmés
  - Y absents
  - Z peut-être
  - Total attendu

**B. Liste des réponses (temps réel)**

| Joueur | Statut | Heure de réponse | Note |
|--------|--------|------------------|------|
| ... | ✅/❌/❓ | ... | ... |

**Tri:**
- Par statut (présents en haut)
- Par nom alphabétique
- Par heure de réponse

**Actions:**
- Relancer les non-répondants (copier liste)
- Export Excel/CSV
- Générer feuille de match PDF

**C. Feuille de match PDF**

**Bouton** "Télécharger feuille de match"

**Contenu PDF:**
- En-tête: Logo club, date, équipe, adversaire
- Tableau joueurs présents:
  - Numéro maillot
  - Nom
  - Case pour signature/arrivée
- Composition équipe (gardien, défenseurs, attaquants)
- Notes entraîneur (zone vierge)

#### 2.4 - Historique de présence

**Interface** `/admin/matchs/stats`

**Vue par joueur:**
| Joueur | Équipe | Présences | Absences | Taux | Dernier match |
|--------|--------|-----------|----------|------|---------------|
| ... | ... | 8/10 | 2/10 | 80% | 2026-01-20 |

**Filtres:**
- Par équipe
- Par période (mois, saison)
- Par joueur

**Graphiques:**
- Évolution du taux de présence (ligne)
- Nombre de présents par match (barres)

#### 2.5 - Calendrier public

**URL** `/matchs`

**Affichage:**
- Vue calendrier (mois)
- Liste des matchs à venir (prochains 30 jours)
- Card par match:
  - Date + heure
  - Équipe
  - Adversaire
  - Lieu
  - Badge statut (Confirmé/À confirmer/Annulé)
  - Bouton "S'inscrire" (si deadline pas passée)

**Filtres:**
- Par équipe
- Par type (match/entraînement/tournoi)

---

## Authentification

### Choix retenu: **Hybride (A + B)**

#### Option A - Magic Link (simplifié)
**Pour:** Parents/joueurs qui s'inscrivent aux matchs

**Flow:**
1. Utilisateur entre son email sur `/match/[id]/inscription`
2. Backend envoie email avec lien magique (token 1h)
3. Clic sur lien → session créée → redirection vers page inscription
4. Session valide 30 jours (cookie)

**Avantages:**
- Pas de mot de passe à retenir
- Simple pour les parents
- Sécurisé (lien expire)

#### Option B - Login/Password (admin)
**Pour:** Membres du bureau (admin)

**Flow:**
1. Page `/admin/login`
2. Email + password
3. Session admin (role-based)

**Rôles:**
- `admin` - Accès complet
- `coach` - Gestion matchs de son équipe uniquement
- `member` - Lecture seule

### Tables auth requises

```sql
users (
  id serial primary key,
  email text unique not null,
  password_hash text, -- null si magic link only
  role text default 'member', -- member, coach, admin
  created_at timestamp default now()
)

magic_links (
  id serial primary key,
  user_id int references users(id),
  token text unique not null,
  expires_at timestamp not null,
  used boolean default false
)

sessions (
  id text primary key,
  user_id int references users(id),
  expires_at timestamp not null,
  created_at timestamp default now()
)
```

---

## Schéma de base de données

### Nouvelles tables (Drizzle)

```typescript
// shared/schema.ts

// ========== ANNONCES ==========
export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  content: text('content').notNull(), // Markdown
  category: varchar('category', { length: 50 }).notNull(),
  // Categories: official, urgent, training, order, event, info
  deadline: timestamp('deadline'), // nullable
  teams: text('teams').array().notNull().default(['all']),
  // Teams: all, u7-u11, u13, u15, u17, u20, adults, skating-school, board
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  // Status: draft, published, archived
  author_id: integer('author_id').notNull(), // references users.id
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  published_at: timestamp('published_at'),
});

// ========== MATCHS ==========
export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  date: timestamp('date').notNull(),
  team: varchar('team', { length: 50 }).notNull(),
  // Teams: u7-u11, u13, u15, u17, u20, adults
  type: varchar('type', { length: 50 }).notNull(),
  // Types: home, away, training, tournament
  opponent: varchar('opponent', { length: 100 }),
  location: text('location').notNull(),
  address: text('address'), // pour covoiturage
  meeting_time: timestamp('meeting_time').notNull(),
  notes: text('notes'), // Markdown
  status: varchar('status', { length: 20 }).notNull().default('confirmed'),
  // Status: confirmed, pending, cancelled
  deadline: timestamp('deadline').notNull(), // 24h avant par défaut
  created_by: integer('created_by').notNull(), // references users.id
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ========== INSCRIPTIONS MATCHS ==========
export const match_responses = pgTable('match_responses', {
  id: serial('id').primaryKey(),
  match_id: integer('match_id').notNull(), // references matches.id
  user_id: integer('user_id'), // references users.id (nullable si pas connecté)
  player_name: varchar('player_name', { length: 100 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  // Status: present, absent, maybe
  note: varchar('note', { length: 100 }),
  responded_at: timestamp('responded_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ========== MEMBRES ==========
export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id'), // references users.id (nullable)
  first_name: varchar('first_name', { length: 50 }).notNull(),
  last_name: varchar('last_name', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  team: varchar('team', { length: 50 }).notNull(),
  jersey_number: integer('jersey_number'),
  birth_date: date('birth_date'),
  photo_url: text('photo_url'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ========== STAFF (ENCADRANTS) ==========
export const staff = pgTable('staff', {
  id: serial('id').primaryKey(),
  first_name: varchar('first_name', { length: 50 }).notNull(),
  last_name: varchar('last_name', { length: 50 }).notNull(),
  role: varchar('role', { length: 100 }).notNull(),
  // Roles: Président, Trésorier, Secrétaire, Entraîneur U13, etc.
  diplomas: text('diplomas').array().default([]),
  // Ex: ['BF1', 'Initiateur roller']
  bio: text('bio'),
  photo_url: text('photo_url'),
  email: varchar('email', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  display_order: integer('display_order').default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
```

### Relations Drizzle

```typescript
export const announcementsRelations = relations(announcements, ({ one }) => ({
  author: one(users, {
    fields: [announcements.author_id],
    references: [users.id],
  }),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  creator: one(users, {
    fields: [matches.created_by],
    references: [users.id],
  }),
  responses: many(match_responses),
}));

export const matchResponsesRelations = relations(match_responses, ({ one }) => ({
  match: one(matches, {
    fields: [match_responses.match_id],
    references: [matches.id],
  }),
  user: one(users, {
    fields: [match_responses.user_id],
    references: [users.id],
  }),
}));
```

---

## User Stories

### Annonces

**US-A1** - En tant que **membre du bureau**, je veux **créer une annonce** afin de **la partager avec le club**
- Critères d'acceptation:
  - [ ] Formulaire accessible depuis `/admin/annonces/nouvelle`
  - [ ] Champs: titre, contenu Markdown, catégorie, deadline, équipe, statut
  - [ ] Prévisualisation Markdown temps réel
  - [ ] Enregistrement brouillon (non publié)
  - [ ] Publication avec génération message WhatsApp

**US-A2** - En tant que **membre du club**, je veux **consulter les annonces** afin de **ne rien rater**
- Critères d'acceptation:
  - [ ] Page `/actualites` accessible publiquement
  - [ ] Liste chronologique des annonces publiées
  - [ ] Filtres par catégorie
  - [ ] Recherche full-text
  - [ ] Badge deadline si < 48h

**US-A3** - En tant que **membre du bureau**, je veux **archiver une annonce** afin de **garder la page propre**
- Critères d'acceptation:
  - [ ] Bouton "Archiver" dans liste admin
  - [ ] Annonce masquée par défaut sur page publique
  - [ ] Filtre "Afficher archivées" disponible

### Matchs

**US-M1** - En tant qu'**entraîneur**, je veux **créer un match** afin de **demander les présences**
- Critères d'acceptation:
  - [ ] Formulaire `/admin/matchs/nouveau`
  - [ ] Champs: date, équipe, type, adversaire, lieu, convocation
  - [ ] Génération auto deadline (24h avant)
  - [ ] Publication avec message WhatsApp

**US-M2** - En tant que **parent**, je veux **inscrire mon enfant à un match** afin que **l'entraîneur sache**
- Critères d'acceptation:
  - [ ] Page `/match/[id]/inscription` accessible via lien WhatsApp
  - [ ] Formulaire simple: nom joueur, statut (présent/absent/peut-être)
  - [ ] Magic link si pas connecté (email)
  - [ ] Confirmation visuelle après enregistrement
  - [ ] Possibilité de modifier jusqu'à deadline

**US-M3** - En tant qu'**entraîneur**, je veux **voir qui vient en temps réel** afin de **préparer la composition**
- Critères d'acceptation:
  - [ ] Dashboard `/admin/matchs/[id]` avec stats
  - [ ] Liste réponses triées par statut
  - [ ] Compteur présents/absents/peut-être
  - [ ] Mise à jour automatique (polling 10s ou WebSocket)

**US-M4** - En tant qu'**entraîneur**, je veux **télécharger la feuille de match** afin de **l'avoir sur papier**
- Critères d'acceptation:
  - [ ] Bouton "Générer feuille de match PDF"
  - [ ] PDF avec logo, date, liste joueurs présents
  - [ ] Numéros de maillots si disponibles
  - [ ] Zone notes vierge

**US-M5** - En tant que **membre du club**, je veux **voir le calendrier des matchs** afin de **planifier**
- Critères d'acceptation:
  - [ ] Page `/matchs` avec calendrier visuel
  - [ ] Liste prochains matchs (30 jours)
  - [ ] Filtres par équipe
  - [ ] Bouton "S'inscrire" si deadline pas passée

---

## Plan d'implémentation

### Phase 1A - Annonces (2-3 jours)

**Jour 1 - Backend**
- [ ] Créer migration Drizzle (`announcements` + `users` + `sessions`)
- [ ] API routes:
  - `POST /api/announcements` - Créer annonce
  - `GET /api/announcements` - Liste annonces (filtres)
  - `GET /api/announcements/:slug` - Détail
  - `PATCH /api/announcements/:id` - Modifier
  - `DELETE /api/announcements/:id` - Archiver
- [ ] Validation Zod pour chaque route
- [ ] Middleware auth admin

**Jour 2 - Frontend Admin**
- [ ] Page `/admin/annonces/nouvelle` (formulaire)
- [ ] Éditeur Markdown avec prévisualisation (react-markdown)
- [ ] Page `/admin/annonces` (liste avec tableau)
- [ ] Filtres et recherche

**Jour 3 - Frontend Public**
- [ ] Page `/actualites` (liste cards)
- [ ] Page `/actualites/[slug]` (détail)
- [ ] Widget homepage (3 dernières annonces)
- [ ] Bouton "Copier message WhatsApp"

### Phase 1B - Auth (1 jour)

**Setup**
- [ ] Créer tables `users`, `magic_links`, `sessions`
- [ ] Installer `@node-rs/argon2` (hash passwords)
- [ ] Installer `nodemailer` (magic links)

**Routes**
- [ ] `POST /api/auth/login` (email + password)
- [ ] `POST /api/auth/magic-link` (send email)
- [ ] `GET /api/auth/verify/:token` (magic link)
- [ ] `POST /api/auth/logout`
- [ ] `GET /api/auth/me` (session check)

**Frontend**
- [ ] Page `/admin/login`
- [ ] Magic link flow (modal email)
- [ ] Auth context provider
- [ ] Protected routes (HOC)

### Phase 2A - Matchs Backend (2 jours)

**Jour 1 - Tables & API**
- [ ] Migration Drizzle (`matches` + `match_responses`)
- [ ] API routes:
  - `POST /api/matches` - Créer match
  - `GET /api/matches` - Liste matchs (filtres)
  - `GET /api/matches/:id` - Détail
  - `PATCH /api/matches/:id` - Modifier
  - `DELETE /api/matches/:id` - Supprimer
  - `POST /api/matches/:id/respond` - Inscription
  - `GET /api/matches/:id/responses` - Réponses

**Jour 2 - Logique métier**
- [ ] Calcul auto deadline (24h avant match)
- [ ] Envoi email relance non-répondants
- [ ] Génération message WhatsApp formaté

### Phase 2B - Matchs Frontend (2 jours)

**Jour 1 - Admin**
- [ ] Page `/admin/matchs/nouveau` (formulaire)
- [ ] Page `/admin/matchs` (liste calendrier)
- [ ] Page `/admin/matchs/:id` (dashboard + réponses temps réel)

**Jour 2 - Public + Export**
- [ ] Page `/match/:id/inscription` (formulaire simplifié)
- [ ] Page `/matchs` (calendrier public)
- [ ] Génération PDF feuille de match (jsPDF ou Puppeteer)

### Phase 2C - Stats (1 jour)

- [ ] Page `/admin/matchs/stats`
- [ ] Requêtes SQL agrégées (taux présence)
- [ ] Graphiques (recharts)

---

## Livrables

### Phase 1 - Annonces
- ✅ 5 routes API
- ✅ 2 pages admin
- ✅ 2 pages publiques
- ✅ Système d'auth

### Phase 2 - Matchs
- ✅ 7 routes API
- ✅ 3 pages admin
- ✅ 2 pages publiques
- ✅ Export PDF
- ✅ Stats de présence

---

## Prochaines étapes

1. **Valider les spécifications** avec les membres du bureau
2. **Créer les migrations Drizzle** (schema.ts)
3. **Développer Phase 1A** (Annonces backend)
4. **Tests utilisateurs** après chaque phase
5. **Ajustements** selon feedback

---

**Questions ouvertes:**
1. Faut-il envoyer des emails automatiques (relances) ou juste copier-coller WhatsApp?
2. Les stats de présence doivent-elles être publiques ou admin only?
3. Besoin d'un système de notifications push (PWA)?

**Décisions prises:**
- ✅ Auth hybride (magic link + login/password)
- ✅ Notifications WhatsApp manuelles (copier-coller)
- ✅ Photos privées → plus tard (Dropbox externe)
