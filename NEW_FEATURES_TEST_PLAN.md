# Plan de Tests - Nouvelles Fonctionnalités

**Features testées**:
1. PhotoReplacementField - Interface de remplacement de photos
2. LiveMatchTimeline - Système de match en direct

**Consolidé depuis les recommandations de**:
- OpenAI Codex (GPT-5.1)
- Google Gemini (2.5 Pro)

---

## A) Tests Fonctionnels

### 1. PhotoReplacementField

| ID | Scénario | Données de Test | Résultat Attendu |
|----|----------|-----------------|------------------|
| **A.1.1** | Affichage avatar par défaut | Joueur sans photo (firstName: "Lucas", lastName: "Dubois") | Avatar UI Avatars visible avec initials "LD", aucune erreur console |
| **A.1.2** | Affichage photo existante | Joueur avec photo uploadée | Photo actuelle affichée à gauche, pas de requête UI Avatars |
| **A.1.3** | Upload image valide | Fichier: `photo_joueur.jpg` (< 2MB), Type: `image/jpeg` | POST /api/media réussi, réponse 201, image affichée des deux côtés, barre de progression visible |
| **A.1.4** | Remplacer photo existante | Upload nouvelle image sur joueur avec photo | Nouvelle image remplace l'ancienne, ancienne URL non utilisée, cache vidé |
| **A.1.5** | Validation fichier invalide | Fichier: `document.pdf` ou fichier > 10MB | Upload refusé côté client/serveur, message d'erreur clair, aucune création média |
| **A.1.6** | Suppression photo | Clic sur "Supprimer la photo" | Photo supprimée, avatar UI Avatars réaffiché, relation media_id nullifiée |
| **A.1.7** | Joueur sans nom | Joueur créé sans firstName/lastName | Avatar générique affiché ou message "Aucune photo", pas de crash |

### 2. LiveMatchTimeline

| ID | Scénario | Données de Test | Résultat Attendu |
|----|----------|-----------------|------------------|
| **A.2.1** | Timeline vide | Match sans événements | Message "Aucun événement" affiché, pas d'erreurs, pas de polling error spam |
| **A.2.2** | Premier événement goal | Événement type `goal`, minute: 15, team: home, scoreAfter: {home: 1, away: 0} | Événement apparaît avec icône ⚽, couleur verte, score 1-0 affiché |
| **A.2.3** | Auto-refresh (30s) | Timeline ouverte, nouvel événement créé côté admin | Nouvel événement apparaît automatiquement après ≤30s, timestamp rafraîchi, pas de duplication |
| **A.2.4** | 11 types d'événements | Créer 1 événement de chaque type | Chaque type affiché avec icône et couleur distinctes (goal=⚽ vert, penalty=🟨 jaune, etc.) |
| **A.2.5** | Ordre chronologique | Événements à 5', 23', 12' | Affichage ordre inverse: 23' → 12' → 5' (plus récent en haut) |
| **A.2.6** | Score évolutif | 2 buts home, 1 but away | Score évolue: 1-0, 2-0, 2-1, chaque événement montre score au moment du but |
| **A.2.7** | Lecture publique | Utilisateur déconnecté accède à timeline | Événements visibles, aucune option création/modification affichée |
| **A.2.8** | Erreur réseau fetch | Simuler erreur 500 sur /api/match-events | Message non bloquant, prochain poll retente sans crash |

---

## B) Tests d'Intégration

| ID | Scénario | Données de Test | Résultat Attendu |
|----|----------|-----------------|------------------|
| **B.1.1** | Players + Media + Storage | Upload photo via PhotoReplacementField | Relation Players.photo_id mise à jour en base, GET fichier fonctionne, URL publique accessible |
| **B.1.2** | Photo joueur dans timeline | 1. Remplacer avatar joueur "Dupont"<br>2. Créer but pour "Dupont" | Timeline affiche la nouvelle photo uploadée, pas l'avatar par défaut |
| **B.1.3** | Joueur supprimé | 1. Joueur "Martin" marque<br>2. Supprimer joueur "Martin" | Timeline ne crash pas, affiche fallback gracieux ("Joueur supprimé", pas de photo) |
| **B.1.4** | Timeline + Permissions + Cache | Coach crée événements, consultation anonyme | Ordre chronologique cohérent, pas de filtrage selon rôle, no-cache headers respectés |
| **B.1.5** | Concurrence uploads | Deux uploads simultanés sur même joueur | Dernière requête gagne, pas d'état corrompu, UI reflète image finale |
| **B.1.6** | Concurrence événements | Deux coachs ajoutent événements quasi-simultanés | Timeline montre les deux, ordonnés par horodatage serveur, aucun drop/duplication |

