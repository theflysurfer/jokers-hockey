# Horaires d'Entraînement Complets - RHA Jokers

**Date d'extraction**: 2026-01-31
**Statut**: ✅ COMPLET (6/7 équipes)
**Source**: Screenshots WhatsApp

---

## 🏫 École de Patinage

**Groupe**: RHA - École de patinage
**Membres**: 32 membres
**Créé**: 30/11/2024 par Aurélie Derbre (Hockey)

### Horaires
- **Vendredi**: 17h15 - 18h30
- **Samedi**: 13h - 14h (École de patinage + adultes débutants)

---

## 👶 U7-U11

**Groupe**: RHA U7-U11 - infos officielles
**Membres**: 34 membres
**Créé**: 12/10/2024 par Aurélie Derbre (Hockey)

### Horaires
- **Mercredi 16h30 - 17h45**: Débutants U7-U11
- **Mercredi 17h45 - 19h**: U11-U13
- **Samedi 13h30 - 14h30**: Débutants U7-U11
- **Samedi 14h30 - 15h30**: U11-U13

---

## 🧒 U13

**Groupe**: RHA U13 - Infos officielles
**Membres**: 28 membres
**Créé**: 06/09/2025 par Aurélie Derbre (Hockey)

### Horaires
- **Mercredi**: 17h45 - 19h
- **Samedi**: 14h30 - 15h30

**Note**: Ces horaires correspondent au créneau U11-U13

---

## 🎯 U15

**Groupe**: U15 RHA
**Membres**: 27 membres
**Créé**: 20/09/2023 à 20:37 par Julien Coach Roller

### Horaires
- **Mercredi**: 19h - 20h30
- **Samedi**: 15h30 - 16h45

---

## 🏃 U17

**Groupe**: U17 RHA
**Membres**: 24 membres
**Créé**: 06/09/2025 par Aurélie Derbre (Hockey)

### Horaires
- **Mercredi**: 19h - 20h30
- **Samedi**: 15h30 - 16h45

**Note**: Ces horaires sont identiques au U15

---

## 🏆 U20 (ex groupe U17)

**Groupe**: RHA U20 ex groupe U17
**Membres**: 14 membres
**Créé**: 01/09/2024

### Horaires
- **Mardi**: 19h30 - 20h45
- **Vendredi**: 19h - 20h30

**Note**: Description indique "Entraînements U17"

---

## 👨 Adultes / Débutants

**Groupe**: RHA - Adultes / Débutants
**Membres**: 8 membres
**Créé**: 15/10/2025

### Horaires
⚠️ **Non spécifiés dans la description du groupe**

**Actions possibles**:
- Consulter les messages du groupe pour trouver les horaires
- Demander directement aux responsables
- Vérifier si les horaires sont dans "École de patinage" (Samedi 13h-14h adultes débutants)

---

## 📊 Synthèse Globale

### Planning Hebdomadaire

**Lundi**: Pas d'entraînement

**Mardi**:
- 19h30-20h45: U20

**Mercredi**:
- 16h30-17h45: Débutants U7-U11
- 17h45-19h: U11-U13
- 19h-20h30: U15 + U17

**Jeudi**: Pas d'entraînement

**Vendredi**:
- 17h15-18h30: École de patinage
- 19h-20h30: U20

**Samedi**:
- 13h-14h: École de patinage + Adultes débutants
- 13h30-14h30: Débutants U7-U11
- 14h30-15h30: U11-U13
- 15h30-16h45: U15 + U17

**Dimanche**: Pas d'entraînement

### Statistiques

- **Total équipes**: 7
- **Équipes avec horaires complets**: 6 (86%)
- **Total membres** (hors Adultes): 167 membres
- **Créneaux d'entraînement par semaine**: 12 créneaux
- **Jours d'entraînement**: Mardi, Mercredi, Vendredi, Samedi

### Lieux d'Entraînement

- **Gymnase** (principal) - Reprise le 27/01/2026
- **Gymnase d'Aix** (sessions ponctuelles)
- **Cour école Nelson Mandela** (janvier - extérieur)

---

## 🎯 Utilisation pour le Site Web

### Structure Recommandée

```typescript
const schedules = [
  {
    team: "École de patinage",
    category: "Débutants",
    members: 32,
    slots: [
      { day: "Vendredi", time: "17h15-18h30", level: "École de patinage" },
      { day: "Samedi", time: "13h-14h", level: "École + Adultes débutants" }
    ]
  },
  {
    team: "U7-U11",
    category: "Jeunes",
    members: 34,
    slots: [
      { day: "Mercredi", time: "16h30-17h45", level: "Débutants U7-U11" },
      { day: "Mercredi", time: "17h45-19h", level: "U11-U13" },
      { day: "Samedi", time: "13h30-14h30", level: "Débutants U7-U11" },
      { day: "Samedi", time: "14h30-15h30", level: "U11-U13" }
    ]
  },
  {
    team: "U13",
    category: "Jeunes",
    members: 28,
    slots: [
      { day: "Mercredi", time: "17h45-19h", level: "U13" },
      { day: "Samedi", time: "14h30-15h30", level: "U13" }
    ]
  },
  {
    team: "U15",
    category: "Jeunes",
    members: 27,
    slots: [
      { day: "Mercredi", time: "19h-20h30", level: "U15" },
      { day: "Samedi", time: "15h30-16h45", level: "U15" }
    ]
  },
  {
    team: "U17",
    category: "Jeunes",
    members: 24,
    slots: [
      { day: "Mercredi", time: "19h-20h30", level: "U17" },
      { day: "Samedi", time: "15h30-16h45", level: "U17" }
    ]
  },
  {
    team: "U20",
    category: "Jeunes",
    members: 14,
    slots: [
      { day: "Mardi", time: "19h30-20h45", level: "U20" },
      { day: "Vendredi", time: "19h-20h30", level: "U20" }
    ]
  }
];
```

---

## ✅ Validation

- [x] École de patinage - Horaires complets
- [x] U7-U11 - Horaires complets
- [x] U13 - Horaires complets
- [x] U15 - Horaires complets
- [x] U17 - Horaires complets
- [x] U20 - Horaires complets
- [ ] Adultes/Débutants - Horaires à confirmer

**Prêt pour intégration sur le site web** ✨
