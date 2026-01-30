# Analyse des Besoins Utilisateurs - Site Jokers Hockey

**Date:** 2026-01-29
**Objectif:** Identifier tous les utilisateurs du site (publics et privés) et leurs scénarios d'usage pour définir la marche à suivre technique.

---

## 1. UTILISATEURS PUBLICS (Sans Authentification)

### 1.1 Visiteur Occasionnel
**Profil:** Personne découvrant le club (parent cherchant un club pour son enfant, curieux, presse locale)

**Besoins:**
- Consulter les informations générales du club (histoire, valeurs, contact)
- Voir les équipes disponibles (U7 à Adultes)
- Consulter le calendrier des matchs à venir
- Voir les résultats récents
- Découvrir les actualités du club
- Consulter la galerie photos/vidéos
- Accéder aux informations de contact

**Scénarios d'usage:**
1. "Je veux inscrire mon enfant de 8 ans au hockey"
   - Consulte page équipes → voir catégorie U7-U11
   - Consulte contact → formulaire ou téléphone

2. "Je veux savoir quand a lieu le prochain match"
   - Consulte calendrier matchs
   - Voir date/heure/lieu

3. "Je veux voir si l'équipe gagne"
   - Consulte résultats récents
   - Voir scores

**Actions possibles:**
- ✅ Consulter toutes les pages publiques
- ✅ S'abonner à la newsletter
- ✅ Envoyer un message via formulaire contact
- ❌ Pas d'inscription compte
- ❌ Pas d'accès zone privée

---

### 1.2 Supporter/Fan
**Profil:** Personne suivant régulièrement le club (famille de joueur, fan local)

**Besoins:**
- Suivre tous les matchs (calendrier complet)
- Voir les résultats et statistiques
- Regarder les vidéos des matchs
- Consulter les photos des événements
- Lire les actualités du club
- S'abonner à la newsletter pour recevoir les updates

**Scénarios d'usage:**
1. "Je veux voir les photos du dernier match"
   - Accède à la galerie
   - Filtre par match ou date

2. "Je veux être notifié des prochains matchs"
   - S'inscrit à la newsletter
   - Reçoit emails avec calendrier

**Actions possibles:**
- ✅ Tout ce que le visiteur occasionnel peut faire
- ✅ S'abonner newsletter
- ❌ Pas de compte personnel
- ❌ Pas d'interaction (commentaires, likes, etc.)

---

## 2. UTILISATEURS PRIVÉS (Avec Authentification)

### 2.1 Parent de Joueur
**Profil:** Parent d'un enfant inscrit au club (catégorie jeunes U7-U20)

**Besoins:**
- **PHASE 1 (Actuel):**
  - Consulter le calendrier des matchs de l'équipe de son enfant
  - Voir les résultats
  - Lire les annonces spécifiques à l'équipe (WhatsApp Archive)
  - Consulter les photos/vidéos de l'équipe

- **PHASE 2 (Dans 1-3 mois):**
  - S'inscrire/désinscrire son enfant aux matchs (présence/absence)
  - Voir la liste des inscrits pour un match
  - Ajouter des commentaires (ex: "arrivera en retard")
  - Recevoir des notifications pour rappels matchs

**Scénarios d'usage:**

**Phase 1 (Actuel):**
1. "Je veux lire l'annonce du coach sur le match de samedi"
   - Se connecte (si zone privée)
   - Consulte annonces → filtre U13
   - Lit l'annonce markdown

2. "Je veux voir les photos du dernier tournoi"
   - Consulte galerie → filtre U13
   - Télécharge photos si besoin

**Phase 2 (Futur):**
1. "Je veux inscrire mon fils au match de dimanche"
   - Se connecte
   - Accède à "Mes inscriptions" ou calendrier
   - Clique sur match → "Inscrire [Nom de l'enfant]"
   - Statut: "Confirmé"

2. "Mon fils sera absent samedi, je dois le signaler"
   - Accède au match
   - Change statut: "Confirmé" → "Absent"
   - Ajoute commentaire: "Malade"

3. "Je veux savoir combien de joueurs sont inscrits pour demain"
   - Consulte match
   - Voit liste: 12 confirmés, 2 peut-être, 3 absents

**Actions possibles:**
- ✅ Phase 1: Consulter annonces de l'équipe de son enfant
- ✅ Phase 1: Voir calendrier/résultats
- ✅ Phase 2: Inscrire/désinscrire son enfant aux matchs
- ✅ Phase 2: Ajouter commentaires
- ❌ Ne peut PAS créer d'annonces
- ❌ Ne peut PAS modifier les matchs
- ❌ Ne peut PAS uploader des photos

