import { getPayload } from 'payload'
import config from '../payload.config'
import { storage } from './storage'

const migrateData = async () => {
  const payload = await getPayload({ config })

  console.log('🚀 Starting data migration to Payload CMS...\n')

  try {
    // 1. Migrate Matches
    console.log('📅 Migrating matches...')
    const matches = await storage.getAllMatches()
    let matchesCount = 0
    for (const match of matches) {
      try {
        // Note: category field is now a relationship to teams, will be null until teams are created
        await payload.create({
          collection: 'matches',
          data: {
            date: new Date(match.date),
            opponent: match.opponent,
            location: match.location,
            venue: match.venue || '',
            status: match.status, // 'upcoming', 'completed', 'cancelled' are valid
            scoreJokers: match.scoreJokers || undefined,
            scoreOpponent: match.scoreOpponent || undefined,
            // category: null - will be set manually later (now a relationship to teams)
          },
        })
        matchesCount++
      } catch (error) {
        console.error(`   ⚠️  Failed to migrate match: ${match.opponent}`, error)
      }
    }
    console.log(`   ✅ Migrated ${matchesCount}/${matches.length} matches`)
    console.log(`   ⚠️  Note: Match categories not migrated (now relationship to teams)\n`)

    // 2. Migrate Photos
    console.log('📸 Migrating photos...')
    console.log('   ⚠️  SKIPPED - Photos.imageUrl is now a relationship to media collection')
    console.log('   ℹ️  Photos must be re-uploaded through Payload admin or migrated manually')
    console.log('   ℹ️  Old photo URLs are in Drizzle table for reference\n')

    // 3. Migrate Videos
    console.log('🎥 Migrating videos...')
    const videos = await storage.getAllVideos()
    let videosCount = 0
    for (const video of videos) {
      try {
        await payload.create({
          collection: 'videos',
          data: {
            title: video.title,
            youtubeId: video.youtubeId,
            category: video.category || 'general',
            match: video.matchId || undefined,
          },
        })
        videosCount++
      } catch (error) {
        console.error(`   ⚠️  Failed to migrate video: ${video.title}`, error)
      }
    }
    console.log(`   ✅ Migrated ${videosCount}/${videos.length} videos\n`)

    // 4. Migrate Staff
    console.log('👥 Migrating staff members...')
    const staffMembers = await storage.getAllStaff()
    let staffCount = 0
    for (const staff of staffMembers) {
      try {
        await payload.create({
          collection: 'staff',
          data: {
            name: staff.name,
            role: staff.role,
            category: staff.category || 'general',
            photoUrl: staff.photoUrl || '',
            bio: staff.bio || '',
            order: staff.order || 0,
          },
        })
        staffCount++
      } catch (error) {
        console.error(`   ⚠️  Failed to migrate staff: ${staff.name}`, error)
      }
    }
    console.log(`   ✅ Migrated ${staffCount}/${staffMembers.length} staff members\n`)

    // 5. Migrate Newsletter Subscriptions
    console.log('📧 Migrating newsletter subscriptions...')
    const newsletters = await storage.getAllSubscribers()
    let newslettersCount = 0
    for (const newsletter of newsletters) {
      try {
        await payload.create({
          collection: 'newsletter-subscriptions',
          data: {
            email: newsletter.email,
            active: newsletter.active,
          },
        })
        newslettersCount++
      } catch (error) {
        console.error(`   ⚠️  Failed to migrate newsletter: ${newsletter.email}`, error)
      }
    }
    console.log(`   ✅ Migrated ${newslettersCount}/${newsletters.length} newsletter subscriptions\n`)

    console.log('🎉 Migration complete!')
    console.log('\n📊 Summary:')
    console.log(`   Matches: ${matchesCount}/${matches.length} (categories not migrated - now relationships)`)
    console.log(`   Photos: SKIPPED (imageUrl now requires media uploads)`)
    console.log(`   Videos: ${videosCount}/${videos.length}`)
    console.log(`   Staff: ${staffCount}/${staffMembers.length}`)
    console.log(`   Newsletters: ${newslettersCount}/${newsletters.length}`)
    console.log('\n⚠️  Notes:')
    console.log('   • Announcements API kept separate (Phase 1 MVP)')
    console.log('   • Match categories must be set manually (now relationship to teams)')
    console.log('   • Photos must be re-uploaded through Payload admin')
    console.log('\n📋 Next Steps:')
    console.log('   1. Create Teams in Payload admin')
    console.log('   2. Update matches with correct team relationships')
    console.log('   3. Re-upload photos through Payload admin')

    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrateData().catch(console.error)
