const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('Starting API smoke tests...\n');

  try {
    console.log('1. Testing auth/login endpoint...');
    const loginResponse = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
      email: 'admin@pmajay.gov.in',
      password: 'admin123'
    });
    console.log('   ✓ Login successful');
    const token = loginResponse.data.token;

    console.log('\n2. Testing states endpoint...');
    const statesResponse = await axios.get(`${BASE_URL}/api/v1/states`);
    console.log(`   ✓ Retrieved ${statesResponse.data.length} states`);

    console.log('\n3. Testing projects endpoint...');
    const projectsResponse = await axios.get(`${BASE_URL}/api/v1/projects`);
    console.log(`   ✓ Retrieved ${projectsResponse.data.length} projects`);

    console.log('\n4. Testing agencies endpoint...');
    const agenciesResponse = await axios.get(`${BASE_URL}/api/v1/agencies`);
    console.log(`   ✓ Retrieved ${agenciesResponse.data.length} agencies`);

    console.log('\n5. Testing central dashboard endpoint (requires auth)...');
    const centralDashboard = await axios.get(`${BASE_URL}/api/v1/dashboard/central`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`   ✓ Dashboard stats: ${centralDashboard.data.totalProjects} projects, ${centralDashboard.data.totalBudget} total budget`);

    console.log('\n6. Testing state dashboard endpoint (requires auth)...');
    const stateDashboard = await axios.get(`${BASE_URL}/api/v1/dashboard/state/1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`   ✓ State: ${stateDashboard.data.state.name}, Projects: ${stateDashboard.data.totalProjects}`);

    console.log('\n7. Testing public dashboard endpoint...');
    const publicDashboard = await axios.get(`${BASE_URL}/api/v1/dashboard/public`);
    console.log(`   ✓ Retrieved ${publicDashboard.data.projects.length} public projects`);

    console.log('\n8. Testing project detail endpoint...');
    const projectDetail = await axios.get(`${BASE_URL}/api/v1/projects/1`);
    console.log(`   ✓ Project: ${projectDetail.data.title}`);

    console.log('\n9. Testing update progress endpoint (requires auth)...');
    await axios.post(`${BASE_URL}/api/v1/projects/1/progress`, {
      progress_percent: 50,
      note: 'Test progress update'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✓ Progress updated successfully');

    console.log('\n10. Testing fund transaction endpoint (requires auth)...');
    await axios.post(`${BASE_URL}/api/v1/projects/1/funds`, {
      amount: 100000,
      type: 'released',
      note: 'Test fund release'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✓ Fund transaction created successfully');

    console.log('\n\n========================================');
    console.log('ALL TESTS PASSED! ✓');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n✗ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  console.log('Please ensure the backend server is running on http://localhost:5000\n');
  setTimeout(runTests, 1000);
}

module.exports = { runTests };
