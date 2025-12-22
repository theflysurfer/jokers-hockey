# Workflow Test Scenarios - Jokers Hockey Payload CMS

Complete testing scenarios for all Payload CMS collections, permissions, and workflows.

## Prerequisites

Before starting tests, ensure:
- ✅ Server running: `npm run dev` (localhost:5000)
- ✅ Database seeded: `npm run seed` completed successfully
- ✅ Test photos downloaded: `npm run download-photos` (optional but recommended)

## Test Accounts

Use these accounts created by the seed script:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jokers.fr | Admin2025! |
| Director | directeur@jokers.fr | Director2025! |
| Secretary | secretaire@jokers.fr | Secretary2025! |
| Coach U13 | coach.u13@jokers.fr | Coach2025! |
| Parent | parent1@gmail.com | Parent2025! |
| Photographer | photographe@jokers.fr | Photo2025! |

---

## 1. Workflow: Authentication & Role-Based Access

### Test 1.1: Login with Different Roles

**Objective**: Verify that all 7 roles can authenticate successfully

**Steps**:
1. Navigate to http://localhost:5000/admin
2. Login with each account from the table above
3. Verify successful authentication

**Expected Results**:
- [ ] Admin login successful → Dashboard displayed
- [ ] Director login successful → Dashboard displayed
- [ ] Secretary login successful → Dashboard displayed
- [ ] Coach login successful → Dashboard displayed
- [ ] Parent login successful → Dashboard displayed
- [ ] Photographer login successful → Dashboard displayed

**Verifications**:
- [ ] Each role sees appropriate sidebar menu items
- [ ] JWT token set in browser cookies (check DevTools → Application → Cookies)
- [ ] No authentication errors in console

---

## 2. Workflow: Players Collection (Complex Permissions)

### Test 2.1: Admin Sees All Players

**As**: Admin (admin@jokers.fr)

**Steps**:
1. Login as admin
2. Navigate to Players collection
3. Count total players displayed

**Expected Results**:
- [ ] See all 64 players in the list
- [ ] Can filter by team (U7, U9, U11, U13, U15, U17, N1, N4)
- [ ] Each player has an AI-generated avatar visible
- [ ] Can click any player to view/edit details

### Test 2.2: Coach Sees Only Their Team

**As**: Coach U13 (coach.u13@jokers.fr)

**Steps**:
1. Login as Coach U13
2. Navigate to Players collection
3. Count players displayed

**Expected Results**:
- [ ] See ONLY 8 players (U13 team members)
- [ ] Cannot see players from other teams (U7, U9, U11, U15, U17, N1, N4)
- [ ] Can edit U13 player information (firstName, lastName, jerseyNumber, position)
- [ ] Can view emergency contacts
- [ ] **CANNOT** see medical notes field (should be hidden)

**Verification**: Try to access a player from another team directly via URL - should get permission error

### Test 2.3: Parent Sees Only Their Children

**As**: Parent1 (parent1@gmail.com)

**Steps**:
1. Login as Parent1
2. Navigate to Players collection
3. Count players displayed

**Expected Results**:
- [ ] See ONLY players where Parent1 is listed in the `parents` array
- [ ] Cannot see other families' children
- [ ] Can view basic information about their children
- [ ] Can update basic info (with field-level restrictions)
- [ ] **CANNOT** see medical notes field

**Verification**:
- [ ] Check that only children linked to Parent1 are visible
- [ ] Attempt to access another player's detail page → should fail

### Test 2.4: Medical Notes (Admin/Director Only)

**As**: Admin (admin@jokers.fr)

**Steps**:
1. Login as admin
2. Open a player with medical notes (first player of U7 team has allergy note)
3. Scroll to "Medical Notes" field

**Expected Results**:
- [ ] Medical Notes field is VISIBLE
- [ ] Can see content: "Allergique aux arachides - EpiPen disponible"
- [ ] Can edit the medical notes

**As**: Coach U13 (coach.u13@jokers.fr)

**Steps**:
1. Login as Coach U13
2. Open the same player (if visible to coach)

**Expected Results**:
- [ ] Medical Notes field is HIDDEN (field-level permission)
- [ ] Cannot see sensitive medical information

