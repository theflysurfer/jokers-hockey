# Testing Guide - Jokers Hockey Payload CMS

## Quick Start

### 1. Setup Database

```bash
# Push schema to database
npm run db:push
```

### 2. Download Test Photos (Optional)

```bash
# Download 8 test photos from Unsplash for photo approval workflow testing
npm run download-photos
```

This will create `server/seed-assets/photos/` with:
- match-u13-nice-1.jpg
- match-u15-marseille-1.jpg
- match-n1-aix-1.jpg
- match-u17-toulon-1.jpg
- match-u13-entrainement-1.jpg
- event-noel-1.jpg
- event-tournoi-1.jpg
- event-ceremonie-1.jpg

### 3. Seed Database

```bash
# Populate database with complete test data
npm run seed
```

This creates:
- **17 users** (1 admin, 1 director, 1 secretary, 1 photographer, 8 coaches, 5 parents)
- **8 teams** (U7, U9, U11, U13, U15, U17, N1, N4)
- **64 players** with AI-generated avatars (8 per team)
- **3 stadiums** (external venues)
- **4 matches** (upcoming, live, completed)
- **3 staff members** (president, coach, treasurer)
- **3 newsletter subscriptions**
- **Test photos** for approval workflow (if downloaded)

### 4. Start Server

```bash
# Start development server
npm run dev
```

Server runs on: http://localhost:5000

### 5. Access Admin Panel

Navigate to: http://localhost:5000/admin

Login with test accounts (see below)

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jokers.fr | Admin2025! |
| Director | directeur@jokers.fr | Director2025! |
| Secretary | secretaire@jokers.fr | Secretary2025! |
| Photographer | photographe@jokers.fr | Photo2025! |
| Coach U13 | coach.u13@jokers.fr | Coach2025! |
| Coach U15 | coach.u15@jokers.fr | Coach2025! |
| Parent | parent1@gmail.com | Parent2025! |

---

## What Gets Created

### Users (17 total)

**Administrative Roles**:
- 1 Admin (full access)
- 1 Director (reads medical notes, manages players)
- 1 Secretary (manages newsletter, schedules)
- 1 Photographer (uploads auto-approved photos)

**Team Management**:
- 8 Coaches (one per team: U7, U9, U11, U13, U15, U17, N1, N4)
  - Each coach can only see/manage their own team

**Parents**:
- 5 Parents (each linked to multiple children)
  - Can only see their own children's information
  - Can declare child's availability for matches

### Players (64 total)

**8 players per team** with:
- AI-generated avatar (from UI Avatars API)
- Unique first name + last name combination
- Birth date (age-appropriate for team category)
- Jersey number (1-64)
- Position (forward, defense, goalie)
- Parent relationship (linked to parent accounts)
- Emergency contact information
- Medical notes (some players have allergies/asthma notes - admin-only field)

**Examples**:
- U7 Team: Lucas Dubois, Emma Lambert, Tom Fontaine, Léa Leroy, etc.
- U13 Team: Théo Girard, Sarah Moreau, Louis Simon, Alice Michel, etc.

### Teams (8 total)

**Youth Teams**:
- U7 (7 ans et moins)
- U9 (9 ans et moins)
- U11 (11 ans et moins)
- U13 (13 ans et moins)
- U15 (15 ans et moins)
- U17 (17 ans et moins)

**Senior Teams**:
- N1 (National 1)
- N4 (National 4)

