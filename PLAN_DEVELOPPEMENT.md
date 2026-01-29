# Plan de Développement MVP - Site Web Jokers

**Version:** 1.0
**Date:** 2026-01-29
**Statut:** 🚀 Prêt à démarrer

---

## 📋 Vue d'ensemble

**Durée estimée:** 7-8 jours de développement
**Phases:** 2 phases principales (Annonces + Matchs)
**Prérequis:** Stack actuelle (React + Express + Drizzle + PostgreSQL)

---

## 🎯 Phase 1A - Annonces Backend (Jour 1)

### Task 1.1 - Créer le schéma Drizzle

**Fichier:** `shared/schema.ts`

**Actions:**
```typescript
// Ajouter les tables:
// - users (auth)
// - announcements
// - magic_links
// - sessions

// Voir SPECIFICATIONS_MVP.md section "Schéma de base de données"
```

**Commandes:**
```bash
# Générer la migration
npm run db:push

# Vérifier dans la BDD
# Tables attendues: announcements, users, magic_links, sessions
```

**Validation:**
- [ ] Tables créées dans PostgreSQL
- [ ] Relations fonctionnelles
- [ ] Indexes sur colonnes clés (slug, email, token)

---

### Task 1.2 - API Annonces

**Fichier:** `server/routes.ts`

**Routes à créer:**

#### `POST /api/announcements`
```typescript
// Créer une annonce
// Body: { title, content, category, deadline?, teams, status }
// Auth: admin requis
// Validation: Zod schema
// Auto-génération slug depuis title
// Retour: annonce créée avec id
```

#### `GET /api/announcements`
```typescript
// Liste annonces avec filtres
// Query params: ?category=urgent&team=u13&status=published
// Tri: par date desc
// Retour: tableau annonces
```

#### `GET /api/announcements/:slug`
```typescript
// Détail d'une annonce
// Param: slug (ex: "diplomes-lilou-chab")
// Retour: annonce complète avec auteur
```

#### `PATCH /api/announcements/:id`
```typescript
// Modifier une annonce
// Auth: admin requis
// Body: champs modifiables
// Update: updated_at timestamp
```

#### `DELETE /api/announcements/:id`
```typescript
// Archiver (soft delete)
// Auth: admin requis
// Action: status = 'archived'
```

**Validation Zod:**
```typescript
import { z } from 'zod';

const createAnnouncementSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  category: z.enum(['official', 'urgent', 'training', 'order', 'event', 'info']),
  deadline: z.string().datetime().optional(),
  teams: z.array(z.string()).default(['all']),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});
```

**Middleware auth:**
```typescript
// server/middleware/auth.ts
export function requireAdmin(req, res, next) {
  if (!req.session?.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
```

**Validation:**
- [ ] POST création fonctionne (Postman/curl)
- [ ] GET liste retourne annonces
- [ ] GET slug retourne détail
- [ ] PATCH modifie correctement
- [ ] DELETE archive (status = archived)
- [ ] Validation Zod bloque données invalides

---

### Task 1.3 - Utilitaire génération message WhatsApp

**Fichier:** `server/utils/whatsapp.ts`

```typescript
export function generateWhatsAppMessage(announcement: Announcement): string {
  const categoryEmoji = {
    official: '📢',
    urgent: '⏰',
    training: '🎓',
    order: '🛍️',
    event: '🎉',
    info: 'ℹ️',
  };

  const emoji = categoryEmoji[announcement.category];
  const truncated = announcement.content.slice(0, 200);
  const url = `https://jokers.srv759970.hstgr.cloud/actualites/${announcement.slug}`;

  let message = `${emoji} ${announcement.title}\n\n`;
  message += `${truncated}${announcement.content.length > 200 ? '...' : ''}\n\n`;

  if (announcement.deadline) {
    const deadline = new Date(announcement.deadline);
    message += `⏰ Deadline: ${deadline.toLocaleDateString('fr-FR')}\n\n`;
  }

  message += `👉 Lire la suite: ${url}`;

  return message;
}
```

**Endpoint:**
```typescript
// GET /api/announcements/:id/whatsapp-message
app.get('/api/announcements/:id/whatsapp-message', async (req, res) => {
  const announcement = await db.query.announcements.findFirst({
    where: eq(announcements.id, parseInt(req.params.id))
  });

  if (!announcement) {
    return res.status(404).json({ error: 'Not found' });
  }

  const message = generateWhatsAppMessage(announcement);
  res.json({ message });
});
```

**Validation:**
- [ ] Message généré respecte le format
- [ ] Emojis corrects par catégorie
- [ ] Troncature à 200 chars
- [ ] URL correcte
- [ ] Deadline affichée si présente

---

## 🎯 Phase 1B - Auth System (Jour 1 fin)

### Task 1.4 - Setup Auth

**Packages:**
```bash
npm install @node-rs/argon2 express-session connect-pg-simple nodemailer
npm install -D @types/express-session @types/nodemailer
```

**Fichier:** `server/auth.ts`

```typescript
import argon2 from '@node-rs/argon2';
import { randomBytes } from 'crypto';

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