**As**: Parent1 (parent1@gmail.com)

**Steps**:
1. Login as Parent1
2. Open their own child's player profile

**Expected Results**:
- [ ] Medical Notes field is HIDDEN
- [ ] Parent cannot see or edit medical notes (even for their own child)

**Security Check**:
- [ ] Try to send a direct API request to update medical notes as Coach → should fail
- [ ] Try to send a direct API request to read medical notes as Parent → should fail

---

## 3. Workflow: Photos (Approval System)

### Test 3.1: Parent Upload → Pending Status

**As**: Parent1 (parent1@gmail.com)

**Steps**:
1. Login as Parent1
2. Navigate to Photos collection
3. Click "Create New"
4. Fill in:
   - Title: "Superbe but de Lucas !"
   - Category: Match
   - Match: Select "Match U13 contre Nice (28 déc 2025)"
   - Upload image: Use any test image (or match-u13-nice-1.jpg if downloaded)
5. Save

**Expected Results**:
- [ ] Photo created successfully
- [ ] Approval Status automatically set to `pending`
- [ ] uploadedBy field automatically set to Parent1
- [ ] Photo appears in Parent1's photo list with status "Pending"
- [ ] Photo is NOT visible on public website (not approved)

**Verification**:
- [ ] Check Photos API: `GET /api/photos?where[approvalStatus][equals]=pending`
- [ ] Verify photo exists with correct metadata

### Test 3.2: Photographer Upload → Auto-Approved

**As**: Photographer (photographe@jokers.fr)

**Steps**:
1. Login as Photographer
2. Navigate to Photos collection
3. Click "Create New"
4. Fill in:
   - Title: "Action N1 contre Aix - Photo officielle"
   - Category: Match
   - Match: Select "Match N1 contre Aix (live)"
   - Upload image: Use match-n1-aix-1.jpg if available
5. Save

**Expected Results**:
- [ ] Photo created successfully
- [ ] Approval Status **automatically set to `approved`** (auto-approved via beforeChange hook)
- [ ] uploadedBy field set to Photographer
- [ ] Photo immediately visible on public website

**Verification**:
- [ ] beforeChange hook executed successfully (check console logs)
- [ ] Photo status is `approved` without manual admin intervention
- [ ] Check API: `GET /api/photos?where[approvalStatus][equals]=approved`

### Test 3.3: Admin Approves Pending Photo

**As**: Admin (admin@jokers.fr)

**Steps**:
1. Login as Admin
2. Navigate to Photos collection
3. Filter by Approval Status: `pending`
4. Find the photo uploaded by Parent1 in Test 3.1
5. Open the photo
6. Change Approval Status to `approved`
7. Save

**Expected Results**:
- [ ] Status updated to `approved`
- [ ] Photo now visible on public website
- [ ] Rejection Reason field not required (should be empty)

**Verification**:
- [ ] Photo appears in approved photos list
- [ ] Public API includes this photo: `GET /api/photos?where[approvalStatus][equals]=approved`

### Test 3.4: Admin Rejects Photo with Reason

**As**: Admin (admin@jokers.fr)

**Steps**:
1. Login as Admin
2. Navigate to Photos collection
3. Find a pending photo (or upload a new one as Parent)
4. Open the photo
5. Change Approval Status to `rejected`
6. Add Rejection Reason: "Image floue, merci de soumettre une meilleure qualité"
7. Save

**Expected Results**:
- [ ] Status updated to `rejected`
- [ ] Rejection Reason saved
- [ ] Photo NOT visible on public website
- [ ] Rejection reason stored in database

**As**: Parent (uploader of the rejected photo)

**Steps**:
1. Login as the parent who uploaded the photo
2. Navigate to Photos collection
3. Find the rejected photo

**Expected Results**:
- [ ] Parent can see their rejected photo in the list
- [ ] Can see rejection reason: "Image floue, merci de soumettre une meilleure qualité"
- [ ] Can edit and re-submit the photo
- [ ] Upon re-save, status resets to `pending` (ready for re-review)

---

## 4. Workflow: Player Availability (Matches)