Each team has:
- Training schedule (2 days per week)
- Venue (Patinoire d'Aubagne)
- Assigned coach

### Matches (4 total)

| Match | Date | Status | Details |
|-------|------|--------|---------|
| U13 contre Nice | 28 déc 2025 14h | `upcoming` | Home game |
| U15 à Marseille | 5 jan 2026 16h | `upcoming` | Away game at Patinoire de Marseille |
| N1 contre Aix | 22 déc 2025 20h | `live` | Live match, score 2-3 |
| U17 vs Toulon | 15 déc 2025 15h | `completed` | Completed, score 5-2, with summary |

### Stadiums (3 external venues)

- Patinoire de Nice (06200 Nice)
- Patinoire de Marseille (13008 Marseille)
- Patinoire d'Aix (13100 Aix-en-Provence)

### Staff (3 members)

- Jacques Président (President)
- Claude Sportif (Coach / Directeur Sportif)
- Paul Comptable (Treasurer)

---

## AI-Generated Avatars

Each of the 64 players has a unique avatar generated using the **UI Avatars API**.

**Features**:
- Generated from player's first name + last name initials
- 400x400px PNG images
- Random background colors
- Bold white text

**Example**:
- Lucas Dubois → Avatar with "LD" initials
- Emma Lambert → Avatar with "EL" initials

**Storage**:
- Downloaded to: `server/seed-assets/avatars/`
- Uploaded to Payload Media collection
- Linked to player profiles via `photo` field
- `.gitignore` excludes `server/seed-assets/` (not committed)

---

## Photo Approval Workflow

If you ran `npm run download-photos` before seeding, 4 test photos are uploaded:

### Photos Created

1. **match-u13-nice-1.jpg**
   - Uploader: Parent1
   - Status: `pending` (awaiting admin approval)
   - Match: U13 contre Nice

2. **match-u15-marseille-1.jpg**
   - Uploader: Parent2
   - Status: `pending`
   - Match: U15 à Marseille

3. **match-n1-aix-1.jpg**
   - Uploader: Photographer
   - Status: `approved` (auto-approved via hook)
   - Match: N1 contre Aix

4. **match-u17-toulon-1.jpg**
   - Uploader: Parent3
   - Status: `pending`
   - Match: U17 vs Toulon
   - Note: Intentionally named "Photo floue" for rejection testing

### Workflow Testing

**As Parent**:
- Upload photo → Status automatically set to `pending`
- Photo not visible on public site until approved

**As Photographer**:
- Upload photo → Status automatically set to `approved` (via beforeChange hook)
- Photo immediately visible on public site

**As Admin**:
- View all pending photos
- Approve or reject with reason
- Rejection reason visible to uploader

---

## Player Availability System

Parents can declare their children's presence for matches.

### How It Works

1. **Parent declares availability**:
   - Login as Parent1 (parent1@gmail.com)
   - Open a match (e.g., "U13 contre Nice")
   - Add Player Availability for their child
   - Select status: Available / Unavailable / Maybe
   - Add notes (optional)

2. **Automatic tracking**:
   - `declaredBy` field auto-set to parent's user ID
   - `declaredAt` timestamp auto-set to current time

3. **Validation**:
   - beforeChange hook ensures parents can ONLY declare for their own children
   - Attempting to declare for another child → Error: "Vous ne pouvez déclarer la présence que pour vos propres enfants"

4. **Coach view**:
   - Coaches see all availability declarations for their team
   - Can add/modify availabilities (e.g., surclassement - calling up players from younger teams)

---

## Testing Scenarios

Complete testing guide: **[WORKFLOW_TEST_SCENARIOS.md](./WORKFLOW_TEST_SCENARIOS.md)**

### Key Tests

1. **Role-Based Permissions**:
   - Admin sees all 64 players
   - Coach U13 sees only 8 U13 players
   - Parent1 sees only their own children

2. **Field-Level Permissions**:
   - Medical notes visible to Admin/Director only
   - Coach and Parents cannot see medical notes

3. **Photo Approval**:
   - Parent upload → pending status
   - Photographer upload → approved status (auto)
   - Admin approval/rejection with reasons

4. **Player Availability**:
   - Parent declares for own child → success
   - Parent tries to declare for other child → error
   - Coach sees all declarations

5. **Surclassement**:
   - Coach N1 can call up a U17 player for a match
   - Cross-team player selection allowed for coaches

---

## Resetting Data

To reset and re-seed the database:

```bash
# This will DELETE ALL DATA and recreate seed data
npm run seed
```

**Warning**: This deletes:
- All users (except those created by seed)
- All players, teams, matches
- All photos, videos, media
- All staff, newsletter subscriptions

---

## Troubleshooting

### Avatars not generated

**Cause**: UI Avatars API unreachable or rate limited

**Solution**:
- Check internet connection
- Wait 1 minute and retry: `npm run seed`
- API has rate limits - seed creates 64 avatars (may take 2-3 minutes)

### Test photos not uploaded

**Cause**: Photos not downloaded before seeding

**Solution**:
```bash
npm run download-photos
npm run seed
```

### "Sharp not installed" warning

**Status**: This is just a warning, not an error

**Impact**: Image resizing will be slower (uses fallback method)

**Optional fix**: Install sharp for faster processing:
```bash
npm install sharp
```

### Permission errors in tests

**Cause**: Wrong user role or missing permissions

**Solution**:
- Verify you're logged in with correct account
- Check WORKFLOW_TEST_SCENARIOS.md for expected permissions per role
- Some fields are hidden based on role (e.g., medical notes)

---

## Next Steps

1. **Complete Testing**: Follow [WORKFLOW_TEST_SCENARIOS.md](./WORKFLOW_TEST_SCENARIOS.md)
2. **Frontend Integration**: Build React components to display players, teams, matches
3. **API Exploration**: Test REST API endpoints (http://localhost:5000/api/players, etc.)
4. **Customize**: Modify collections, add fields, adjust permissions
5. **Deploy**: Push to production and run seed on production database

---

## API Endpoints

Base URL: http://localhost:5000

### Public Endpoints (No Auth Required)

- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get team details
- `GET /api/staff` - List staff members
- `GET /api/matches` - List matches
- `GET /api/stadiums` - List stadiums
- `GET /api/photos?where[approvalStatus][equals]=approved` - List approved photos
- `POST /api/newsletter-subscriptions` - Subscribe to newsletter

### Authenticated Endpoints

- `GET /api/players` - List players (filtered by role permissions)
- `POST /api/players` - Create player (admin/coach only)
- `PUT /api/players/:id` - Update player
- `GET /api/users` - List users (admin only)
- `POST /api/photos` - Upload photo (requires auth)

### Admin Endpoints

- `GET /api/photos?where[approvalStatus][equals]=pending` - List pending photos
- `PUT /api/photos/:id` - Approve/reject photo
- Full CRUD on all collections

---

## File Structure

```
server/
├── seed.ts                   # Main seed script
├── download-test-photos.ts   # Photo download script
└── seed-assets/              # Generated assets (gitignored)
    ├── avatars/              # 64 AI-generated player avatars
    └── photos/               # 8 test photos from Unsplash

collections/
├── Users.ts                  # 7 roles with permissions
├── Players.ts                # Complex permission system
├── Teams.ts                  # Public read access
├── Matches.ts                # Player availability system
├── Photos.ts                 # Approval workflow with hooks
├── Videos.ts                 # YouTube integration
├── Staff.ts                  # Public staff directory
├── Stadiums.ts               # External venues
├── Media.ts                  # Image uploads
└── NewsletterSubscriptions.ts # Newsletter management

WORKFLOW_TEST_SCENARIOS.md    # Complete testing guide (30+ tests)
TESTING_GUIDE.md              # This file
ADMIN_TEST_SCENARIO.md        # Initial admin testing scenarios
```

---

## Resources

- **Payload CMS Docs**: https://payloadcms.com/docs
- **UI Avatars API**: https://ui-avatars.com/
- **Unsplash Source**: https://source.unsplash.com/
- **Database (Neon)**: https://console.neon.tech/

---

## Support

Issues or questions? Check:
1. Server logs: Look at terminal running `npm run dev`
2. Browser console: Open DevTools → Console
3. Payload admin logs: Check admin panel for error messages
4. Database: Use Neon console to inspect data directly
