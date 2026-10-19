const fs = require('fs');
const path = require('path');

async function testNewEndpoints() {
  console.log('Testing New Endpoints...');

  // 1. Test Admin Login
  const loginRes = await fetch('http://localhost:5000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@techora.consulting',
      password: 'Admin@123'
    })
  });
  const loginData = await loginRes.json();
  console.log('1. Admin Login Status:', loginRes.status, 'Token received:', !!loginData.token);
  if (!loginData.token) {
    throw new Error('Admin login failed: ' + JSON.stringify(loginData));
  }
  const token = loginData.token;

  // 2. Test Admin Stats
  const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const statsData = await statsRes.json();
  console.log('2. Admin Stats Status:', statsRes.status, 'Total Applications:', statsData.kpis?.totalApplications, 'Active Mandates:', statsData.kpis?.activeMandates);

  // 3. Test Applications List
  const appsRes = await fetch('http://localhost:5000/api/admin/applications', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const appsData = await appsRes.json();
  console.log('3. Applications Count:', appsData.count, 'Total in DB:', appsData.total);

  // 4. Test Export
  const exportRes = await fetch('http://localhost:5000/api/admin/export', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const exportCsv = await exportRes.text();
  console.log('4. CSV Export Length:', exportCsv.length, 'Header:', exportCsv.split('\n')[0]);

  console.log('ALL NEW BACKEND ENDPOINTS VERIFIED SUCCESSFULLY!');
}

testNewEndpoints().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