// Verify password
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password);
}

// Generate magic link token
export function generateToken(): string {
  return randomBytes(32).toString('hex');
}
```

**Sessions (express-session + PostgreSQL):**
```typescript
import session from 'express-session';
import pgSession from 'connect-pg-simple';

const PgStore = pgSession(session);

app.use(session({
  store: new PgStore({
    conString: process.env.DATABASE_URL,
    tableName: 'sessions',
  }),
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-prod',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
}));
```

**Routes auth:**

#### `POST /api/auth/login`
```typescript
// Login avec email + password (admin)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  });

  if (!user || !user.password_hash) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await verifyPassword(user.password_hash, password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.user = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  res.json({ user: req.session.user });
});
```

#### `POST /api/auth/magic-link`
```typescript
// Envoyer magic link par email
app.post('/api/auth/magic-link', async (req, res) => {
  const { email } = req.body;

  // Trouver ou créer user
  let user = await db.query.users.findFirst({
    where: eq(users.email, email)
  });

  if (!user) {
    [user] = await db.insert(users).values({
      email,
      role: 'member',
    }).returning();
  }

  // Générer token
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

  await db.insert(magic_links).values({
    user_id: user.id,
    token,
    expires_at: expiresAt,
  });

  // Envoyer email (voir Task 1.5)
  await sendMagicLinkEmail(email, token);

  res.json({ message: 'Magic link sent' });
});
```

#### `GET /api/auth/verify/:token`
```typescript
// Vérifier magic link
app.get('/api/auth/verify/:token', async (req, res) => {
  const { token } = req.params;

  const link = await db.query.magic_links.findFirst({
    where: and(
      eq(magic_links.token, token),
      eq(magic_links.used, false),
      gt(magic_links.expires_at, new Date())
    ),
    with: { user: true },
  });

  if (!link) {
    return res.status(400).json({ error: 'Invalid or expired link' });
  }

  // Marquer comme utilisé
  await db.update(magic_links)
    .set({ used: true })
    .where(eq(magic_links.id, link.id));

  // Créer session
  req.session.user = {
    id: link.user.id,
    email: link.user.email,
    role: link.user.role,
  };

  // Rediriger vers page inscription si match_id en query
  const redirectUrl = req.query.redirect || '/';
  res.redirect(redirectUrl);
});
```

#### `POST /api/auth/logout`
```typescript
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out' });
  });
});
```

#### `GET /api/auth/me`
```typescript
app.get('/api/auth/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: req.session.user });
});
```

**Validation:**
- [ ] Login email/password fonctionne
- [ ] Session créée et persistée
- [ ] Magic link généré et stocké
- [ ] Vérification token fonctionne
- [ ] Logout détruit session
- [ ] /api/auth/me retourne user si connecté

---

### Task 1.5 - Emails (Magic Links)

**Setup Nodemailer:**
```typescript
// server/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMagicLinkEmail(email: string, token: string) {
  const url = `${process.env.BASE_URL}/api/auth/verify/${token}`;

  await transporter.sendMail({
    from: '"Les Jokers d\'Aubagne" <noreply@jokers.club>',
    to: email,
    subject: '🔑 Votre lien de connexion - Jokers',
    html: `
      <h2>Connexion au site Les Jokers</h2>
      <p>Cliquez sur le lien ci-dessous pour vous connecter:</p>
      <p><a href="${url}">Se connecter</a></p>
      <p><small>Ce lien expire dans 1 heure.</small></p>
    `,
  });
}
```

**Variables d'environnement (.env):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-app-password
BASE_URL=https://jokers.srv759970.hstgr.cloud
SESSION_SECRET=générer-avec-openssl-rand-hex-32
```

**Note Gmail:** Utiliser App Password (pas le mot de passe compte)

**Validation:**
- [ ] Email reçu après POST /api/auth/magic-link
- [ ] Lien cliquable
- [ ] Redirection fonctionne après clic

---

## 🎯 Phase 1C - Frontend Admin Annonces (Jour 2)

### Task 1.6 - Page Création Annonce

**Fichier:** `client/src/pages/Admin/AnnouncementNew.tsx`

**Composants nécessaires:**
- Formulaire avec react-hook-form
- Éditeur Markdown (react-markdown + preview)
- Select catégorie
- Multi-select équipes
- Date picker deadline

**Packages:**
```bash
npm install react-hook-form react-markdown react-day-picker
```

