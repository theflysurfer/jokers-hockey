import 'dotenv/config'

const BASE_URL = 'http://localhost:5000/api'

interface TestResult {
  test: string
  status: 'PASS' | 'FAIL' | 'SKIP'
  message?: string
}

const results: TestResult[] = []

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`
  try {
    const response = await fetch(url, options)
    return {
      ok: response.ok,
      status: response.status,
      data: response.ok ? await response.json() : null,
      error: !response.ok ? await response.text() : null,
    }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: (error as Error).message,
    }
  }
}

async function login(email: string, password: string) {
  const response = await apiRequest('/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (response.ok && response.data?.token) {
    return response.data.token
  }
  return null
}

// Test 1: Public Access to Teams
async function testPublicTeams() {
  const response = await apiRequest('/teams')

  if (response.ok && response.data?.docs && response.data.docs.length === 8) {
    results.push({
      test: '1.1 Public Access - Teams',
      status: 'PASS',
      message: `Found ${response.data.docs.length} teams`,
    })
  } else {
    results.push({
      test: '1.1 Public Access - Teams',
      status: 'FAIL',
      message: `Expected 8 teams, got ${response.data?.docs?.length || 0}`,
    })
  }
}

// Test 2: Public Access to Staff
async function testPublicStaff() {
  const response = await apiRequest('/staff')

  if (response.ok && response.data?.docs && response.data.docs.length === 3) {
    results.push({
      test: '1.2 Public Access - Staff',
      status: 'PASS',
      message: `Found ${response.data.docs.length} staff members`,
    })
  } else {
    results.push({
      test: '1.2 Public Access - Staff',
      status: 'FAIL',
      message: `Expected 3 staff, got ${response.data?.docs?.length || 0}`,
    })
  }
}

// Test 3: Admin Login
async function testAdminLogin() {
  const token = await login('admin@jokers.fr', 'Admin2025!')

  if (token) {
    results.push({
      test: '2.1 Authentication - Admin Login',
      status: 'PASS',
      message: 'Admin successfully authenticated',
    })
    return token
  } else {
    results.push({
      test: '2.1 Authentication - Admin Login',
      status: 'FAIL',
      message: 'Failed to login as admin',
    })
    return null
  }
}

// Test 4: Parent Login
async function testParentLogin() {
  const token = await login('parent1@gmail.com', 'Parent2025!')

  if (token) {
    results.push({
      test: '2.2 Authentication - Parent Login',
      status: 'PASS',
      message: 'Parent successfully authenticated',
    })
    return token
  } else {
    results.push({
      test: '2.2 Authentication - Parent Login',
      status: 'FAIL',
      message: 'Failed to login as parent',
    })
    return null
  }
}

// Test 5: Admin Sees All Players
async function testAdminPlayers(adminToken: string) {
  const response = await apiRequest('/players', {
    headers: { 'Authorization': `Bearer ${adminToken}` },
  })

  if (response.ok && response.data?.docs && response.data.docs.length === 64) {
    results.push({
      test: '3.1 Players - Admin Sees All',
      status: 'PASS',
      message: `Admin sees all 64 players`,
    })
    return true
  } else {
    results.push({
      test: '3.1 Players - Admin Sees All',
      status: 'FAIL',
      message: `Admin should see 64 players, saw ${response.data?.docs?.length || 0}`,
    })
    return false
  }
}

// Test 6: Parent Sees Only Their Children
async function testParentPlayers(parentToken: string) {
  const response = await apiRequest('/players', {
    headers: { 'Authorization': `Bearer ${parentToken}` },
  })

  if (response.ok && response.data?.docs) {
    const count = response.data.docs.length
    if (count > 0 && count < 64) {
      results.push({
        test: '3.2 Players - Parent Sees Only Their Children',
        status: 'PASS',
        message: `Parent sees ${count} players (not all 64)`,
      })
      return true
    } else if (count === 64) {
      results.push({
        test: '3.2 Players - Parent Sees Only Their Children',
        status: 'FAIL',
        message: `Parent should NOT see all 64 players (permission issue)`,
      })
      return false
    }
  }

  results.push({
    test: '3.2 Players - Parent Sees Only Their Children',
    status: 'FAIL',
    message: 'Failed to fetch players as parent',
  })
  return false
}

// Test 7: Photo Approval Workflow
async function testPhotoApproval(adminToken: string) {
  const response = await apiRequest('/photos', {
    headers: { 'Authorization': `Bearer ${adminToken}` },
  })

  if (response.ok && response.data?.docs) {
    const photos = response.data.docs
    const pending = photos.filter((p: any) => p.approvalStatus === 'pending')
    const approved = photos.filter((p: any) => p.approvalStatus === 'approved')

    results.push({
      test: '4.1 Photos - Approval Status',
      status: 'PASS',
      message: `Found ${pending.length} pending, ${approved.length} approved photos`,
    })
    return true
  }

  results.push({
    test: '4.1 Photos - Approval Status',
    status: 'FAIL',
    message: 'Failed to fetch photos',
  })
  return false
}

// Test 8: Match Availability System
async function testMatchAvailability(adminToken: string) {
  const response = await apiRequest('/matches', {
    headers: { 'Authorization': `Bearer ${adminToken}` },
  })

  if (response.ok && response.data?.docs && response.data.docs.length === 4) {
    results.push({
      test: '5.1 Matches - All Created',
      status: 'PASS',
      message: `Found 4 matches with different statuses`,
    })
    return true
  }

  results.push({
    test: '5.1 Matches - All Created',
    status: 'FAIL',
    message: `Expected 4 matches, got ${response.data?.docs?.length || 0}`,
  })
  return false
}

// Test 9: Player Avatars
async function testPlayerAvatars(adminToken: string) {
  const response = await apiRequest('/players?limit=10', {
    headers: { 'Authorization': `Bearer ${adminToken}` },
  })

  if (response.ok && response.data?.docs) {
    const playersWithPhotos = response.data.docs.filter((p: any) => p.photo)

    if (playersWithPhotos.length > 0) {
      results.push({
        test: '6.1 Avatars - Players Have Photos',
        status: 'PASS',
        message: `${playersWithPhotos.length}/10 sampled players have avatars`,
      })
      return true
    }
  }

  results.push({
    test: '6.1 Avatars - Players Have Photos',
    status: 'FAIL',
    message: 'No players have avatars',
  })
  return false
}

// Test 10: Newsletter Subscriptions (Admin Access)
async function testNewsletterAdmin(adminToken: string) {
  const response = await apiRequest('/newsletter-subscriptions', {
    headers: { 'Authorization': `Bearer ${adminToken}` },
  })

  if (response.ok && response.data?.docs && response.data.docs.length === 3) {
    results.push({
      test: '7.1 Newsletter - Admin Access',
      status: 'PASS',
      message: `Found 3 newsletter subscriptions`,
    })
    return true
  }

  results.push({
    test: '7.1 Newsletter - Admin Access',
    status: 'FAIL',
    message: `Expected 3 subscriptions, got ${response.data?.docs?.length || 0}`,
  })
  return false
}

// Test 11: Newsletter Subscriptions (Parent Denied)
async function testNewsletterParent(parentToken: string) {
  const response = await apiRequest('/newsletter-subscriptions', {
    headers: { 'Authorization': `Bearer ${parentToken}` },
  })

  if (!response.ok && response.status === 403) {
    results.push({
      test: '7.2 Newsletter - Parent Denied',
      status: 'PASS',
      message: 'Parent correctly denied access (403)',
    })
    return true
  } else if (response.ok) {
    results.push({
      test: '7.2 Newsletter - Parent Denied',
      status: 'FAIL',
      message: 'Parent should NOT have access to newsletters',
    })
    return false
  }

  results.push({
    test: '7.2 Newsletter - Parent Denied',
    status: 'FAIL',
    message: `Expected 403, got ${response.status}`,
  })
  return false
}

function printResults() {
  console.log('\n' + '='.repeat(60))
  console.log('WORKFLOW TEST RESULTS')
  console.log('='.repeat(60) + '\n')

  const passed = results.filter(r => r.status === 'PASS').length
  const failed = results.filter(r => r.status === 'FAIL').length
  const skipped = results.filter(r => r.status === 'SKIP').length

  results.forEach((result) => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️'
    console.log(`${icon} ${result.test}`)
    if (result.message) {
      console.log(`   ${result.message}`)
    }
  })

  console.log('\n' + '='.repeat(60))
  console.log(`SUMMARY: ${passed} passed, ${failed} failed, ${skipped} skipped`)
  console.log('='.repeat(60) + '\n')

  return failed === 0
}

async function runAllTests() {
  console.log('🧪 Running Payload CMS Workflow Tests...\n')

  // Public access tests
  await testPublicTeams()
  await testPublicStaff()

  // Authentication tests
  const adminToken = await testAdminLogin()
  const parentToken = await testParentLogin()

  if (!adminToken || !parentToken) {
    console.error('❌ Authentication failed, skipping remaining tests')
    printResults()
    process.exit(1)
  }

  // Permission tests
  await testAdminPlayers(adminToken)
  await testParentPlayers(parentToken)

  // Feature tests
  await testPhotoApproval(adminToken)
  await testMatchAvailability(adminToken)
  await testPlayerAvatars(adminToken)

  // Newsletter permissions
  await testNewsletterAdmin(adminToken)
  await testNewsletterParent(parentToken)

  const allPassed = printResults()

  if (allPassed) {
    console.log('✅ All tests passed!\n')
    process.exit(0)
  } else {
    console.log('❌ Some tests failed. See details above.\n')
    process.exit(1)
  }
}

// Wait a bit for server to be ready
setTimeout(() => {
  runAllTests().catch((error) => {
    console.error('❌ Test suite failed:', error)
    process.exit(1)
  })
}, 2000)
