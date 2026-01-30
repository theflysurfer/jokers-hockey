/**
 * Script pour insérer les matchs WhatsApp extraits dans la base de données
 * Exécution: tsx scripts/seed-whatsapp-matches.ts
 */

import "dotenv/config";
import { db } from "../server/db.js";
import { matches } from "../shared/schema.js";

const whatsappMatches = [
  {
    date: new Date("2026-02-08T14:00:00"), // Heure estimée
    opponent: "St Bonnet",
    location: "away",
    venue: "St Bonnet",
    status: "upcoming",
    category: "U15",
  },
  {
    date: new Date("2026-02-14T18:00:00"),
    opponent: "La Teste",
    location: "away", // À confirmer
    venue: "À confirmer",
    status: "upcoming",
    category: "Adultes - N1",
  },
  {
    date: new Date("2026-02-14T20:00:00"),
    opponent: "Ajaccio",
    location: "away", // À confirmer
    venue: "À confirmer",
    status: "upcoming",
    category: "Adultes - N3",
  },
  {
    date: new Date("2026-02-15T13:00:00"),
    opponent: "Bordeaux",
    location: "home",
    venue: "GYMNASE DU CHARREL",
    status: "upcoming",
    category: "Adultes - N1",
  },
  {
    date: new Date("2026-03-28T15:00:00"),
    opponent: "Tournoi U15 Toulouse",
    location: "away",
    venue: "Toulouse",
    status: "upcoming",
    category: "U15",
  },
];

async function main() {
  console.log("🚀 Insertion des matchs WhatsApp...\n");

  try {
    for (const match of whatsappMatches) {
      await db.insert(matches).values(match);
      console.log(`✅ Match inséré: ${match.date.toLocaleDateString("fr-FR")} - ${match.opponent}`);
    }

    console.log(`\n✨ ${whatsappMatches.length} matchs insérés avec succès!`);
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion:", error);
    process.exit(1);
  }
}

main();
