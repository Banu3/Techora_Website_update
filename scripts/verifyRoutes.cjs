const http = require('http');

const routes = [
  '/',
  '/partner-with-us',
  '/careers',
  '/admin',
  '/profile/about-us',
  '/profile/our-legacy',
  '/profile/leadership',
  '/services/recruitment',
  '/services/payroll',
  '/clients',
  '/expertise/industries',
  '/privacy'
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + route, (res) => {
      resolve({ route, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ route, error: err.message });
    });
  });
}

async function verifyAll() {
  console.log('Verifying all frontend routes on port 3000:\n');
  for (const r of routes) {
    const res = await checkRoute(r);
    if (res.status === 200) {
      console.log(`[PASS] ${res.route} -> ${res.status} OK`);
    } else {
      console.log(`[FAIL] ${res.route} -> ${res.status || res.error}`);
    }
  }
}

verifyAll();