**Données personnelles:**
- Email (login)
- Nom complet
- Téléphone
- Enfant(s) lié(s) (nom, équipe)

---

### 2.2 Joueur Adulte
**Profil:** Joueur de l'équipe adulte

**Besoins:**
- **Phase 1:**
  - Consulter calendrier matchs adultes
  - Lire annonces équipe adulte
  - Voir résultats/photos/vidéos

- **Phase 2:**
  - S'inscrire soi-même aux matchs (pas de parent)
  - Voir liste des inscrits
  - Recevoir rappels matchs

**Scénarios d'usage:**
Similaires au parent, mais pour soi-même:

1. "Je veux m'inscrire au match de vendredi"
   - Se connecte
   - Accède calendrier adultes
   - S'inscrit directement

**Actions possibles:**
- ✅ Identiques au parent, mais pour soi-même
- ❌ Ne peut PAS créer annonces/matchs/photos

**Données personnelles:**
- Email (login)
- Nom complet
- Téléphone
- Numéro maillot
- Équipe (Adultes)

---

### 2.3 Coach / Entraîneur
**Profil:** Entraîneur d'une ou plusieurs équipes jeunes/adultes

**Besoins:**
- **Phase 1:**
  - Créer des annonces pour son équipe
  - Publier annonces (WhatsApp → Archive web)
  - Voir annonces publiées/brouillons
  - Consulter calendrier/résultats

- **Phase 2:**
  - Voir qui est inscrit aux matchs
  - Créer/modifier des matchs pour son équipe
  - Ajouter résultats après match
  - Valider/gérer la liste des inscrits
  - Voir statistiques présences joueurs

**Scénarios d'usage:**

**Phase 1:**
1. "Je veux envoyer une annonce sur le rassemblement de samedi"
   - Se connecte
   - Accède dashboard annonces
   - Crée nouvelle annonce (markdown)
   - Catégorie: U13
   - Sauvegarde brouillon
   - Publie → visible pour parents U13

2. "Je veux modifier une annonce publiée hier"
   - Consulte mes annonces
   - Édite annonce
   - Republish

**Phase 2:**
1. "Je veux voir qui vient au match de dimanche"
   - Consulte calendrier
   - Clique sur match
   - Voit liste: 14 confirmés, 2 peut-être, 1 absent
   - Identifie s'il a assez de joueurs

2. "Le match est annulé, je dois le signaler"
   - Accède au match
   - Change statut: "Upcoming" → "Cancelled"
   - (Optionnel) Notification automatique aux inscrits

**Actions possibles:**
- ✅ Phase 1: Créer/éditer/publier annonces pour son équipe
- ✅ Phase 2: Créer/modifier matchs de son équipe
- ✅ Phase 2: Voir liste inscrits
- ✅ Phase 2: Ajouter résultats matchs
- ❌ Ne peut PAS créer matchs pour autres équipes
- ❌ Ne peut PAS gérer le staff
- ❌ Ne peut PAS upload photos (sauf si aussi photographe)

**Données personnelles:**
- Email (login)
- Nom complet
- Téléphone
- Équipe(s) gérée(s)

---

### 2.4 Photographe
**Profil:** Personne en charge de la photographie des événements (peut être parent, bénévole, pro)

**Besoins:**
- Uploader des photos après matchs/événements
- Organiser photos par match/catégorie
- Voir galerie complète
- (Optionnel) Supprimer/modifier ses photos

**Scénarios d'usage:**

1. "J'ai pris 50 photos au tournoi U15, je veux les publier"
   - Se connecte
   - Accède dashboard photos
   - Upload multiple (batch)
   - Associe à match ou catégorie U15
   - Publie

2. "Une photo est floue, je veux la supprimer"
   - Consulte mes photos
   - Supprime photo

**Actions possibles:**
- ✅ Upload photos (single ou batch)
- ✅ Associer photos à un match/équipe
- ✅ Supprimer ses propres photos
- ❌ Ne peut PAS créer annonces
- ❌ Ne peut PAS gérer matchs
- ❌ Workflow d'approbation: NON (validation utilisateur: pas besoin)

**Données personnelles:**
- Email (login)
- Nom complet
- Téléphone (optionnel)

---

### 2.5 Secrétaire
**Profil:** Membre du bureau en charge de la communication et des annonces

**Besoins:**
- Créer/publier annonces pour toutes les équipes
- Gérer les abonnements newsletter
- Modérer le contenu (photos/vidéos si workflow approbation)
- Consulter statistiques (inscriptions newsletter, etc.)

**Scénarios d'usage:**