---

## C) Tests de Performance

| ID | Scénario | Métrique | Seuil Accepté | Résultat Attendu |
|----|----------|----------|---------------|------------------|
| **C.1.1** | Auto-refresh prolongé | Timeline ouverte 10 min (20 polls) | Heap stable, pas de fuite mémoire | Temps réponse moyen stable, pas de ralentissement UI |
| **C.1.2** | Latence upload | Upload fichier 5MB sur 4G moyenne | < 10 secondes | UI reste responsive, indicateur de chargement visible |
| **C.1.3** | Timeline avec 100+ événements | Match avec 200 événements | Rendu initial < 2s, scroll fluide | Liste fluide, pagination/virtualisation si prévue, temps fetch acceptable |
| **C.1.4** | Poll backoff | Latence élevée ou échecs répétés | Intervalle 30s respecté | Pas de spam serveur, pas de boucles serrées |
| **C.1.5** | Charge concurrente | 50 utilisateurs consultent timeline simultanément | API répond < 500ms, charge BDD faible | Service reste disponible, pas de dégradation |
| **C.1.6** | Requêtes légères | Monitoring onglet Network pendant 10 min | Requêtes périodiques < 50KB si pas de nouveaux événements | Pas de fuite mémoire ou ralentissement navigateur |

---

## D) Tests de Sécurité

| ID | Scénario | Attaque/Validation | Résultat Attendu |
|----|----------|---------------------|------------------|
| **D.1.1** | Permissions création événements | Rôle public/joueur POST /api/match-events | 403/401, aucune création |
| **D.1.2** | Permissions création (coach) | Rôle coach POST /api/match-events | 201 Created, événement créé |
| **D.1.3** | Permissions upload | Utilisateur non autorisé upload photo | 403/401, aucun fichier stocké |
| **D.1.4** | Lecture événements publique | GET /api/match-events sans auth | 200 OK, liste des événements renvoyée |
| **D.1.5** | Validation payload events | Données invalides: type inconnu, timestamp futur, description longue | 400 validation error, aucune insertion |
| **D.1.6** | Injection XSS timeline | Description: `<img src=x onerror=alert(1)>` | Contenu rendu échappé, script jamais exécuté |
| **D.1.7** | Injection XSS joueur | Nom joueur: `<script>alert('XSS')</script>` | Avatar UI Avatars encode nom, script jamais exécuté dans admin |
| **D.1.8** | Path traversal upload | Nom fichier: `../../../etc/passwd.jpg` | Rejet ou normalisation, fichier stocké dans emplacement prévu uniquement |
| **D.1.9** | Rate limiting | Répétition rapide uploads ou POST events non autorisés | Throttling activé, service reste disponible |
| **D.1.10** | CSRF protection | Requête POST sans token CSRF | 403 Forbidden, requête rejetée |

---

## E) Edge Cases Critiques

| ID | Scénario | Condition | Résultat Attendu |
|----|----------|-----------|------------------|
| **E.1.1** | Perte connexion upload | Débrancher réseau mid-transfer | Échec propre, pas de ressource partielle, UI état neutre, retry possible |
| **E.1.2** | Fichier corrompu | Upload image corrompue ou 0 octet | Rejet côté serveur, message clair |
| **E.1.3** | Changement de match | Basculer entre matches différents rapidement | Poll s'annule/repart sur bon match, pas de mélange d'événements |
| **E.1.4** | Horodatages décalés | Événement avec timezone différente | Affichage normalisé (UTC/local défini), ordre correct |
| **E.1.5** | Upload série rapide | 3 uploads consécutifs avant fin du précédent | Queue ou cancellation explicite, état final cohérent |
| **E.1.6** | Media supprimé | Image supprimée de collection Media centrale | PhotoReplacementField revient à avatar par défaut |
| **E.1.7** | Erreur réseau timeline | Connexion réseau instable pendant refresh | Erreur gérée silencieusement, petite icône d'avertissement, pas de crash |

---