### Test 4.1: Parent Declares Child's Presence

**As**: Parent1 (parent1@gmail.com)

**Steps**:
1. Login as Parent1
2. Navigate to Matches collection
3. Open match: "U13 contre Nice (28 déc 2025)"
4. Scroll to "Player Availability" section
5. Click "Add Item"
6. Select:
   - Player: Parent1's child (e.g., Lucas Dubois)
   - Status: `available` (Présent)
   - Notes: "Sera là à 13h45"
7. Save

**Expected Results**:
- [ ] Availability entry created successfully
- [ ] `declaredBy` field automatically set to Parent1 (via hook)
- [ ] `declaredAt` timestamp set to current time (via hook)
- [ ] Notes saved: "Sera là à 13h45"
- [ ] Entry visible in Player Availability list

**Verification**:
- [ ] Check Match API response includes playerAvailability array
- [ ] Verify declaredBy references Parent1's user ID
- [ ] Verify declaredAt is a valid ISO timestamp

### Test 4.2: Parent Cannot Declare for Another Child (Security)

**As**: Parent1 (parent1@gmail.com)

**Steps**:
1. Login as Parent1
2. Open the same match: "U13 contre Nice"
3. Try to add Player Availability for a player who is NOT Parent1's child
4. Select:
   - Player: Any player NOT linked to Parent1 (e.g., Emma Lambert)
   - Status: `available`
5. Attempt to save

**Expected Results**:
- [ ] **ERROR**: "Vous ne pouvez déclarer la présence que pour vos propres enfants"
- [ ] beforeChange hook blocks the operation
- [ ] No availability entry created
- [ ] Database remains unchanged

**Verification**:
- [ ] Hook validation executed before database write
- [ ] Error message displayed to user
- [ ] Check server logs for validation error

### Test 4.3: Coach Sees All Availabilities

**As**: Coach U13 (coach.u13@jokers.fr)

**Steps**:
1. Login as Coach U13
2. Navigate to Matches collection
3. Open match: "U13 contre Nice"
4. View Player Availability section

**Expected Results**:
- [ ] See all player availability declarations for this match
- [ ] See which players are available/unavailable/maybe
- [ ] See who declared (parent names)
- [ ] See declaration timestamps
- [ ] Can add new availability entries (coach override)
- [ ] Can modify existing entries

**Verification**:
- [ ] All U13 players' availabilities visible
- [ ] Coach can declare availability for any player (surclassement allowed)

### Test 4.4: Surclassement (Cross-Category Player Selection)

**As**: Coach N1 (coach.n1@jokers.fr)

**Steps**:
1. Login as Coach N1
2. Open match: "N1 contre Aix (live)"
3. Add Player Availability for:
   - Player: Select a U17 player (surclassé player)
   - Status: `available`
   - Notes: "Surclassé pour renforcer l'équipe"
4. Save

**Expected Results**:
- [ ] Availability created successfully
- [ ] Coach can select players from other teams (surclassement allowed)
- [ ] Notes explain the surclassement: "Surclassé pour renforcer l'équipe"
- [ ] `declaredBy` set to Coach N1

**Verification**:
- [ ] Surclassement works across age categories (U17 → N1)
- [ ] No validation error when coach selects player from another team
- [ ] Match now shows U17 player in N1 match availability

---

## 5. Workflow: Teams

### Test 5.1: Public Read Access

**As**: Unauthenticated user (no login)

**Steps**:
1. Open browser in incognito mode
2. Navigate to http://localhost:5000/api/teams
3. View the API response

**Expected Results**:
- [ ] Can read all 8 teams (U7, U9, U11, U13, U15, U17, N1, N4)
- [ ] See team details: category, ageGroup, trainingSchedule, venue
- [ ] Public access works (no authentication required)

### Test 5.2: Admin Can Modify Teams

**As**: Admin (admin@jokers.fr)

**Steps**:
1. Login as Admin
2. Navigate to Teams collection
3. Open team: "U13"
4. Modify:
   - Training Schedule Day 1: "Mercredi 18h30-19h30" (change time)
   - Color: "#FF5733" (change color)
5. Save