1. "Je veux envoyer une annonce générale à tout le club"
   - Se connecte
   - Crée annonce
   - Catégorie: "Général"
   - Publie → visible pour tous

2. "Je veux voir qui est abonné à la newsletter"
   - Consulte dashboard newsletter
   - Exporte liste emails

**Actions possibles:**
- ✅ Créer annonces pour toutes équipes
- ✅ Gérer newsletter
- ✅ Voir statistiques
- ❌ Ne peut PAS créer matchs
- ❌ Ne peut PAS gérer staff/joueurs

**Données personnelles:**
- Email (login)
- Nom complet
- Téléphone

---

### 2.6 Admin / Président
**Profil:** Administrateur système avec accès complet

**Besoins:**
- Gérer tous les utilisateurs (créer, désactiver comptes)
- Gérer toutes les équipes (créer, modifier)
- Gérer le staff (encadrement)
- Gérer tous les matchs
- Gérer toutes les annonces
- Gérer toutes les photos/vidéos
- Accès aux statistiques complètes
- Configuration système

**Scénarios d'usage:**

1. "Un nouveau coach rejoint le club, je dois créer son compte"
   - Se connecte en admin
   - Crée utilisateur
   - Email, mot de passe temporaire
   - Rôle: "Coach"
   - Équipe: U15

2. "Un parent déménage, je dois désactiver son compte"
   - Cherche utilisateur
   - Change statut: "Actif" → "Inactif"

3. "Je veux ajouter un nouveau membre au staff"
   - Accède gestion staff
   - Crée profil (nom, rôle, photo, bio)
   - Publie

**Actions possibles:**
- ✅ Tout ce que les autres rôles peuvent faire
- ✅ Gérer utilisateurs (CRUD)
- ✅ Gérer équipes (CRUD)
- ✅ Gérer staff (CRUD)
- ✅ Accès configuration système

**Données personnelles:**
- Email (login)
- Nom complet
- Téléphone

---

## 3. MATRICE DES PERMISSIONS PAR FONCTIONNALITÉ

| Fonctionnalité | Public | Parent | Joueur Adulte | Coach | Photographe | Secrétaire | Admin |
|----------------|--------|--------|---------------|-------|-------------|------------|-------|
| **Consultation** |
| Voir site public | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Voir calendrier matchs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Voir résultats | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Voir galerie photos/vidéos | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Lire annonces publiques | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Lire annonces son équipe | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Phase 1 - Annonces** |
| Créer annonces son équipe | ❌ | ❌ | ❌ | ✅ (son équipe) | ❌ | ✅ (toutes) | ✅ |
| Publier annonces | ❌ | ❌ | ❌ | ✅ (son équipe) | ❌ | ✅ (toutes) | ✅ |
| Éditer annonces | ❌ | ❌ | ❌ | ✅ (siennes) | ❌ | ✅ (toutes) | ✅ |
| **Phase 2 - Inscriptions** |
| S'inscrire à un match | ❌ | ✅ (son enfant) | ✅ (soi-même) | ❌ | ❌ | ❌ | ✅ |
| Voir liste inscrits | ❌ | ❌ | ❌ | ✅ (son équipe) | ❌ | ❌ | ✅ |
| **Gestion Matchs** |
| Créer match | ❌ | ❌ | ❌ | ✅ (son équipe) | ❌ | ❌ | ✅ |
| Modifier match | ❌ | ❌ | ❌ | ✅ (son équipe) | ❌ | ❌ | ✅ |
| Ajouter résultat | ❌ | ❌ | ❌ | ✅ (son équipe) | ❌ | ❌ | ✅ |
| **Photos/Vidéos** |
| Upload photos | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Supprimer photos | ❌ | ❌ | ❌ | ❌ | ✅ (siennes) | ❌ | ✅ |
| Upload vidéos | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Administration** |
| Gérer utilisateurs | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Gérer équipes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Gérer staff | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Gérer newsletter | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 4. FLUX D'INFORMATIONS

### 4.1 Communication Club → Membres

**Annonces:**
- Coach/Secrétaire crée annonce (markdown)
- Catégorise par équipe (U7, U9, ..., Adultes, Général)
- Publie sur le site
- (Optionnel futur) Envoi email/SMS aux abonnés de cette catégorie

**Calendrier:**
- Admin/Coach crée match
- Visible publiquement sur site
- (Phase 2) Notifications aux inscrits

**Résultats:**
- Coach/Admin ajoute résultat après match
- Visible publiquement

**Photos/Vidéos:**
- Photographe/Admin upload
- Visible publiquement (ou privé selon choix)

### 4.2 Communication Membres → Club

