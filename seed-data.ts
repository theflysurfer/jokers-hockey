import { db } from './server/db';
import { matches, photos, videos } from './shared/schema';

async function seedData() {
  console.log('🌱 Starting database seeding...');

  try {
    // Ajouter les matchs
    const matchesToAdd = [
      {
        date: new Date('2025-12-13T19:00:00'),
        opponent: 'Valence',
        location: 'home',
        venue: 'Gymnase du Charrel, Aubagne',
        status: 'upcoming',
        category: 'N1',
        scoreJokers: null,
        scoreOpponent: null,
      },
      {
        date: new Date('2025-11-22T20:00:00'),
        opponent: 'Montpellier',
        location: 'home',
        venue: 'Gymnase du Charrel, Aubagne',
        status: 'completed',
        category: 'N3',
        scoreJokers: 3,
        scoreOpponent: 5,
      },
      {
        date: new Date('2025-11-15T19:30:00'),
        opponent: 'Aix-en-Provence',
        location: 'away',
        venue: 'Aix-en-Provence',
        status: 'completed',
        category: 'N1',
        scoreJokers: null,
        scoreOpponent: null,
      },
    ];

    for (const match of matchesToAdd) {
      await db.insert(matches).values(match);
      console.log(`✅ Match ajouté: ${match.opponent} (${match.date.toLocaleDateString()})`);
    }

    console.log('✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seedData()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });
