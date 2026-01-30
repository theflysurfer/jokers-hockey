/**
 * Script pour insérer les annonces WhatsApp extraites dans la base de données
 * Exécution: tsx scripts/seed-whatsapp-announcements.ts
 */

import { db } from "../server/db.js";
import { announcements } from "../shared/schema.js";

const whatsappAnnouncements = [
  {
    title: "Reprise des entraînements dans le gymnase",
    content: `# 📍 Info Club

Ça y est !! C'est sûr !! C'est officiel !!

**Reprise des entraînements DANS le gymnase dès ce mardi 27/01** 🏒⚡🎉

## Horaires École de patinage
- **Vendredi**: 17h15
- **Samedi**: 13h - 14h`,
    category: "École de patinage",
    isPublished: true,
  },
  {
    title: "Planning entraînements janvier (extérieur)",
    content: `# Planning entraînements - Samedis 10, 17 & 24 janvier

## Horaires

- **13h - 14h**: École de Patinage + adultes débutants (roller & protections)
- **14h - 15h**: U7 à U11 - Exercices physiques et renforcement musculaire
  _(tenue de sport, baskets, gourde)_
- **15h - 16h**: U13 à U17 - Exercices physiques et renforcement musculaire
  _(tenue de sport, baskets, gourde)_

## Lieu
École élémentaire Nelson Mandela - Cour fermée
RDV 5 min avant l'activité au portail (arrière de l'école)

## Équipement
- Tenue chaude adaptée
- Eau en suffisance (pas de point d'eau)
- Accès à 1 WC en cas d'urgence`,
    category: "École de patinage",
    isPublished: true,
  },
  {
    title: "Annulation entraînements - Météo",
    content: `# 📍 Info Club

Bonsoir, au vu des conditions météo vent + pluie, **les sessions d'entraînement de demain sont annulées**.

À samedi 24 pour la dernière session en extérieur.

Bonne soirée`,
    category: "General",
    isPublished: true,
  },
  {
    title: "Tournoi U15 Toulouse - 28-29 mars",
    content: `# Tournoi U15 Toulouse - 28-29 mars

Les Hocklines de Toulouse organisent un tournoi U15 le week-end du **28–29 mars**.

## Équipes confirmées
- Toulouse
- 2 équipes espagnoles
- 2 places restantes

## Horaires des matchs
- **Samedi**: 15h - 19h
- **Dimanche**: 9h - 16h

## Organisation
- Départ le samedi matin
- Une nuit sur place
- Retour le dimanche soir
- Frais de transport et logement à évaluer

C'est une belle opportunité pour nos U15 de rencontrer de nouvelles équipes et de se préparer aux quarts de finale en avril !

**Let's go Joker, lâche rien, tu iras loin !** 🏒

_Sondage: 9 disponibles / 3 absents_`,
    category: "U15",
    isPublished: true,
  },
  {
    title: "Opportunité avant 1/4 finale France",
    content: `# Top opportunité U15

**Top opportunité** pour les joueuses et joueurs de l'équipe U15 d'aller se confronter à des équipes plus aguerris avant les **1/4 de finale France** !!

**Let's Go Jokers !!**

En route pour l'Occitanie (cetes ça fait loin en roller 😁)`,
    category: "U15",
    isPublished: true,
  },
  {
    title: "Stage Février - U10 à U17",
    content: `# 📍 Info club

Le club organise de nouveau le **stage de Février du 23 au 27 Février**.

## Détails
- **Horaires**: 8h30 - 17h30
- **Tarif**: 150€/participant
- **Public**: Priorité aux licenciés du club de U10 au U17

_Sondage: 3 participants / 1 absent_`,
    category: "General",
    isPublished: true,
  },
  {
    title: "Journée U15 à St Bonnet - 08/02",
    content: `# Prochaine journée U15 à St Bonnet

**Date**: Dimanche 08/02

Merci d'avance pour vos réponses

_Sondage: 6 disponibles / 3 absents_

## Horaires d'entraînement U15 RHA
- **Mercredi**: 19h - 20h30
- **Samedi**: 15h30 - 16h45`,
    category: "U15",
    isPublished: true,
  },
  {
    title: "Training Aix - Mercredi 21/01",
    content: `# Session Training Aix

**Date**: Mercredi 21/01
**RDV**: 18h15 au plus tard au gymnase d'Aix
**Démarrage**: 18h30

📍 [Voir l'emplacement](https://maps.app.goo.gl/SfR8ibpwkoqdbkyR6)`,
    category: "U15",
    isPublished: true,
  },
  {
    title: "Match à domicile: Aubagne vs Bordeaux",
    content: `# AUBAGNE vs BORDEAUX

**Date**: 15.02.2026
**Heure**: 13H
**Lieu**: GYMNASE DU CHARREL
**ENTRÉE GRATUITE** 🏒

Venez nombreux supporter nos Jokers !`,
    category: "Adultes",
    isPublished: true,
  },
];

async function main() {
  console.log("🚀 Insertion des annonces WhatsApp...\n");

  try {
    for (const announcement of whatsappAnnouncements) {
      await db.insert(announcements).values(announcement);
      console.log(`✅ Annonce insérée: ${announcement.title}`);
    }

    console.log(`\n✨ ${whatsappAnnouncements.length} annonces insérées avec succès!`);
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion:", error);
    process.exit(1);
  }
}

main();