**Code squelette:**
```tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ReactMarkdown from 'react-markdown';

const schema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  category: z.enum(['official', 'urgent', 'training', 'order', 'event', 'info']),
  deadline: z.string().optional(),
  teams: z.array(z.string()),
  status: z.enum(['draft', 'published']),
});

export default function AnnouncementNew() {
  const { register, handleSubmit, watch } = useForm();
  const content = watch('content', '');

  const onSubmit = async (data) => {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      // Rediriger vers liste ou afficher message WhatsApp
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('title')} placeholder="Titre" />
        <textarea {...register('content')} placeholder="Contenu Markdown" rows={15} />
        <select {...register('category')}>
          <option value="official">📢 Annonce officielle</option>
          <option value="urgent">⏰ Action urgente</option>
          {/* ... */}
        </select>
        {/* ... autres champs ... */}
        <button type="submit">Publier</button>
      </form>

      <div className="preview">
        <h3>Prévisualisation</h3>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
```

**Validation:**
- [ ] Formulaire s'affiche
- [ ] Prévisualisation Markdown en temps réel
- [ ] Soumission crée annonce en BDD
- [ ] Redirection après succès

---

### Task 1.7 - Page Liste Annonces Admin

**Fichier:** `client/src/pages/Admin/AnnouncementsList.tsx`

**Features:**
- Tableau avec colonnes: Titre, Catégorie, Deadline, Équipe, Statut, Actions
- Filtres: catégorie, équipe, statut
- Actions: Modifier, Archiver, Dupliquer, Copier message WhatsApp

**Code squelette:**
```tsx
export default function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetch(`/api/announcements?${new URLSearchParams(filters)}`)
      .then(res => res.json())
      .then(setAnnouncements);
  }, [filters]);

  const copyWhatsApp = async (id) => {
    const res = await fetch(`/api/announcements/${id}/whatsapp-message`);
    const { message } = await res.json();
    await navigator.clipboard.writeText(message);
    alert('Message copié!');
  };

  return (
    <div>
      {/* Filtres */}
      <div className="filters">
        <select onChange={(e) => setFilters({...filters, category: e.target.value})}>
          <option value="">Toutes catégories</option>
          {/* ... */}
        </select>
      </div>

      {/* Tableau */}
      <table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Deadline</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map(a => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.category}</td>
              <td>{a.deadline}</td>
              <td>{a.status}</td>
              <td>
                <button onClick={() => copyWhatsApp(a.id)}>📋 WhatsApp</button>
                <button>✏️ Modifier</button>
                <button>🗑️ Archiver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Validation:**
- [ ] Liste affichée
- [ ] Filtres fonctionnent
- [ ] Bouton WhatsApp copie message
- [ ] Archivage fonctionne

---

## 🎯 Phase 1D - Frontend Public Annonces (Jour 3)

### Task 1.8 - Page Liste Actualités Publique

**Fichier:** `client/src/pages/Actualites.tsx`

**Features:**
- Cards annonces (titre, extrait, catégorie, date)
- Filtres catégories (tabs)
- Recherche full-text
- Badge deadline rouge si < 48h

**Code squelette:**
```tsx
export default function Actualites() {
  const [announcements, setAnnouncements] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (search) params.set('search', search);
    params.set('status', 'published');

    fetch(`/api/announcements?${params}`)
      .then(res => res.json())
      .then(setAnnouncements);
  }, [category, search]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1>Actualités</h1>

      {/* Tabs catégories */}
      <div className="tabs">
        <button onClick={() => setCategory('all')}>Toutes</button>
        <button onClick={() => setCategory('official')}>📢 Officielles</button>
        {/* ... */}
      </div>

      {/* Recherche */}
      <input
        type="search"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Cartes */}
      <div className="grid gap-4">
        {announcements.map(a => (
          <AnnouncementCard key={a.id} announcement={a} />
        ))}
      </div>
    </div>
  );
}
```

**Validation:**
- [ ] Liste affichée
- [ ] Filtres catégories fonctionnent
- [ ] Recherche fonctionne
- [ ] Liens vers page détail

---

### Task 1.9 - Page Détail Annonce

**Fichier:** `client/src/pages/ActualiteDetail.tsx`

**Features:**
- Affichage Markdown rendu
- Badge catégorie + équipes
- Date + auteur
- Deadline si applicable
- Bouton "Copier lien" pour WhatsApp

**Code squelette:**
```tsx
import { useParams } from 'wouter';
import ReactMarkdown from 'react-markdown';

