# Scénario de Test - Fonctionnalités Admin Payload CMS

**Date**: 22 décembre 2025
**Objectif**: Tester toutes les fonctionnalités admin du site Jokers Hockey après migration vers Payload CMS 3.69.0

---

## 📋 Prérequis

- ✅ Serveur running sur http://localhost:5000
- ✅ Base de données PostgreSQL (Neon) connectée
- ✅ 10 collections migrées et opérationnelles
- ⏳ Création du premier compte admin à faire

---

## 🔐 PHASE 1 : Authentification et Rôles

### Test 1.1 : Création du premier compte Admin
**URL**: http://localhost:5000/admin

**Actions**:
1. Accéder à `/admin` pour la première fois
2. Remplir le formulaire de création du premier utilisateur :
   - Email: `admin@jokers.fr`
   - Password: `Admin2025!SecurePass`
   - First Name: `Super`
   - Last Name: `Admin`
   - Role: `admin` (devrait être sélectionné par défaut)
   - Phone: `+33 6 12 34 56 78`
3. Créer le compte

**Résultats attendus**:
- ✅ Compte créé avec succès
- ✅ Connexion automatique
- ✅ Redirection vers le dashboard admin
- ✅ Email de confirmation loggé dans la console (pas d'email réel)

### Test 1.2 : Création de comptes avec différents rôles

**Créer 3 utilisateurs supplémentaires** :

**Coach 1** :
- Email: `coach.u13@jokers.fr`
- Password: `Coach2025!`
- First Name: `Jean`
- Last Name: `Dupont`
- Role: `coach`
- Team: `U13`

**Coach 2** :
- Email: `coach.u15@jokers.fr`
- Password: `Coach2025!`
- First Name: `Marie`
- Last Name: `Martin`
- Role: `coach`
- Team: `U15`

**Parent 1** :
- Email: `parent1@gmail.com`
- Password: `Parent2025!`
- First Name: `Pierre`
- Last Name: `Dubois`
- Role: `parent`

**Résultats attendus**:
- ✅ 3 nouveaux comptes créés
- ✅ Rôles correctement assignés
- ✅ Team relationship fonctionnelle pour les coaches

---

## 👥 PHASE 2 : Collection Players - Permissions Complexes

### Test 2.1 : Création de joueurs (en tant qu'Admin)

**Créer 6 joueurs** (2 par équipe U13, U15, U17) :

**Joueur 1 - U13** :
- First Name: `Lucas`
- Last Name: `Dubois` (enfant du Parent 1)
- Birth Date: `2012-05-15`
- Team: `U13`
- Jersey Number: `7`
- Position: `Forward`
- Parents:
  - Parent 1: `parent1@gmail.com` (relation: `father`)
- Emergency Contact: `06 12 34 56 78`

**Joueur 2 - U13** :
- First Name: `Tom`
- Last Name: `Bernard`
- Birth Date: `2012-08-20`
- Team: `U13`
- Jersey Number: `12`
- Position: `Defense`
- Emergency Contact: `06 98 76 54 32`

**Joueur 3 - U15** :
- First Name: `Emma`
- Last Name: `Petit`
- Birth Date: `2010-03-10`
- Team: `U15`
- Jersey Number: `9`
- Position: `Forward`

**Joueur 4 - U15** :
- First Name: `Jules`
- Last Name: `Moreau`
- Birth Date: `2010-11-05`
- Team: `U15`
- Jersey Number: `15`
- Position: `Goalie`

**Joueur 5 - U17** :
- First Name: `Léa`
- Last Name: `Roux`
- Birth Date: `2008-07-22`
- Team: `U17`
- Jersey Number: `3`
- Position: `Defense`

**Joueur 6 - U17** :
- First Name: `Hugo`
- Last Name: `Simon`
- Birth Date: `2008-12-30`
- Team: `U17`
- Jersey Number: `18`
- Position: `Forward`

**Résultats attendus**:
- ✅ 6 joueurs créés avec succès
- ✅ Relation parent ↔ joueur fonctionnelle pour Lucas Dubois
- ✅ Photos optionnelles (peuvent être uploadées plus tard)

### Test 2.2 : Vérification des permissions (Coach U13)

**Action**: Se déconnecter et se reconnecter en tant que `coach.u13@jokers.fr`

**Naviguer vers Players**

**Résultats attendus**:
- ✅ Le coach voit UNIQUEMENT les 2 joueurs de l'équipe U13 (Lucas et Tom)
- ❌ Ne voit PAS les joueurs U15 et U17
- ✅ Peut éditer les joueurs U13
- ❌ Cannot access medical notes (admin-only field)

### Test 2.3 : Vérification des permissions (Parent 1)

**Action**: Se déconnecter et se reconnecter en tant que `parent1@gmail.com`

**Naviguer vers Players**

**Résultats attendus**:
- ✅ Le parent voit UNIQUEMENT Lucas Dubois (son enfant)
- ❌ Ne voit PAS les autres joueurs
- ✅ Peut voir les informations de son enfant
- ❌ Cannot edit player data
- ❌ Cannot access medical notes

### Test 2.4 : Medical Notes (Admin-only)

**Action**: Se reconnecter en tant qu'admin

**Éditer Lucas Dubois**:
- Ajouter dans Medical Notes: `Allergique aux arachides - Porte un EpiPen`

**Se reconnecter en tant que coach U13**:
- Vérifier que le champ Medical Notes n'est PAS visible

**Résultats attendus**:
- ✅ Admin peut ajouter/éditer medical notes
- ❌ Coach ne voit pas le champ medical notes
- ❌ Parent ne voit pas le champ medical notes

---

## 📸 PHASE 3 : Photos - Workflow d'Approbation

### Test 3.1 : Upload de photos (Parent)

**Action**: Se connecter en tant que `parent1@gmail.com`

**Uploader 2 photos**:
1. Photo 1:
   - Image: Choisir une image (ou utiliser placeholder)
   - Title: `Lucas - Match U13 contre Nice`
   - Description: `Beau but de Lucas !`
   - Category: `match`
   - Team: `U13`
   - Event Date: `2025-12-15`

2. Photo 2:
   - Image: Choisir une image
   - Title: `Entraînement U13 - Décembre`
   - Description: `Séance de tirs au but`
   - Category: `training`
   - Team: `U13`
   - Event Date: `2025-12-10`

**Résultats attendus**:
- ✅ 2 photos uploadées avec succès
- ✅ Status = `pending` (en attente d'approbation)
- ✅ Parent peut voir ses propres photos pending
- ❌ Photos NOT visible on public gallery (non approuvées)

### Test 3.2 : Vérification par Coach

**Action**: Se connecter en tant que `coach.u13@jokers.fr`

**Naviguer vers Photos**

**Résultats attendus**:
- ✅ Coach peut voir les 2 photos pending de son équipe
- ❌ Coach CANNOT approve/reject (admin-only action)

### Test 3.3 : Approbation Admin

**Action**: Se connecter en tant qu'admin

**Naviguer vers Photos**

**Approuver Photo 1**:
- Changer Approval Status de `pending` → `approved`

**Rejeter Photo 2**:
- Changer Approval Status de `pending` → `rejected`
- Ajouter Rejection Reason: `Image floue - merci de soumettre une photo de meilleure qualité`

**Résultats attendus**:
- ✅ Photo 1 status = `approved`
- ✅ Photo 2 status = `rejected` avec raison
- ✅ Photo 1 maintenant visible dans la galerie publique

### Test 3.4 : Vérification Parent après approbation

**Action**: Se reconnecter en tant que `parent1@gmail.com`

**Naviguer vers Photos**

**Résultats attendus**:
- ✅ Parent voit Photo 1 (approved) + Photo 2 (rejected)
- ✅ Parent voit le rejection reason pour Photo 2
- ✅ Parent peut uploader une nouvelle photo pour remplacer la rejetée

---

## 🏒 PHASE 4 : Teams et Matches

### Test 4.1 : Création des équipes

**Créer 8 équipes** (Admin):

1. **U7**
   - Name: `U7`
   - Category: `U7`
   - Training Schedule: `Mercredi 17h-18h, Samedi 10h-11h`
   - Coach: Assigner un coach si disponible
   - Venue: `Patinoire d'Aubagne`

2. **U9**
   - Name: `U9`
   - Category: `U9`
   - Training Schedule: `Mercredi 18h-19h, Samedi 11h-12h`

3. **U11**
   - Name: `U11`
   - Category: `U11`
   - Training Schedule: `Mardi 18h-19h30, Jeudi 18h-19h30`

4. **U13**
   - Name: `U13`
   - Category: `U13`
   - Coach: `coach.u13@jokers.fr`
   - Training Schedule: `Mardi 19h30-21h, Jeudi 19h30-21h`

5. **U15**
   - Name: `U15`
   - Category: `U15`
   - Coach: `coach.u15@jokers.fr`
   - Training Schedule: `Lundi 19h-20h30, Mercredi 19h-20h30`

6. **U17**
   - Name: `U17`
   - Category: `U17`
   - Training Schedule: `Lundi 20h30-22h, Mercredi 20h30-22h`

7. **N1** (Nationale 1)
   - Name: `Nationale 1`
   - Category: `N1`
   - Training Schedule: `Mardi-Jeudi 20h-22h, Vendredi 19h-21h`

8. **N4** (Nationale 4)
   - Name: `Nationale 4`
   - Category: `N4`
   - Training Schedule: `Lundi-Mercredi 20h-21h30`

**Résultats attendus**:
- ✅ 8 équipes créées
- ✅ Coaches assignés aux équipes U13 et U15
- ✅ Training schedules définis

### Test 4.2 : Création de stades externes

**Créer 3 stades** (Admin):

1. **Stade 1**:
   - Name: `Patinoire de Nice`
   - Address: `155 Route de Grenoble, 06200 Nice`
   - City: `Nice`
   - Postal Code: `06200`
   - Google Maps Link: `https://goo.gl/maps/example1`
   - Parking Info: `Parking gratuit disponible sur place`

2. **Stade 2**:
   - Name: `Patinoire de Marseille`
   - Address: `12 Rue de la Glace, 13008 Marseille`
   - City: `Marseille`
   - Postal Code: `13008`
   - Google Maps Link: `https://goo.gl/maps/example2`

3. **Stade 3**:
   - Name: `Patinoire d'Aix-en-Provence`
   - Address: `50 Avenue du Hockey, 13100 Aix-en-Provence`
   - City: `Aix-en-Provence`
   - Postal Code: `13100`

**Résultats attendus**:
- ✅ 3 stades externes créés
- ✅ Google Maps links fonctionnels

### Test 4.3 : Création de matchs

**Créer 4 matchs** (Admin):

**Match 1 - U13 Domicile**:
- Home Team: `U13`
- Opponent: `Nice Hockey U13`
- Date: `2025-12-28`
- Time: `14:00`
- Venue Type: `home`
- Status: `scheduled`

**Match 2 - U15 Extérieur**:
- Home Team: `U15`
- Opponent: `Marseille Ice U15`
- Date: `2026-01-05`
- Time: `16:00`
- Venue Type: `away`
- Stadium: `Patinoire de Marseille`
- Status: `scheduled`

**Match 3 - N1 Live**:
- Home Team: `Nationale 1`
- Opponent: `Aix Hockey N1`
- Date: `2025-12-22` (aujourd'hui)
- Time: `20:00`
- Venue Type: `away`
- Stadium: `Patinoire d'Aix-en-Provence`
- Status: `live`
- Home Score: `2`
- Away Score: `3`

**Match 4 - U17 Terminé**:
- Home Team: `U17`
- Opponent: `Toulon U17`
- Date: `2025-12-15`
- Time: `15:00`
- Venue Type: `home`
- Status: `completed`
- Home Score: `5`
- Away Score: `2`

**Résultats attendus**:
- ✅ 4 matchs créés
- ✅ Relationships home team ↔ match fonctionnels
- ✅ Relationships stadium ↔ match fonctionnels
- ✅ Live scores affichés pour match live
- ✅ Final scores affichés pour match completed

---

## 📹 PHASE 5 : Media - Upload et Resize

### Test 5.1 : Upload d'images avec resize automatique

**Action**: Se connecter en tant qu'admin

**Naviguer vers Media**

**Uploader 1 image** :
- Choisir une image haute résolution (>2MB si possible)
- Alt Text: `Logo Jokers Aubagne`

**Résultats attendus**:
- ✅ Image uploadée avec succès
- ✅ Sharp génère automatiquement 4 versions :
  - `thumbnail` (400x300)
  - `medium` (1024x768)
  - `large` (1920x1440)
  - `og` (1200x630 pour Open Graph)
- ✅ User relationship enregistre l'uploader
- ✅ Timestamp de création visible

### Test 5.2 : Utilisation de Media dans d'autres collections

**Éditer Player "Lucas Dubois"**:
- Photo: Sélectionner l'image uploadée depuis Media

**Résultats attendus**:
- ✅ Image sélectionnable depuis Media library
- ✅ Thumbnail preview visible dans le formulaire
- ✅ Relationship media ↔ player fonctionnel

---

## 🎬 PHASE 6 : Videos - YouTube Integration

### Test 6.1 : Ajout de vidéos YouTube

**Action**: Se connecter en tant qu'admin

**Créer 2 vidéos**:

**Vidéo 1**:
- Title: `Meilleurs buts U15 - Saison 2024-2025`
- YouTube ID: `dQw4w9WgXcQ` (exemple)
- Category: `highlights`
- Team: `U15`
- Published Date: `2025-12-20`

**Vidéo 2**:
- Title: `Interview Coach Jean Dupont`
- YouTube ID: `jNQXAC9IVRw` (exemple)
- Category: `interviews`
- Published Date: `2025-12-18`

**Résultats attendus**:
- ✅ 2 vidéos créées
- ✅ YouTube embeds fonctionnels
- ✅ Category filtering possible
- ✅ Team relationships fonctionnels

---

## 👔 PHASE 7 : Staff

### Test 7.1 : Création du staff

**Créer 5 membres du staff**:

**Staff 1 - Président**:
- First Name: `Jacques`
- Last Name: `Président`
- Role: `Président du club`
- Email: `president@jokers.fr`
- Phone: `06 11 22 33 44`
- Bio: `Président des Jokers depuis 2015`

**Staff 2 - Directeur Sportif**:
- First Name: `Claude`
- Last Name: `Sportif`
- Role: `Directeur Sportif`
- Email: `ds@jokers.fr`
- Teams: `N1`, `N4`

**Staff 3 - Entraîneur Gardiens**:
- First Name: `Michel`
- Last Name: `Goals`
- Role: `Entraîneur des gardiens`
- Teams: `U13`, `U15`, `U17`

**Staff 4 - Secrétaire**:
- First Name: `Sophie`
- Last Name: `Admin`
- Role: `Secrétaire`
- Email: `secretaire@jokers.fr`

**Staff 5 - Trésorier**:
- First Name: `Paul`
- Last Name: `Comptable`
- Role: `Trésorier`
- Email: `tresorier@jokers.fr`
- Phone: `06 99 88 77 66`

**Résultats attendus**:
- ✅ 5 membres du staff créés
- ✅ Team assignments fonctionnels
- ✅ Contact info visible

---

## 📧 PHASE 8 : Newsletter Subscriptions

### Test 8.1 : Ajout d'abonnés newsletter

**Créer 3 abonnements**:

**Abonné 1**:
- Email: `fan1@gmail.com`
- Subscribed At: `2025-12-20`

**Abonné 2**:
- Email: `fan2@yahoo.fr`
- Subscribed At: `2025-12-21`

**Abonné 3**:
- Email: `fan3@hotmail.com`
- Subscribed At: `2025-12-22`

**Désabonner fan2**:
- Éditer `fan2@yahoo.fr`
- Ajouter Unsubscribed At: `2025-12-22`

**Résultats attendus**:
- ✅ 3 abonnés créés
- ✅ Timestamp de subscription enregistré
- ✅ Unsubscribe tracking fonctionnel
- ✅ Statut actif/inactif visible

---

## 🔍 PHASE 9 : API REST - Vérification Endpoints

### Test 9.1 : Tester les endpoints API auto-générés

**Base URL**: http://localhost:5000/api

**Endpoints à tester** (avec Postman, curl, ou navigateur):

1. **GET /api/players** (public endpoint)
   - Devrait retourner la liste des joueurs
   - Filtré selon les permissions

2. **GET /api/teams** (public)
   - Devrait retourner les 8 équipes

3. **GET /api/matches?status=live** (public)
   - Devrait retourner uniquement les matchs en live

4. **GET /api/photos?approvalStatus=approved** (public)
   - Devrait retourner uniquement les photos approuvées

5. **POST /api/users/login** (authentication)
   ```json
   {
     "email": "admin@jokers.fr",
     "password": "Admin2025!SecurePass"
   }
   ```
   - Devrait retourner un JWT token

**Résultats attendus**:
- ✅ Tous les endpoints fonctionnels
- ✅ Filtering par query params fonctionne
- ✅ Authentication JWT fonctionne
- ✅ Permissions respectées sur les endpoints

---

## 📊 PHASE 10 : Dashboard et Rapports

### Test 10.1 : Vérifier les statistiques du dashboard

**Action**: Se connecter en tant qu'admin

**Naviguer vers Dashboard**

**Vérifier les informations suivantes**:
- Nombre total d'utilisateurs : 4 (1 admin + 2 coaches + 1 parent)
- Nombre total de joueurs : 6
- Nombre total d'équipes : 8
- Nombre total de matchs : 4
- Photos pending approval : 0 (toutes approuvées ou rejetées)
- Photos approved : 1
- Videos : 2
- Staff members : 5
- Newsletter subscribers (active) : 2 (fan1 et fan3)

**Résultats attendus**:
- ✅ Dashboard affiche les stats correctes
- ✅ Recent activity visible
- ✅ Quick actions disponibles

---

## 🎯 CHECKLIST FINALE

### Collections (10/10)
- ✅ Users - Authentication + Roles
- ✅ Teams - 8 équipes créées
- ✅ Players - 6 joueurs avec permissions complexes
- ✅ Matches - 4 matchs (scheduled, live, completed)
- ✅ Stadiums - 3 stades externes
- ✅ Media - Image upload avec resize
- ✅ Photos - Workflow d'approbation
- ✅ Videos - YouTube integration
- ✅ Staff - 5 membres du staff
- ✅ Newsletter - Gestion d'abonnements

### Fonctionnalités
- ✅ JWT Authentication (2h expiration)
- ✅ Role-based permissions (admin, coach, parent)
- ✅ Complex query permissions (parents see only their children)
- ✅ Field-level permissions (medical notes admin-only)
- ✅ Photo approval workflow (pending → approved/rejected)
- ✅ Image auto-resize avec Sharp (4 formats)
- ✅ API REST auto-générée (/api/*)
- ✅ Admin panel (/admin)
- ✅ Relationships fonctionnels entre collections

### Sécurité
- ✅ JWT tokens expiring after 2h
- ✅ Max login attempts: 5
- ✅ Lockout time: 10 minutes
- ✅ CSRF protection configured
- ✅ Admin-only fields protected (medical notes, approval status, role changes)

---

## 🐛 Bugs Potentiels à Surveiller

1. **Upload d'images** : Vérifier que Sharp fonctionne correctement sur Windows
2. **Permissions parents** : Vérifier que les parents voient UNIQUEMENT leurs enfants
3. **Coach team filter** : Vérifier que les coaches voient uniquement leur équipe
4. **Photo approval workflow** : Vérifier que les photos rejected ne sont pas publiques
5. **Medical notes** : Vérifier que seul l'admin peut voir ces champs sensibles
6. **JWT expiration** : Tester qu'après 2h le token expire et force la reconnexion

---

## 📞 Support

Si des bugs sont détectés pendant les tests :
1. Vérifier les logs serveur : `npm run dev` (console output)
2. Vérifier les logs Payload dans le terminal
3. Vérifier la console du navigateur (F12) pour les erreurs frontend
4. Vérifier que la DATABASE_URL est correcte dans `.env`

---

**Durée estimée des tests** : 2-3 heures pour l'ensemble du scénario

**Priorité** : Tester d'abord les permissions (PHASE 2 et 3) car c'est la feature la plus critique