**Inscriptions matchs (Phase 2):**
- Parent/Joueur s'inscrit
- Coach voit liste en temps réel
- Peut contacter si besoin

**Contact:**
- Public envoie formulaire contact
- Arrive dans email admin/secrétaire

**Newsletter:**
- Public s'abonne
- Admin/Secrétaire exporte liste pour envoi

---

## 5. PRIORISATION DES BESOINS

### PHASE 1 - MVP ACTUEL (Déjà implémenté)
**Objectif:** Archiver annonces WhatsApp sur le site

**Fonctionnalités:**
- ✅ Site public (consultation libre)
- ✅ API annonces (CRUD)
- ✅ Dashboard admin pour créer/publier annonces
- ✅ Page publique `/actualites` avec filtre par équipe
- ✅ Markdown support

**Utilisateurs concernés:**
- Admin (crée annonces)
- Public (lit annonces)

**Statut:** ✅ FONCTIONNEL

---

### PHASE 2 - INSCRIPTIONS MATCHS (Dans 1-3 mois)
**Objectif:** Permettre aux parents/joueurs de s'inscrire aux matchs

**Fonctionnalités requises:**
1. **Authentification:**
   - Login/logout (email + password)
   - Session persistante
   - Rôles: Parent, Joueur Adulte, Coach, Photographe, Secrétaire, Admin

2. **Gestion utilisateurs:**
   - Créer compte (admin)
   - Lier parent → enfant (joueur)
   - Lier joueur → équipe

3. **Inscriptions:**
   - Parent/Joueur s'inscrit à un match
   - Statuts: Confirmé, Peut-être, Absent
   - Commentaire optionnel
   - Coach voit liste inscrits

4. **Interface:**
   - Page "Mes inscriptions"
   - Liste matchs à venir avec bouton "S'inscrire"
   - Pour coach: vue liste inscrits par match