**Expected Results**:
- [ ] Team updated successfully
- [ ] Changes reflected in database
- [ ] Updated training schedule visible
- [ ] New color saved

**As**: Coach U13 (coach.u13@jokers.fr)

**Steps**:
1. Login as Coach U13
2. Try to edit team "U13"

**Expected Results**:
- [ ] **Cannot edit** team (no update permission)
- [ ] Can only READ team information
- [ ] Edit button disabled or save fails with permission error

---

## 6. Workflow: Matches

### Test 6.1: Match Statuses

**Verify the 4 seed matches have correct statuses**:

1. Navigate to Matches collection
2. Check each match:

| Match | Date | Status | Expected Behavior |
|-------|------|--------|-------------------|
| U13 contre Nice | 28 déc 2025 | `upcoming` | Future match, no scores |
| U15 à Marseille | 5 jan 2026 | `upcoming` | Future match, away game |
| N1 contre Aix | 22 déc 2025 20h | `live` | isLive=true, scores displayed (2-3) |
| U17 vs Toulon | 15 déc 2025 | `completed` | Past match, final score (5-2), summary shown |

**Expected Results**:
- [ ] U13 match: Status `upcoming`, no scores, venue = "Patinoire d'Aubagne"
- [ ] U15 match: Status `upcoming`, stadium = Marseille, location = `away`
- [ ] N1 match: Status `live`, isLive = true, scoreJokers = 2, scoreOpponent = 3
- [ ] U17 match: Status `completed`, scoreJokers = 5, scoreOpponent = 2, summary = "Belle victoire..."

### Test 6.2: Coach Creates New Match

**As**: Coach U13 (coach.u13@jokers.fr)

**Steps**:
1. Login as Coach U13
2. Navigate to Matches collection
3. Click "Create New"
4. Fill in:
   - Date: 10 janvier 2026 15h00
   - Opponent: "Toulon U13"
   - Category: U13
   - Location: Extérieur (away)
   - Stadium: Select "Patinoire de Nice"
   - Status: Upcoming
5. Save

**Expected Results**:
- [ ] Match created successfully
- [ ] Appears in matches calendar
- [ ] Coach can create matches for their team
- [ ] Away match linked to stadium correctly

**Verification**:
- [ ] Check API: `GET /api/matches`
- [ ] New match appears with correct data
- [ ] Category set to U13 team ID

---

## 7. Workflow: Newsletter Subscriptions

### Test 7.1: Public Subscription

**As**: Unauthenticated user

**Steps**:
1. Open browser in incognito mode
2. Send POST request to `/api/newsletter-subscriptions` (or use website form if implemented)
3. Body:
   ```json
   {
     "email": "test-fan@gmail.com",
     "subscribed": true
   }
   ```

**Expected Results**:
- [ ] Subscription created successfully (public create access)
- [ ] Entry appears in newsletter-subscriptions collection
- [ ] `subscribed` = true
- [ ] No authentication required

### Test 7.2: Secretary Manages Subscriptions

**As**: Secretary (secretaire@jokers.fr)

**Steps**:
1. Login as Secretary
2. Navigate to Newsletter Subscriptions collection
3. View all subscribers (should have 3+ entries from seed)
4. Select a subscriber
5. Change `subscribed` to false
6. Add `unsubscribedAt` date (current date)
7. Save

**Expected Results**:
- [ ] Secretary can read all subscriptions
- [ ] Can update subscription status
- [ ] Can add unsubscribe date
- [ ] Changes saved successfully

**As**: Coach U13 (coach.u13@jokers.fr)

**Steps**:
1. Login as Coach U13
2. Try to access Newsletter Subscriptions collection

**Expected Results**:
- [ ] **Access DENIED** (coach role not allowed)
- [ ] Collection not visible in sidebar
- [ ] Direct API access fails: `GET /api/newsletter-subscriptions` → 403 Forbidden

---

## 8. Workflow: Staff

### Test 8.1: Public Read Access

**As**: Unauthenticated user

**Steps**:
1. Open browser in incognito mode
2. Navigate to http://localhost:5000/api/staff
3. View the API response