export default function ActualiteDetail() {
  const { slug } = useParams();
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    fetch(`/api/announcements/${slug}`)
      .then(res => res.json())
      .then(setAnnouncement);
  }, [slug]);

  if (!announcement) return <div>Chargement...</div>;

  return (
    <article className="max-w-3xl mx-auto py-8">
      <header>
        <span className="badge">{announcement.category}</span>
        <h1>{announcement.title}</h1>
        <p className="meta">
          {new Date(announcement.published_at).toLocaleDateString('fr-FR')}
          • Par {announcement.author?.email}
        </p>
      </header>

      {announcement.deadline && (
        <div className="deadline-banner">
          ⏰ Deadline: {new Date(announcement.deadline).toLocaleDateString('fr-FR')}
        </div>
      )}

      <ReactMarkdown>{announcement.content}</ReactMarkdown>

      <button onClick={() => {
        navigator.clipboard.writeText(window.location.href);
        alert('Lien copié!');
      }}>
        📋 Copier le lien
      </button>
    </article>
  );
}
```

**Validation:**
- [ ] Page accessible via slug
- [ ] Markdown rendu correctement
- [ ] Bouton copie lien fonctionne

---

### Task 1.10 - Widget Homepage

**Fichier:** `client/src/pages/Home.tsx`

**Modification:**
- Ajouter section "Dernières actualités" après le hero
- Afficher les 3 dernières annonces en cards
- Lien "Voir toutes les actualités"

**Code squelette:**
```tsx
export default function Home() {
  const [recentNews, setRecentNews] = useState([]);

  useEffect(() => {
    fetch('/api/announcements?status=published&limit=3')
      .then(res => res.json())
      .then(setRecentNews);
  }, []);

  return (
    <>
      {/* Hero existant */}
      <Hero />

      {/* Nouvelles actualités */}
      <section className="py-12">
        <h2>Dernières actualités</h2>
        <div className="grid grid-cols-3 gap-4">
          {recentNews.map(news => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
        <Link href="/actualites">Voir toutes les actualités →</Link>
      </section>

      {/* Reste de la page... */}
    </>
  );
}
```

**Validation:**
- [ ] 3 dernières actualités affichées
- [ ] Lien vers page complète fonctionne

---

## ✅ Checkpoint Phase 1

**À ce stade, vous devez avoir:**
- ✅ Système d'annonces complet (CRUD)
- ✅ Auth admin + magic links
- ✅ Interface admin création/liste
- ✅ Page publique actualités
- ✅ Génération messages WhatsApp

**Tests utilisateurs:**
1. Créer une annonce depuis admin
2. Copier message WhatsApp
3. Poster sur WhatsApp (groupe test)
4. Vérifier que membres voient l'annonce sur le site
5. Tester recherche/filtres

**Feedback à collecter:**
- Le formulaire est-il facile à utiliser?
- Les catégories sont-elles claires?
- Le message WhatsApp est-il bien formaté?
- Manque-t-il des infos?

---

## 🎯 Phase 2A - Matchs Backend (Jour 4-5)

### Task 2.1 - Schéma Matchs

**Fichier:** `shared/schema.ts`

Ajouter tables `matches` et `match_responses` (voir SPECIFICATIONS_MVP.md)

```bash
npm run db:push
```

**Validation:**
- [ ] Tables créées
- [ ] Relations fonctionnent

---

### Task 2.2 - API Matchs

**Routes:**

#### `POST /api/matches`
```typescript
// Créer un match
// Auth: admin/coach requis
// Body: { date, team, type, opponent, location, meeting_time, notes }
// Auto-calcul deadline = date - 24h
app.post('/api/matches', requireAdmin, async (req, res) => {
  const data = req.body;

  // Auto deadline
  if (!data.deadline) {
    const matchDate = new Date(data.date);
    data.deadline = new Date(matchDate.getTime() - 24 * 60 * 60 * 1000);
  }

  const [match] = await db.insert(matches).values({
    ...data,
    created_by: req.session.user.id,
  }).returning();

  res.json({ match });
});
```

#### `GET /api/matches`
```typescript
// Liste matchs avec filtres
// Query: ?team=u13&type=home&from=2026-01-01
app.get('/api/matches', async (req, res) => {
  const { team, type, from } = req.query;

  let query = db.select().from(matches);

  if (team) {
    query = query.where(eq(matches.team, team));
  }

  if (type) {
    query = query.where(eq(matches.type, type));
  }

  if (from) {
    query = query.where(gte(matches.date, new Date(from)));
  }

  query = query.orderBy(asc(matches.date));

  const results = await query;
  res.json(results);
});
```

#### `GET /api/matches/:id`
```typescript
// Détail match
app.get('/api/matches/:id', async (req, res) => {
  const match = await db.query.matches.findFirst({
    where: eq(matches.id, parseInt(req.params.id)),
  });

  if (!match) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(match);
});
```

#### `POST /api/matches/:id/respond`
```typescript
// Inscription à un match
// Body: { player_name, status, note? }
// Auth: optionnelle (magic link)
app.post('/api/matches/:id/respond', async (req, res) => {
  const matchId = parseInt(req.params.id);
  const { player_name, status, note } = req.body;

  // Vérifier deadline
  const match = await db.query.matches.findFirst({
    where: eq(matches.id, matchId),
  });

  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }

  if (new Date() > match.deadline) {
    return res.status(400).json({ error: 'Deadline passed' });
  }

  // Vérifier si déjà répondu (même email ou même nom)
  const existing = await db.query.match_responses.findFirst({
    where: and(
      eq(match_responses.match_id, matchId),
      or(
        eq(match_responses.user_id, req.session?.user?.id),
        eq(match_responses.player_name, player_name)
      )
    ),
  });

  if (existing) {
    // Update réponse existante
    await db.update(match_responses)
      .set({ status, note, updated_at: new Date() })
      .where(eq(match_responses.id, existing.id));
  } else {
    // Créer nouvelle réponse
    await db.insert(match_responses).values({
      match_id: matchId,
      user_id: req.session?.user?.id || null,
      player_name,
      status,
      note,
    });
  }

  res.json({ message: 'Response saved' });
});
```

#### `GET /api/matches/:id/responses`
```typescript
// Réponses d'un match (admin/coach)
app.get('/api/matches/:id/responses', async (req, res) => {
  const matchId = parseInt(req.params.id);

  const responses = await db.query.match_responses.findMany({
    where: eq(match_responses.match_id, matchId),
    orderBy: [
      asc(match_responses.status), // present, maybe, absent
      asc(match_responses.player_name),
    ],
  });

  // Stats
  const stats = {
    present: responses.filter(r => r.status === 'present').length,
    absent: responses.filter(r => r.status === 'absent').length,
    maybe: responses.filter(r => r.status === 'maybe').length,
    total: responses.length,
  };

  res.json({ responses, stats });
});
```

**Validation:**
- [ ] Toutes routes fonctionnent (Postman)
- [ ] Deadline auto-calculée
- [ ] Inscription empêchée après deadline
- [ ] Update réponse si déjà inscrit
- [ ] Stats correctes

---

### Task 2.3 - Génération message WhatsApp Match

**Fichier:** `server/utils/whatsapp.ts`

Ajouter fonction:

```typescript
export function generateMatchWhatsAppMessage(match: Match): string {
  const teamName = {
    'u7-u11': 'U7-U11',
    'u13': 'U13',
    'u15': 'U15',
    'u17': 'U17',
    'u20': 'U20',
    'adults': 'Adultes',
  }[match.team];

  const typeEmoji = {
    home: '🏠',
    away: '✈️',
    training: '🎓',
    tournament: '🏆',
  }[match.type];

  const date = new Date(match.date);
  const formattedDate = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  const meetingTime = new Date(match.meeting_time);
  const formattedMeeting = meetingTime.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  let message = `⚽ Match ${teamName} - ${formattedDate}\n\n`;
  message += `${typeEmoji} ${match.type === 'home' ? 'Domicile' : 'Extérieur'}\n`;
  message += `📍 ${match.location}\n`;
  message += `🕐 Convocation: ${formattedMeeting}\n`;

  if (match.opponent) {
    message += `🆚 ${match.opponent}\n`;
  }

  message += `\n👉 Qui vient? Inscrivez-vous:\n`;
  message += `https://jokers.srv759970.hstgr.cloud/match/${match.id}/inscription\n\n`;

  const deadline = new Date(match.deadline);
  message += `📲 Deadline: ${deadline.toLocaleDateString('fr-FR')}`;

  return message;
}
```

**Endpoint:**
```typescript
// GET /api/matches/:id/whatsapp-message
app.get('/api/matches/:id/whatsapp-message', async (req, res) => {
  const match = await db.query.matches.findFirst({
    where: eq(matches.id, parseInt(req.params.id)),
  });

  if (!match) {
    return res.status(404).json({ error: 'Not found' });
  }

  const message = generateMatchWhatsAppMessage(match);
  res.json({ message });
});
```

**Validation:**
- [ ] Message bien formaté
- [ ] Dates en français
- [ ] URL correcte
- [ ] Emojis corrects

---

## 🎯 Phase 2B - Frontend Matchs (Jour 5-6)

### Task 2.4 - Page Création Match Admin

**Fichier:** `client/src/pages/Admin/MatchNew.tsx`

**Formulaire:**
- Date/heure (datetime-local)
- Équipe (select)
- Type (select)
- Adversaire (text)
- Lieu (text avec autocomplete si domicile)
- Heure convocation (time)
- Notes (textarea Markdown)
- Statut (select)

**Code squelette:**
```tsx
export default function MatchNew() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const res = await fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const { match } = await res.json();

      // Copier message WhatsApp
      const msgRes = await fetch(`/api/matches/${match.id}/whatsapp-message`);
      const { message } = await msgRes.json();
      await navigator.clipboard.writeText(message);

      alert('Match créé! Message WhatsApp copié dans le presse-papier.');
      // Rediriger vers dashboard
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="datetime-local" {...register('date')} required />
      <select {...register('team')} required>
        <option value="u7-u11">U7-U11</option>
        <option value="u13">U13</option>
        {/* ... */}
      </select>
      <select {...register('type')} required>
        <option value="home">Match à domicile</option>
        <option value="away">Match à l'extérieur</option>
        <option value="training">Entraînement</option>
        <option value="tournament">Tournoi</option>
      </select>
      {/* ... autres champs ... */}
      <button type="submit">Créer le match</button>
    </form>
  );
}
```

**Validation:**
- [ ] Formulaire fonctionne
- [ ] Match créé en BDD
- [ ] Message WhatsApp copié automatiquement

---

### Task 2.5 - Dashboard Match Admin

**Fichier:** `client/src/pages/Admin/MatchDashboard.tsx`

**Sections:**
1. Détails match
2. Stats (présents/absents/peut-être)
3. Liste réponses (tableau)
4. Actions (PDF, relance)

**Code squelette:**
```tsx
export default function MatchDashboard() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [responses, setResponses] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Fetch match
    fetch(`/api/matches/${id}`)
      .then(res => res.json())
      .then(setMatch);

    // Fetch responses (polling 10s)
    const fetchResponses = () => {
      fetch(`/api/matches/${id}/responses`)
        .then(res => res.json())
        .then(data => {
          setResponses(data.responses);
          setStats(data.stats);
        });
    };

    fetchResponses();
    const interval = setInterval(fetchResponses, 10000);

    return () => clearInterval(interval);
  }, [id]);

  const generatePDF = async () => {
    // TODO: Task 2.7
  };

  return (
    <div>
      <h1>Match Dashboard</h1>

      {/* Détails */}
      <section>
        <h2>{match?.team} vs {match?.opponent}</h2>
        <p>{new Date(match?.date).toLocaleDateString('fr-FR')}</p>
      </section>

      {/* Stats */}
      <section>
        <div className="stats-grid">
          <div>✅ Présents: {stats.present}</div>
          <div>❌ Absents: {stats.absent}</div>
          <div>❓ Peut-être: {stats.maybe}</div>
          <div>📊 Total: {stats.total}</div>
        </div>
      </section>

      {/* Tableau réponses */}
      <section>
        <table>
          <thead>
            <tr>
              <th>Joueur</th>
              <th>Statut</th>
              <th>Réponse le</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {responses.map(r => (
              <tr key={r.id} className={r.status === 'present' ? 'bg-green-50' : ''}>
                <td>{r.player_name}</td>
                <td>
                  {r.status === 'present' && '✅ Présent'}
                  {r.status === 'absent' && '❌ Absent'}
                  {r.status === 'maybe' && '❓ Peut-être'}
                </td>
                <td>{new Date(r.responded_at).toLocaleString('fr-FR')}</td>
                <td>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Actions */}
      <section>
        <button onClick={generatePDF}>📄 Feuille de match PDF</button>
      </section>
    </div>
  );
}
```

**Validation:**
- [ ] Dashboard affiche match et réponses
- [ ] Stats correctes
- [ ] Mise à jour temps réel (polling 10s)
- [ ] Tri par statut fonctionne

---

### Task 2.6 - Page Inscription Match Publique

**Fichier:** `client/src/pages/MatchInscription.tsx`

**Features:**
- Détails match (date, lieu, adversaire)
- Countdown deadline
- Formulaire simple
- Magic link si pas connecté

**Code squelette:**
```tsx
export default function MatchInscription() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [showMagicLink, setShowMagicLink] = useState(false);

  useEffect(() => {
    fetch(`/api/matches/${id}`)
      .then(res => res.json())
      .then(setMatch);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      player_name: formData.get('player_name'),
      status: formData.get('status'),
      note: formData.get('note'),
    };

    const res = await fetch(`/api/matches/${id}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.status === 401) {
      // Pas connecté → demander email
      setShowMagicLink(true);
      return;
    }

    if (res.ok) {
      setSubmitted(true);
    }
  };

  const sendMagicLink = async () => {
    await fetch('/api/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, redirect: `/match/${id}/inscription` }),
    });

    alert('Email envoyé! Cliquez sur le lien pour finaliser votre inscription.');
  };

  if (!match) return <div>Chargement...</div>;

  const deadlinePassed = new Date() > new Date(match.deadline);

  if (deadlinePassed) {
    return <div>Inscriptions closes</div>;
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <h2>✅ Inscription enregistrée!</h2>
        <p>Merci d'avoir répondu.</p>
      </div>
    );
  }

  if (showMagicLink) {
    return (
      <div className="text-center py-12">
        <h2>Vérification requise</h2>
        <p>Entrez votre email pour finaliser l'inscription:</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
        />
        <button onClick={sendMagicLink}>Envoyer le lien</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1>Inscription au match</h1>

      {/* Détails match */}
      <div className="match-details">
        <h2>{match.team} vs {match.opponent}</h2>
        <p>📅 {new Date(match.date).toLocaleDateString('fr-FR')}</p>
        <p>📍 {match.location}</p>
        <p>🕐 Convocation: {new Date(match.meeting_time).toLocaleTimeString('fr-FR')}</p>
      </div>

      {/* Countdown */}
      <div className="deadline-countdown">
        ⏰ Deadline: {new Date(match.deadline).toLocaleString('fr-FR')}
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit}>
        <label>
          Nom du joueur:
          <input type="text" name="player_name" required />
        </label>

        <label>Votre réponse:</label>
        <div className="status-buttons">
          <label>
            <input type="radio" name="status" value="present" required />
            ✅ Présent
          </label>
          <label>
            <input type="radio" name="status" value="absent" />
            ❌ Absent
          </label>
          <label>
            <input type="radio" name="status" value="maybe" />
            ❓ Peut-être
          </label>
        </div>

        <label>
          Note (optionnel):
          <input type="text" name="note" maxLength={100} />
        </label>

        <button type="submit">Enregistrer ma réponse</button>
      </form>
    </div>
  );
}
```

**Validation:**
- [ ] Formulaire affiché
- [ ] Inscription fonctionne si connecté
- [ ] Magic link demandé si pas connecté
- [ ] Deadline affichée
- [ ] Soumission bloquée après deadline

---

### Task 2.7 - Export PDF Feuille de Match

**Package:**
```bash
npm install jspdf jspdf-autotable
```

**Fichier:** `server/utils/pdf.ts`

```typescript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateMatchSheet(match, responses) {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(20);
  doc.text('Les Jokers d\'Aubagne', 105, 20, { align: 'center' });

  doc.setFontSize(16);
  doc.text(`Feuille de match - ${match.team}`, 105, 30, { align: 'center' });

  // Détails
  doc.setFontSize(12);
  doc.text(`Date: ${new Date(match.date).toLocaleDateString('fr-FR')}`, 20, 45);
  doc.text(`Adversaire: ${match.opponent}`, 20, 52);
  doc.text(`Lieu: ${match.location}`, 20, 59);

  // Tableau joueurs
  const presentPlayers = responses.filter(r => r.status === 'present');

  autoTable(doc, {
    startY: 70,
    head: [['Numéro', 'Nom', 'Arrivée', 'Signature']],
    body: presentPlayers.map(p => [
      p.jersey_number || '-',
      p.player_name,
      '',
      '',
    ]),
  });

  // Notes
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text('Notes entraîneur:', 20, finalY);
  doc.rect(20, finalY + 5, 170, 40);

  return doc.output('arraybuffer');
}
```

**Endpoint:**
```typescript
// GET /api/matches/:id/sheet.pdf
app.get('/api/matches/:id/sheet.pdf', requireAdmin, async (req, res) => {
  const matchId = parseInt(req.params.id);

  const match = await db.query.matches.findFirst({
    where: eq(matches.id, matchId),
  });

  const { responses } = await db.query.match_responses.findMany({
    where: eq(match_responses.match_id, matchId),
  });

  const pdf = generateMatchSheet(match, responses);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="match-${matchId}.pdf"`);
  res.send(Buffer.from(pdf));
});
```

**Frontend:**
```tsx
// Dans MatchDashboard.tsx
const downloadPDF = () => {
  window.open(`/api/matches/${id}/sheet.pdf`, '_blank');
};
```

**Validation:**
- [ ] PDF généré
- [ ] Tableau joueurs présents
- [ ] Format correct
- [ ] Téléchargement fonctionne

---

### Task 2.8 - Calendrier Public Matchs

**Fichier:** `client/src/pages/Matchs.tsx`

**Features:**
- Vue liste prochains matchs (30 jours)
- Filtres par équipe
- Badge statut
- Bouton "S'inscrire"

**Code squelette:**
```tsx
export default function Matchs() {
  const [matches, setMatches] = useState([]);
  const [teamFilter, setTeamFilter] = useState('all');

  useEffect(() => {
    const params = new URLSearchParams();
    const from = new Date().toISOString().split('T')[0];
    params.set('from', from);

    if (teamFilter !== 'all') {
      params.set('team', teamFilter);
    }

    fetch(`/api/matches?${params}`)
      .then(res => res.json())
      .then(setMatches);
  }, [teamFilter]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1>Calendrier des matchs</h1>

      {/* Filtres */}
      <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}>
        <option value="all">Toutes les équipes</option>
        <option value="u7-u11">U7-U11</option>
        {/* ... */}
      </select>

      {/* Liste */}
      <div className="matches-list">
        {matches.map(match => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}

function MatchCard({ match }) {
  const deadlinePassed = new Date() > new Date(match.deadline);

  return (
    <div className="match-card">
      <div className="match-header">
        <span className="team-badge">{match.team}</span>
        <span className={`status-badge status-${match.status}`}>
          {match.status === 'confirmed' && '🟢 Confirmé'}
          {match.status === 'pending' && '🟡 À confirmer'}
          {match.status === 'cancelled' && '🔴 Annulé'}
        </span>
      </div>

      <h3>{match.team} vs {match.opponent}</h3>
      <p>📅 {new Date(match.date).toLocaleDateString('fr-FR')}</p>
      <p>📍 {match.location}</p>

      {!deadlinePassed && match.status === 'confirmed' && (
        <Link href={`/match/${match.id}/inscription`}>
          <button>S'inscrire</button>
        </Link>
      )}

      {deadlinePassed && <span className="text-gray-500">Inscriptions closes</span>}
    </div>
  );
}
```

**Validation:**
- [ ] Liste affichée
- [ ] Filtres fonctionnent
- [ ] Badges status corrects
- [ ] Bouton inscription visible si deadline OK
- [ ] Lien vers page inscription fonctionne

---

## ✅ Checkpoint Phase 2

**À ce stade, vous devez avoir:**
- ✅ Système matchs complet (CRUD)
- ✅ Inscriptions matchs avec tracking
- ✅ Dashboard entraîneur temps réel
- ✅ Export PDF feuille de match
- ✅ Calendrier public

**Tests utilisateurs:**
1. Créer un match depuis admin
2. Copier message WhatsApp et poster
3. Inscrire plusieurs joueurs (certains connectés, certains via magic link)
4. Vérifier dashboard temps réel
5. Télécharger PDF feuille de match

**Feedback à collecter:**
- Le formulaire d'inscription est-il simple?
- Le magic link fonctionne-t-il bien?
- Le dashboard est-il clair?
- Le PDF contient-il toutes les infos nécessaires?

---

## 📦 Déploiement Production

### Checklist pré-déploiement

- [ ] Toutes les migrations Drizzle appliquées
- [ ] Variables d'environnement configurées (.env)
- [ ] Tests manuels passés
- [ ] Build local fonctionne (`npm run build`)
- [ ] PM2 ecosystem.config.cjs à jour

### Commandes déploiement

```bash
# Local: Build
npm run build

# Upload vers serveur
scp -r dist/ package.json package-lock.json automation@69.62.108.82:/var/www/jokers/

# Sur le serveur
ssh automation@69.62.108.82
cd /var/www/jokers
npm install --production
npm run db:push
pm2 restart jokers-hockey
pm2 save
```

### Vérifications post-déploiement

```bash
# Vérifier PM2
pm2 status
pm2 logs jokers-hockey --lines 50

# Tester site
curl -I https://jokers.srv759970.hstgr.cloud
curl https://jokers.srv759970.hstgr.cloud/api/announcements

# Vérifier BDD
# Connexion PostgreSQL et vérifier tables
```

---

## 📈 Prochaines étapes (Phase 3+)

### Phase 3 - Fiches Membres
- Table members + staff
- Page publique /equipe
- Gestion numéros maillots
- Organigramme bureau

### Phase 4 - Améliorations
- Notifications email automatiques (relances)
- Stats avancées (graphiques présence)
- Covoiturage (optionnel)
- Photos privées (Dropbox externe)

### Phase 5 - Optimisations
- PWA (notifications push)
- Cache (Redis)
- Search engine (Algolia)
- Analytics (Plausible)

---

## 🆘 Support & Ressources

**Documentation:**
- Drizzle ORM: https://orm.drizzle.team/docs/overview
- React Hook Form: https://react-hook-form.com
- React Markdown: https://github.com/remarkjs/react-markdown

**Debugging:**
- Logs PM2: `pm2 logs jokers-hockey`
- Logs Nginx: `sudo tail -f /var/log/nginx/jokers_ssl_error.log`
- PostgreSQL: Connexion via DBeaver ou psql

**Contact:**
- Questions techniques: [À définir]
- Feedback utilisateurs: [À définir]

---

**Bon développement! 🚀**
