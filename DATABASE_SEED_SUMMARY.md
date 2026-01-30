# Base de données - Résumé du seeding

**Date:** 2026-01-30
**Environnement:** Production (jokers_prod)

---

## 👥 Utilisateurs (16)

### Par rôle

| Rôle | Nombre | Détails |
|------|--------|---------|
| Admin | 1 | Marc Durand |
| Director | 1 | Sophie Martin |
| Secretary | 1 | Julie Bernard |
| Treasurer | 1 | Pierre Lefebvre |
| Coach | 3 | Thomas Rousseau, Marie Petit, Lucas Moreau |
| Photographer | 1 | Camille Simon |
| Parent | 6 | Laurent Garcia, Nathalie Lopez, François Blanc, Isabelle Faure, Olivier Dumont, Sandrine Bonnet |

**Total: 16 utilisateurs** avec authentification fonctionnelle

---

## 🏒 Équipes (7)

| Équipe | Catégorie | Joueurs |
|--------|-----------|---------|
| U7-U11 | youth | 12 |
| U13 | youth | 10 |
| U15 | youth | 10 |
| U17 | youth | 10 |
| U20 | youth | 8 |
| École de patinage | youth | 15 |
| Adultes | adult | 12 |

**Total: 7 équipes**

---

## ⛸️ Joueurs (77)

### Répartition par équipe

```
École de patinage: 15 joueurs (4-8 ans)
U7-U11:           12 joueurs (6-10 ans)
Adultes:          12 joueurs (20-45 ans)
U13:              10 joueurs (11-12 ans)
U15:              10 joueurs (13-14 ans)
U17:              10 joueurs (15-16 ans)
U20:               8 joueurs (17-19 ans)
```

### Caractéristiques

**Noms français réalistes:**
- Prénoms: Lucas, Emma, Hugo, Léa, Nathan, Chloé, etc.
- Noms: Martin, Bernard, Dubois, Thomas, etc.
- Mix garçons/filles (~70%/30%)

**Informations complètes:**
- Nom complet
- Numéro de maillot (1-99)
- Date de naissance (cohérente avec l'équipe)
- Association parent pour joueurs jeunes

### Exemples de joueurs

**U7-U11:**
- Baptiste David (#86, 2016) - Parent: Olivier Dumont
- Théo Martin (#14, 2019) - Parent: Laurent Garcia
- Inès Richard (#49, 2020) - Parent: Nathalie Lopez

**U13:**
- Noah Dupont (#76, 2014)
- Chloé Thomas (#59, 2014)
- Maxime Durand (#74, 2014)

**Adultes:**
- Victor Richard (#39, 1982)
- Charlotte Thomas (#48, 1998)
- Nathan Dupont (#19, 2003)

---

## 📊 Statistiques globales

| Table | Enregistrements | Status |
|-------|-----------------|--------|
| **users** | 16 | ✅ Complet |
| **teams** | 7 | ✅ Complet |
| **players** | 77 | ✅ Complet |
| **matches** | 0 | ⏳ À venir |
| **match_inscriptions** | 0 | ⏳ Phase 2 |
| **announcements** | 0 | ⏳ À venir |
| **photos** | 0 | ⏳ À venir |
| **videos** | 0 | ⏳ À venir |
| **staff** | 0 | ⏳ À venir |
| **newsletters** | 0 | ⏳ À venir |

---

## 🔗 Relations

### Parents ↔ Joueurs

Les 6 parents sont associés aux joueurs jeunes:
- Laurent Garcia → 2 joueurs
- Nathalie Lopez → ~3 joueurs
- François Blanc → ~3 joueurs
- Isabelle Faure → ~2 joueurs
- Olivier Dumont → ~4 joueurs
- Sandrine Bonnet → ~2 joueurs

**Note:** Les joueurs adultes n'ont pas de parent associé.

### Équipes ↔ Joueurs

Chaque joueur est lié à une équipe via `team_id`.

---

## 🎯 Prêt pour Phase 2

La base de données est maintenant complètement préparée pour:

1. **Match Inscriptions**
   - 77 joueurs disponibles
   - 7 équipes configurées
   - Parents prêts à inscrire leurs enfants

2. **Gestion des effectifs**
   - Vue coach: liste complète des joueurs par équipe
   - Vue parent: liste des enfants associés
   - Statistiques par équipe

3. **Calendrier et résultats**
   - Matchs par équipe
   - Inscriptions par match
   - Suivi de présence

---

## 🚀 Commandes de seed

### Utilisateurs
```bash
NODE_ENV=production npx tsx server/seed-users.ts
```

### Joueurs
```bash
NODE_ENV=production npx tsx server/seed-players.ts
```

### Vérification
```sql
-- Compter les joueurs par équipe
SELECT t.name, COUNT(p.id) as nb_joueurs
FROM teams t
LEFT JOIN players p ON p.team_id = t.id
GROUP BY t.name
ORDER BY t.name;

-- Joueurs avec parents
SELECT p.full_name, t.name as equipe, p.parent_name
FROM players p
JOIN teams t ON p.team_id = t.id
WHERE p.parent_name IS NOT NULL;
```

---

## ✅ Validation

- ✅ 16 utilisateurs créés et testés
- ✅ 7 équipes seedées
- ✅ 77 joueurs générés avec données réalistes
- ✅ Relations parent-joueur établies
- ✅ Base de données prête pour Phase 2

**Dernière mise à jour:** 2026-01-30 12:45
**Environnement:** Production ✅