**Expected Results**:
- [ ] Can read all 3 staff members (President, Coach, Treasurer)
- [ ] See names, roles, emails, phones
- [ ] Public access works (no authentication)

### Test 8.2: Admin Adds Staff Member

**As**: Admin (admin@jokers.fr)

**Steps**:
1. Login as Admin
2. Navigate to Staff collection
3. Click "Create New"
4. Fill in:
   - Name: "Marie Secrétaire"
   - Role: Secretary
   - Email: "marie.secretaire@jokers.fr"
   - Phone: "+33 6 44 55 66 77"
   - (Optional) Upload profile photo
   - (Optional) Assign to a team
5. Save

**Expected Results**:
- [ ] Staff member created successfully
- [ ] Appears in staff list
- [ ] Profile photo uploaded (if provided)
- [ ] Team assignment saved

**As**: Secretary (secretaire@jokers.fr)

**Steps**:
1. Login as Secretary
2. Try to create a new staff member

**Expected Results**:
- [ ] **Cannot create** (no create permission for secretary role)
- [ ] Can only READ staff members
- [ ] Create button disabled or save fails

---

## Summary Checklist

After completing all tests, verify:

### Core Functionality
- [ ] All 7 roles can authenticate successfully
- [ ] Role-based permissions work correctly (admin, director, secretary, treasurer, coach, parent, photographer)
- [ ] Complex query permissions work (parents see only their children, coaches see their team)
- [ ] Field-level permissions work (medical notes admin-only)

### Photo Approval Workflow
- [ ] Parent uploads → status = `pending`
- [ ] Photographer uploads → status = `approved` (auto)
- [ ] Admin can approve/reject with reasons
- [ ] Rejected photos show reason to uploader
- [ ] Public API shows only approved photos

### Player Availability System
- [ ] Parents can declare for their own children only
- [ ] Validation blocks parents from declaring for other children
- [ ] Coaches see all availabilities
- [ ] Surclassement works (cross-category player selection)
- [ ] `declaredBy` and `declaredAt` auto-populated via hooks

### Data Integrity
- [ ] 64 players created with AI avatars
- [ ] 8 teams with proper structure
- [ ] 4 matches with different statuses (upcoming, live, completed)
- [ ] Relationships intact (players ↔ teams, matches ↔ stadiums)

### Security
- [ ] Unauthorized access blocked (coaches can't see other teams' players)
- [ ] Field-level security enforced (medical notes hidden from non-admins)
- [ ] Hook validation prevents permission bypass
- [ ] Public endpoints properly exposed (teams, staff readable by all)

---

## Troubleshooting

### Common Issues

**Issue**: "Cannot read players - permission denied"
- **Cause**: User role doesn't have read permission
- **Fix**: Verify user role and collection access settings

**Issue**: "Medical notes field not visible"
- **Cause**: Field-level permission restricts visibility
- **Solution**: Login as admin or director to see medical notes

**Issue**: "Photo still pending after photographer upload"
- **Cause**: beforeChange hook not executing
- **Fix**: Check server logs for hook errors, verify role = 'photographer'

**Issue**: "Parent can declare for other children"
- **Cause**: beforeChange hook validation failing
- **Fix**: Check hook implementation in collections/Matches.ts

**Issue**: "No avatars generated"
- **Cause**: UI Avatars API unreachable or rate limited
- **Fix**: Check internet connection, retry seed after delay

**Issue**: "Test photos not uploaded"
- **Cause**: Photos not downloaded before running seed
- **Fix**: Run `npm run download-photos` first, then `npm run seed`

---

## Next Steps

After completing all tests:

1. **Document Issues**: Create GitHub issues for any failing tests
2. **Performance Testing**: Test with larger datasets (500+ players)
3. **API Testing**: Use Postman/Insomnia to test all REST endpoints
4. **Frontend Integration**: Build React components that consume these APIs
5. **Production Deployment**: Migrate to production database and test again
6. **User Acceptance Testing**: Have real users (coaches, parents) test workflows

---

## Test Completion Log

Date: _____________
Tester: _____________
Environment: Development / Production
Total Tests Passed: ____ / 30+
Issues Found: _____________

Notes:
_____________________________________________
_____________________________________________
_____________________________________________
