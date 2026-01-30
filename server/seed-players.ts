import 'dotenv/config';
import { db } from './db';
import { teams, players, users } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Noms et prénoms français pour générer des joueurs réalistes
const prenoms = {
  garcons: ['Lucas', 'Hugo', 'Louis', 'Nathan', 'Ethan', 'Tom', 'Léo', 'Mathis', 'Arthur', 'Noah', 'Jules', 'Gabriel', 'Adam', 'Théo', 'Maxime', 'Raphael', 'Antoine', 'Paul', 'Baptiste', 'Victor'],
  filles: ['Emma', 'Léa', 'Chloé', 'Manon', 'Sarah', 'Lola', 'Zoé', 'Clara', 'Camille', 'Jade', 'Lisa', 'Louise', 'Nina', 'Inès', 'Lucie', 'Eva', 'Marine', 'Charlotte', 'Laura', 'Julie']
};

const noms = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'Andre', 'Mercier', 'Dupont'];

// Configuration par équipe
const teamsConfig = {
  'U7-U11': { count: 12, ageRange: [6, 10] },
  'U13': { count: 10, ageRange: [11, 12] },
  'U15': { count: 10, ageRange: [13, 14] },
  'U17': { count: 10, ageRange: [15, 16] },
  'U20': { count: 8, ageRange: [17, 19] },
  'École de patinage': { count: 15, ageRange: [4, 8] },
  'Adultes': { count: 12, ageRange: [20, 45] }
};

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBirthDate(ageMin: number, ageMax: number): Date {
  const age = randomInt(ageMin, ageMax);
  const year = new Date().getFullYear() - age;
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  return new Date(year, month - 1, day);
}

async function seedPlayers() {
  console.log('🏒 Seeding players...\n');

  // Récupérer toutes les équipes
  const allTeams = await db.select().from(teams);

  // Récupérer les parents pour associer aux joueurs jeunes
  const parents = await db.select().from(users).where(eq(users.role, 'parent'));

  let totalPlayers = 0;

  for (const team of allTeams) {
    const config = teamsConfig[team.name as keyof typeof teamsConfig];
    if (!config) {
      console.log(`⏭️  Skip: ${team.name} (no config)`);
      continue;
    }

    console.log(`\n📋 Team: ${team.name} (${config.count} players)`);

    for (let i = 0; i < config.count; i++) {
      const isAdult = team.name === 'Adultes';
      const isFemale = Math.random() > 0.7; // 30% de filles

      const prenom = randomChoice(isFemale ? prenoms.filles : prenoms.garcons);
      const nom = randomChoice(noms);
      const fullName = `${prenom} ${nom}`;
      const birthDate = generateBirthDate(config.ageRange[0], config.ageRange[1]);
      const jerseyNumber = randomInt(1, 99);

      // Pour les jeunes, associer à un parent
      let parentInfo = null;
      if (!isAdult && parents.length > 0) {
        const parent = randomChoice(parents);
        parentInfo = {
          parentName: parent.fullName || parent.username,
          parentEmail: parent.email,
          parentPhone: parent.phone
        };
      }

      try {
        const [player] = await db.insert(players).values({
          teamId: team.id,
          fullName,
          jerseyNumber,
          birthDate,
          parentName: parentInfo?.parentName || null,
          parentEmail: parentInfo?.parentEmail || null,
          parentPhone: parentInfo?.parentPhone || null,
          active: true,
        }).returning();

        console.log(`  ✅ ${fullName} (#${jerseyNumber}) - ${birthDate.getFullYear()}`);
        totalPlayers++;
      } catch (error: any) {
        console.error(`  ❌ Error creating ${fullName}:`, error.message);
      }
    }
  }

  console.log(`\n✨ Seeded ${totalPlayers} players across ${allTeams.length} teams!`);
  process.exit(0);
}

seedPlayers().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