## F) Tests d'Utilisabilité (UX)

### 1. Admin - PhotoReplacementField

**Tâche**: Admin doit remplacer l'avatar d'un joueur

**Questions**:
- Interface intuitive?
- Zone de drop claire?
- Feedback (chargement, succès, erreur) immédiat et compréhensible?
- Prévisualisation en temps réel?

### 2. Admin - Création d'événement

**Tâche**: Coach doit ajouter 3 événements rapidement pendant un match

**Questions**:
- Formulaire rapide d'accès et d'utilisation?
- Sélecteur type d'événement efficace (dropdown, boutons)?
- Champs pré-remplis intelligemment?

### 3. Visiteur - LiveMatchTimeline (Mobile)

**Tâche**: Fan consulte page match sur mobile

**Questions**:
- Timeline lisible sur petit écran (responsive)?
- Icônes et couleurs compréhensibles sans légende?
- Score toujours visible?
- Auto-refresh fonctionne sur mobile?

### 4. Visiteur - Compréhension du live

**Tâche**: Visiteur arrive au milieu du match

**Questions**:
- Comprend rapidement l'état du match (score, derniers événements)?
- Indicateur "Live" clair?
- Navigation dans l'historique intuitive?

---

## G) Points d'Attention Particuliers

### PhotoReplacementField
1. **Gestion cache navigateur**: S'assurer que la nouvelle image s'affiche immédiatement (cache-busting)
2. **Fallback UI Avatars**: Si API UI Avatars down, prévoir avatar générique local
3. **Optimisation images**: Compression automatique côté serveur?
4. **Preview avant upload**: Montrer aperçu avant envoi au serveur
5. **Undo/Redo**: Possibilité d'annuler un remplacement accidentel?

### LiveMatchTimeline
1. **Fuseaux horaires**: Stockage UTC, affichage local user
2. **WebSocket vs Polling**: Envisager WebSocket pour vrais temps réel (< 30s)?
3. **Notification nouveaux événements**: Sound/vibration optionnels?
4. **Export timeline**: Possibilité d'exporter match recap?
5. **Accessibilité (a11y)**: Screen readers, keyboard navigation
6. **Mode hors-ligne**: Que se passe-t-il si connexion perdue longtemps?

---

## H) Checklist Pré-Production

Avant déploiement en production, vérifier:

- [ ] Tous les tests A-E passés avec succès
- [ ] Tests de charge réussis (50+ utilisateurs simultanés)
- [ ] Logs d'erreur configurés et monitored
- [ ] Rate limiting activé sur /api/media et /api/match-events
- [ ] HTTPS activé, certificats valides
- [ ] Backups base de données configurés
- [ ] Monitoring performance (temps réponse API)
- [ ] Analytics configurés (Google Analytics, Plausible, etc.)
- [ ] Documentation admin créée
- [ ] Formation utilisateurs prévue (coachs, admins)

---

## I) Outils de Test Recommandés

### Tests Manuels
- **Browser DevTools**: Network, Performance, Console
- **Postman/Insomnia**: Tests API manuels
- **BrowserStack**: Tests multi-navigateurs/devices

### Tests Automatisés
- **Jest + React Testing Library**: Tests unitaires composants
- **Playwright/Cypress**: Tests E2E
- **k6 ou Artillery**: Tests de charge
- **OWASP ZAP**: Scan sécurité automatisé

### Monitoring Production
- **Sentry**: Error tracking
- **New Relic/Datadog**: APM (Application Performance Monitoring)
- **LogRocket**: Session replay

---

## Résumé des Tests

| Catégorie | Nombre de Tests | Criticité |
|-----------|-----------------|-----------|
| Fonctionnels (A) | 15 | Haute |
| Intégration (B) | 6 | Haute |
| Performance (C) | 6 | Moyenne |
| Sécurité (D) | 10 | Haute |
| Edge Cases (E) | 7 | Moyenne |
| UX (F) | 4 | Moyenne |
| **TOTAL** | **48 tests** | - |

---

**Date de création**: 2025-12-22
**Dernière mise à jour**: 2025-12-22
**Status**: Prêt pour exécution

**Contributeurs**:
- OpenAI Codex (GPT-5.1 Codex Max) - Perspective technique
- Google Gemini 2.5 Pro - Perspective UX et sécurité
- Claude Sonnet 4.5 - Consolidation et structuration