**Utilisateurs concernés:**
- Parent (inscrit son enfant)
- Joueur Adulte (s'inscrit soi-même)
- Coach (voit inscrits)
- Admin (gestion)

**Statut:** ⏳ À DÉVELOPPER

---

### PHASE 3 - EXTENSIONS FUTURES (Optionnel)
**Objectif:** Améliorer l'expérience et automatisation

**Fonctionnalités:**
1. **Notifications:**
   - Email/SMS rappel match (J-2, J-1)
   - Notification quand annonce publiée
   - Alerte si match annulé

2. **Statistiques:**
   - Taux de présence par joueur
   - Statistiques équipe (victoires/défaites)
   - Dashboard analytics pour admin

3. **Galerie privée:**
   - Photos privées par équipe (non publiques)
   - Accès limité aux membres de l'équipe

4. **Forum/Commentaires:**
   - Commentaires sur annonces
   - Discussion entre membres

**Statut:** 💡 IDÉES

---

## 6. BESOINS TECHNIQUES DÉCOULANT

### Pour PHASE 1 (Actuel - Déjà fait)
- ✅ Base de données: table `announcements`
- ✅ API REST: GET/POST/PATCH/DELETE annonces
- ✅ Interface admin: dashboard React custom
- ✅ Markdown editor + preview
- ❌ Authentification: PAS NÉCESSAIRE (admin a accès direct au dashboard)

**PROBLÈME ACTUEL:** Le dashboard `/dashboard` est accessible sans login. N'importe qui peut créer des annonces.

**BESOIN:** Protéger `/dashboard` avec login admin uniquement.

---

### Pour PHASE 2 (Inscriptions)
**Backend:**
- Table `users` (email, password, role, fullName, phone, active)
- Table `teams` (name, category)
- Table `players` (fullName, userId, teamId, jerseyNumber, birthDate, parentInfo)
- Table `match_inscriptions` (matchId, playerId, userId, status, comment)
- API auth (login, logout, me, register)
- API inscriptions (create, update, list)
- Middleware RBAC (requireAuth, requireRole)
- Session management (PostgreSQL store)

**Frontend:**
- Login page
- AuthContext (session state)
- ProtectedRoute component
- Page "Mes inscriptions" (pour parents/joueurs)
- Page "Liste inscrits" (pour coachs)
- Interface création utilisateurs (pour admin)

**Authentification:**
- Passport.js + express-session
- Bcrypt pour passwords
- PostgreSQL pour sessions (table `user_sessions`)

---

## 7. RECOMMANDATIONS

### Approche Progressive

**ÉTAPE 1: Sécuriser l'existant (URGENT)**
- Ajouter login simple pour admin
- Protéger `/dashboard` avec authentification
- Un seul utilisateur suffit (admin actuel)
- **Solution:** Simple express-session + password check (pas besoin de Passport.js pour 1 user)

**ÉTAPE 2: Préparer Phase 2 (Dans 1-3 mois)**
- Implémenter authentification complète (Passport.js)
- Créer tables users, teams, players, match_inscriptions
- RBAC complet (7 rôles)
- Développer interface inscriptions

**ÉTAPE 3: Extensions futures (Selon besoins)**
- Notifications
- Statistiques
- Galerie privée

---

## 8. QUESTIONS À CLARIFIER AVEC L'UTILISATEUR

1. **Phase 1 - Sécurité actuelle:**
   - Qui peut actuellement créer des annonces?
   - Y a-t-il plusieurs admins ou un seul?
   - Faut-il sécuriser `/dashboard` MAINTENANT ou attendre Phase 2?

2. **Phase 2 - Inscriptions:**
   - Combien de parents/joueurs estimés? (10? 50? 200?)
   - Qui crée les comptes parents? (Admin manuellement ou auto-inscription?)
   - Un parent peut avoir plusieurs enfants?
   - Un joueur peut être dans plusieurs équipes?

3. **Workflow création comptes:**
   - Admin crée comptes manuellement → envoie email avec mot de passe
   - OU Auto-inscription publique → admin valide
   - OU Invitation par email → parent crée son mot de passe

4. **Photographe:**
   - Combien de photographes? (1 bénévole, plusieurs, photographe pro?)
   - Workflow actuel pour photos: qui upload actuellement?
   - Besoin d'approbation photos avant publication?

5. **Coachs:**
   - Combien de coachs? (1 par équipe = 7-8 coachs?)
   - Un coach peut gérer plusieurs équipes?
   - Coach doit pouvoir créer des matchs ou seulement admin?

---

## 9. PLAN D'ACTION PROPOSÉ

### Option A: Approche Minimale (Recommandé pour démarrer)

**Objectif:** Sécuriser l'existant sans sur-ingénierie

1. **Aujourd'hui (30 min):**
   - Ajouter simple login admin sur `/dashboard`
   - Variable d'environnement: `ADMIN_PASSWORD`
   - Session simple (express-session + memory store)
   - Pas de BDD, pas de rôles, juste un password

2. **Dans 1-3 mois (Phase 2):**
   - Implémenter authentification complète
   - Passport.js + PostgreSQL sessions
   - Tables users, teams, players, inscriptions
   - RBAC complet
   - Interface inscriptions

**Avantages:**
- ✅ Rapide (30 min vs 8h)
- ✅ Sécurise l'existant
- ✅ Pas de risque de casser prod
- ✅ Laisse temps de planifier Phase 2 correctement

**Inconvénients:**
- ❌ Refactoring à faire pour Phase 2
- ❌ Un seul admin possible

---

### Option B: Approche Complète (Comme plan précédent)

**Objectif:** Implémenter toute l'authentification maintenant

1. **Aujourd'hui (8h):**
   - Restaurer prod (retirer AdminJS)
   - Étendre schéma BDD (users, teams, players, inscriptions)
   - Passport.js + sessions PostgreSQL
   - RBAC complet (7 rôles)
   - Login page React
   - AuthContext
   - Protéger routes

2. **Dans 1-3 mois:**
   - Ajouter interface inscriptions
   - Utiliser l'auth déjà en place

**Avantages:**
- ✅ Architecture finale prête
- ✅ Pas de refactoring futur
- ✅ Supporte Phase 2 immédiatement

**Inconvénients:**
- ❌ Long (8h)
- ❌ Risque de bugs
- ❌ Over-engineering pour besoin actuel (1 seul admin)

---

## 10. DÉCISION REQUISE

**Questions pour l'utilisateur:**

1. **Besoin immédiat:**
   - Faut-il sécuriser `/dashboard` MAINTENANT?
   - Ou peut-on attendre Phase 2 (dans 1-3 mois)?

2. **Si besoin immédiat:**
   - **Option A** (simple password admin) - 30 min
   - **Option B** (authentification complète) - 8h

3. **Phase 2:**
   - Confirmer timeline: vraiment dans 1-3 mois?
   - Combien d'utilisateurs estimés?
   - Workflow création comptes: admin crée manuellement ou auto-inscription?

**Ma recommandation:**
- **Court terme:** Option A (simple login admin)
- **Moyen terme (J+30):** Planifier Phase 2 en détail (ateliers avec utilisateurs)
- **Long terme (M+2-3):** Implémenter Option B (auth complète + inscriptions)

---

**Prochaine étape:** Répondre aux questions ci-dessus pour définir la marche à suivre précise.
