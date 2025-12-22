import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create seed-assets directories
const avatarsDir = path.join(__dirname, 'seed-assets', 'avatars')
const photosDir = path.join(__dirname, 'seed-assets', 'photos')

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true })
}
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true })
}

// Helper function to download avatar from UI Avatars API
async function downloadAvatar(firstName: string, lastName: string): Promise<string> {
  const fileName = `${firstName}-${lastName}.png`
  const filePath = path.join(avatarsDir, fileName)

  // Skip if already exists
  if (fs.existsSync(filePath)) {
    return filePath
  }

  const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName)}&size=400&background=random&color=fff&bold=true`

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const fileStream = fs.createWriteStream(filePath)
        response.pipe(fileStream)
        fileStream.on('finish', () => {
          fileStream.close()
          resolve(filePath)
        })
      })
      .on('error', reject)
  })
}

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Starting database seed...')

  // RESET COMPLET : Supprimer toutes les données existantes
  console.log('🗑️  Deleting all existing data...')

  const collections = [
    'newsletter-subscriptions',
    'staff',
    'videos',
    'photos',
    'media',
    'matches',
    'stadiums',
    'players',
    'teams',
    'users',
  ]

  for (const collectionSlug of collections) {
    try {
      const items = await payload.find({
        collection: collectionSlug as any,
        limit: 1000,
      })

      for (const item of items.docs) {
        await payload.delete({
          collection: collectionSlug as any,
          id: item.id,
        })
      }
      console.log(`  ✅ Deleted ${items.docs.length} items from ${collectionSlug}`)
    } catch (error: any) {
      console.log(`  ⚠️  Could not delete from ${collectionSlug}:`, error.message)
    }
  }

  console.log('✅ Database cleared!')
  console.log('🌱 Creating new seed data...\n')

  // 1. Create admin user
  console.log('Creating users...')
  const admin = await payload.create({
    collection: 'users',
    data: {
      email: 'admin@jokers.fr',
      password: 'Admin2025!',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'admin',
      phone: '+33 6 12 34 56 78',
    },
  })
  console.log('  ✅ Admin created')

  // 2. Create director
  const director = await payload.create({
    collection: 'users',
    data: {
      email: 'directeur@jokers.fr',
      password: 'Director2025!',
      firstName: 'Jacques',
      lastName: 'Directeur',
      role: 'director',
      phone: '+33 6 11 22 33 44',
    },
  })
  console.log('  ✅ Director created')

  // 3. Create secretary
  const secretary = await payload.create({
    collection: 'users',
    data: {
      email: 'secretaire@jokers.fr',
      password: 'Secretary2025!',
      firstName: 'Sophie',
      lastName: 'Administratif',
      role: 'secretary',
      phone: '+33 6 22 33 44 55',
    },
  })
  console.log('  ✅ Secretary created')

  // 4. Create photographer
  const photographer = await payload.create({
    collection: 'users',
    data: {
      email: 'photographe@jokers.fr',
      password: 'Photo2025!',
      firstName: 'Michel',
      lastName: 'Photo',
      role: 'photographer',
      phone: '+33 6 99 88 77 66',
    },
  })
  console.log('  ✅ Photographer created')

  // 5. Create 8 teams (U7-U17, N1-N4)
  console.log('\nCreating teams...')
  const teams = []
  const teamCategories = ['U7', 'U9', 'U11', 'U13', 'U15', 'U17', 'N1', 'N4']

  for (const category of teamCategories) {
    const team = await payload.create({
      collection: 'teams',
      data: {
        name: category,
        category,
        ageGroup: category.startsWith('U') ? 'youth' : 'senior',
        trainingSchedule: category.startsWith('U')
          ? {
              day1: 'Mercredi 18h-19h',
              day2: 'Samedi 10h-11h',
            }
          : {
              day1: 'Mardi 20h-22h',
              day2: 'Jeudi 20h-22h',
            },
        venue: "Patinoire d'Aubagne",
      },
    })
    teams.push(team)
  }
  console.log(`  ✅ ${teams.length} teams created`)

  // 6. Create coaches (1 per team)
  console.log('\nCreating coaches...')
  const coaches = []
  const coachFirstNames = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Luc', 'Anne', 'Marc', 'Julie']
  const coachLastNames = ['Dupont', 'Martin', 'Bernard', 'Petit', 'Robert', 'Richard', 'Durand', 'Moreau']

  for (let i = 0; i < teams.length; i++) {
    const coach = await payload.create({
      collection: 'users',
      data: {
        email: `coach.${teams[i].category.toLowerCase()}@jokers.fr`,
        password: 'Coach2025!',
        firstName: coachFirstNames[i],
        lastName: coachLastNames[i],
        role: 'coach',
        team: teams[i].id,
        phone: `+33 6 ${10 + i}0 00 00 00`,
      },
    })
    coaches.push(coach)
  }
  console.log(`  ✅ ${coaches.length} coaches created`)

  // 7. Create parents (5 parents)
  console.log('\nCreating parents...')
  const parents = []
  const parentFirstNames = ['Pierre', 'Marie', 'Luc', 'Anne', 'Paul']
  const parentLastNames = ['Dubois', 'Lambert', 'Fontaine', 'Leroy', 'Girard']

  for (let i = 0; i < 5; i++) {
    const parent = await payload.create({
      collection: 'users',
      data: {
        email: `parent${i + 1}@gmail.com`,
        password: 'Parent2025!',
        firstName: parentFirstNames[i],
        lastName: parentLastNames[i],
        role: 'parent',
        phone: `+33 6 ${20 + i}0 00 00 00`,
      },
    })
    parents.push(parent)
  }
  console.log(`  ✅ ${parents.length} parents created`)

  // 8. Create players (8 per team = 64 players)
  console.log('\nCreating players (this may take a moment)...')
  const players = []
  const firstNames = ['Lucas', 'Emma', 'Tom', 'Léa', 'Hugo', 'Chloé', 'Nathan', 'Manon', 'Théo', 'Sarah', 'Louis', 'Alice', 'Gabriel', 'Zoé', 'Arthur', 'Camille']
  const lastNames = ['Dubois', 'Lambert', 'Fontaine', 'Leroy', 'Girard', 'Moreau', 'Simon', 'Michel', 'Blanc', 'Garcia']

  for (let teamIdx = 0; teamIdx < teams.length; teamIdx++) {
    for (let playerIdx = 0; playerIdx < 8; playerIdx++) {
      const playerNumber = teamIdx * 8 + playerIdx
      const parentIdx = playerNumber % parents.length
      const firstName = firstNames[playerNumber % firstNames.length]
      const lastName = lastNames[playerNumber % lastNames.length]

      // Download and upload avatar
      console.log(`    Generating avatar for ${firstName} ${lastName}...`)
      const avatarPath = await downloadAvatar(firstName, lastName)

      const media = await payload.create({
        collection: 'media',
        data: {
          alt: `Photo de ${firstName} ${lastName}`,
        },
        filePath: avatarPath,
      })

      // Create player profile (NO user account)
      const player = await payload.create({
        collection: 'players',
        data: {
          firstName,
          lastName,
          birthDate: new Date(2008 + teamIdx, playerIdx, 15).toISOString(),
          team: teams[teamIdx].id,
          jerseyNumber: playerNumber + 1,
          position: ['forward', 'defense', 'goalie', 'forward', 'defense', 'forward', 'defense', 'goalie'][playerIdx],
          photo: media.id,
          parents: [
            {
              parent: parents[parentIdx].id,
              relationship: playerIdx % 2 === 0 ? 'father' : 'mother',
            },
          ],
          emergencyContact: {
            name: parents[parentIdx].firstName + ' ' + parents[parentIdx].lastName,
            phone: parents[parentIdx].phone,
            relationship: playerIdx % 2 === 0 ? 'father' : 'mother',
          },
          medicalNotes: playerIdx === 0 ? 'Allergique aux arachides - EpiPen disponible' : playerIdx === 3 ? 'Asthme - Ventoline nécessaire' : '',
        },
      })
      players.push(player)
    }
    console.log(`  ✅ Team ${teams[teamIdx].category}: 8 players created with avatars`)
  }
  console.log(`  ✅ Total: ${players.length} players created with AI-generated avatars`)

  // 9. Create stadiums (3 external venues)
  console.log('\nCreating stadiums...')
  const stadiums = []
  const venueData = [
    { name: 'Patinoire de Nice', city: 'Nice', postalCode: '06200', address: '155 Route de Grenoble, 06200 Nice' },
    { name: 'Patinoire de Marseille', city: 'Marseille', postalCode: '13008', address: '12 Rue de la Glace, 13008 Marseille' },
    { name: "Patinoire d'Aix", city: 'Aix-en-Provence', postalCode: '13100', address: '50 Avenue du Hockey, 13100 Aix' },
  ]

  for (const venue of venueData) {
    const stadium = await payload.create({
      collection: 'stadiums',
      data: venue,
    })
    stadiums.push(stadium)
  }
  console.log(`  ✅ ${stadiums.length} stadiums created`)

  // 10. Create matches (4 matches with different statuses)
  console.log('\nCreating matches...')
  const matchesData = [
    {
      opponent: 'Nice Hockey U13',
      date: new Date('2025-12-28T14:00:00').toISOString(),
      category: teams[3].id, // U13
      location: 'home' as const,
      venue: "Patinoire d'Aubagne",
      status: 'upcoming' as const,
    },
    {
      opponent: 'Marseille Ice U15',
      date: new Date('2026-01-05T16:00:00').toISOString(),
      category: teams[4].id, // U15
      location: 'away' as const,
      stadium: stadiums[1].id,
      status: 'upcoming' as const,
    },
    {
      opponent: 'Aix Hockey N1',
      date: new Date('2025-12-22T20:00:00').toISOString(),
      category: teams[6].id, // N1
      location: 'away' as const,
      stadium: stadiums[2].id,
      status: 'live' as const,
      isLive: true,
      scoreJokers: 2,
      scoreOpponent: 3,
    },
    {
      opponent: 'Toulon U17',
      date: new Date('2025-12-15T15:00:00').toISOString(),
      category: teams[5].id, // U17
      location: 'home' as const,
      venue: "Patinoire d'Aubagne",
      status: 'completed' as const,
      scoreJokers: 5,
      scoreOpponent: 2,
      summary: 'Belle victoire des U17 avec un triplé de Lucas Simon !',
    },
  ]

  for (const matchData of matchesData) {
    await payload.create({
      collection: 'matches',
      data: matchData,
    })
  }
  console.log(`  ✅ ${matchesData.length} matches created`)

  // 11. Create staff members
  console.log('\nCreating staff...')
  const staffMembers = [
    { name: 'Jacques Président', role: 'president', email: 'president@jokers.fr', phone: '+33 6 11 11 11 11' },
    { name: 'Claude Sportif', role: 'coach', email: 'ds@jokers.fr', phone: '+33 6 22 22 22 22' },
    { name: 'Paul Comptable', role: 'treasurer', email: 'tresorier@jokers.fr', phone: '+33 6 33 33 33 33' },
  ]

  for (const staffData of staffMembers) {
    await payload.create({
      collection: 'staff',
      data: staffData,
    })
  }
  console.log(`  ✅ ${staffMembers.length} staff members created`)

  // 12. Create newsletter subscriptions
  console.log('\nCreating newsletter subscriptions...')
  const subscribers = [
    { email: 'fan1@gmail.com', subscribed: true },
    { email: 'fan2@yahoo.fr', subscribed: true },
    { email: 'fan3@hotmail.com', subscribed: true },
  ]

  for (const subData of subscribers) {
    await payload.create({
      collection: 'newsletter-subscriptions',
      data: subData,
    })
  }
  console.log(`  ✅ ${subscribers.length} newsletter subscriptions created`)

  // 13. Upload test photos for approval workflow
  console.log('\nUploading test photos for approval workflow...')

  const matches = await payload.find({
    collection: 'matches',
    limit: 10,
  })

  const testPhotoFiles = [
    {
      file: 'match-u13-nice-1.jpg',
      uploader: parents[0],
      title: 'Match U13 contre Nice - Belle action',
      category: 'match',
      team: teams[3].id,
      match: matches.docs[0]?.id,
    },
    {
      file: 'match-u15-marseille-1.jpg',
      uploader: parents[1],
      title: 'Match U15 à Marseille - Victoire !',
      category: 'match',
      team: teams[4].id,
      match: matches.docs[1]?.id,
    },
    {
      file: 'match-n1-aix-1.jpg',
      uploader: photographer,
      title: 'Match N1 contre Aix - Photo officielle',
      category: 'match',
      team: teams[6].id,
      match: matches.docs[2]?.id,
    },
    {
      file: 'match-u17-toulon-1.jpg',
      uploader: parents[2],
      title: 'Match U17 - Photo floue (test rejet)',
      category: 'match',
      team: teams[5].id,
      match: matches.docs[3]?.id,
    },
  ]

  let uploadedPhotos = 0
  for (const photoData of testPhotoFiles) {
    const photoPath = path.join(photosDir, photoData.file)

    if (fs.existsSync(photoPath)) {
      try {
        // Upload to media
        const media = await payload.create({
          collection: 'media',
          data: {
            alt: photoData.title,
          },
          filePath: photoPath,
        })

        // Create photo entry
        await payload.create({
          collection: 'photos',
          data: {
            title: photoData.title,
            imageUrl: media.id,
            category: photoData.category,
            match: photoData.match,
            uploadedBy: photoData.uploader.id,
            // approvalStatus will be set by beforeChange hook
          },
        })
        uploadedPhotos++
        console.log(`  ✅ Uploaded ${photoData.file}`)
      } catch (error: any) {
        console.log(`  ❌ Failed to upload ${photoData.file}:`, error.message)
      }
    } else {
      console.log(`  ⚠️  ${photoData.file} not found - run 'npm run download-photos' first`)
    }
  }

  if (uploadedPhotos > 0) {
    console.log(`  ✅ ${uploadedPhotos} test photos uploaded`)
  } else {
    console.log(`  ℹ️  No test photos uploaded. Run 'npm run download-photos' to download them.`)
  }

  console.log('\n✅ Seed completed!')
  console.log('\n📊 Summary:')
  console.log(`  - 1 admin, 1 director, 1 secretary, 1 photographer`)
  console.log(`  - ${teams.length} teams`)
  console.log(`  - ${coaches.length} coaches`)
  console.log(`  - ${parents.length} parents`)
  console.log(`  - ${players.length} players with AI-generated avatars`)
  console.log(`  - ${stadiums.length} stadiums`)
  console.log(`  - ${matchesData.length} matches`)
  console.log(`  - ${staffMembers.length} staff members`)
  console.log(`  - ${subscribers.length} newsletter subscribers`)
  console.log(`  - ${uploadedPhotos} test photos for approval workflow`)
  console.log('')
  console.log('🔑 Test accounts created:')
  console.log('  - admin@jokers.fr / Admin2025!')
  console.log('  - directeur@jokers.fr / Director2025!')
  console.log('  - secretaire@jokers.fr / Secretary2025!')
  console.log('  - coach.u13@jokers.fr / Coach2025!')
  console.log('  - parent1@gmail.com / Parent2025!')
  console.log('  - photographe@jokers.fr / Photo2025!')
  console.log('')
  console.log('📸 Player Avatars:')
  console.log('  - 64 AI-generated avatars created from UI Avatars API')
  console.log('  - Each player has a unique avatar with their initials')
  console.log('')
  console.log('💡 Workflow Testing:')
  console.log('  - Parents can declare their children\'s availability for matches')
  console.log('  - Test photos uploaded for approval workflow')
  console.log('  - Photographer photos are auto-approved')
  console.log('  - Parent photos require admin approval')
  console.log('')
  if (uploadedPhotos === 0) {
    console.log('⚠️  To test the photo approval workflow:')
    console.log('  1. Run: npm run download-photos')
    console.log('  2. Run: npm run seed (again)')
  }

  process.exit(0)
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error)
  process.exit(1)
})
