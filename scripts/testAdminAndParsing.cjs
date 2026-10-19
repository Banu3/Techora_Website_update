const http = require('http');
const fs = require('fs');
const path = require('path');

const ADMIN_TOKEN = 'techora_admin_secret_token_2026';

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch (e) {
          json = body;
        }
        resolve({ statusCode: res.statusCode, headers: res.headers, body: json });
      });
    });
    req.on('error', reject);
    if (data) {
      if (typeof data === 'string' || Buffer.isBuffer(data)) {
        req.write(data);
      } else {
        req.write(JSON.stringify(data));
      }
    }
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('TECHORA VERIFICATION: ADMIN MANAGEMENT & RESUME AUTOFILL');
  console.log('================================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Verify Public Jobs API & Application Count field
    console.log('\n--- 1. Testing Public Jobs API ---');
    const pubJobs = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/jobs',
      method: 'GET',
    });
    assert(pubJobs.statusCode === 200, 'Public GET /api/jobs returns 200 OK');
    assert(Array.isArray(pubJobs.body.jobs), 'Jobs array returned');
    if (pubJobs.body.jobs.length > 0) {
      const first = pubJobs.body.jobs[0];
      assert(first.application_count !== undefined, `Job has application_count field: ${first.application_count}`);
      assert(first.department !== undefined, `Job has department field: ${first.department}`);
    }

    // 2. Verify Admin Auth Rejection (Unauthorized access)
    console.log('\n--- 2. Testing Security & Authorization Controls ---');
    const unauthVerify = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/auth/verify',
      method: 'GET',
      headers: { Authorization: 'Bearer bad_token_123' },
    });
    assert([401, 403].includes(unauthVerify.statusCode), `Invalid admin token receives 401/403 (${unauthVerify.statusCode})`);

    const unauthPost = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/jobs',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Hacked Job' }),
    });
    assert(unauthPost.statusCode === 401, 'Public user cannot create jobs without admin token (401)');

    const authVerify = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/auth/verify',
      method: 'GET',
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    assert(authVerify.statusCode === 200 && authVerify.body.authorized, 'Admin token successfully verifies (200 OK)');

    // 3. Test Admin Stats & Real DB Counts
    console.log('\n--- 3. Testing Admin Stats & Real DB Counts ---');
    const adminStats = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/jobs/stats',
      method: 'GET',
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    assert(adminStats.statusCode === 200, 'Admin GET /api/admin/jobs/stats returns 200 OK');
    assert(adminStats.body.stats && adminStats.body.stats.totalJobs >= 0, `Total jobs: ${adminStats.body.stats.totalJobs}`);
    assert(adminStats.body.stats.totalApplications >= 0, `Total applications: ${adminStats.body.stats.totalApplications}`);
    assert(Array.isArray(adminStats.body.jobCounts), `Job counts array returned (${adminStats.body.jobCounts.length} mandates)`);

    // 4. Test Admin Job Creation
    console.log('\n--- 4. Testing Admin Job Creation ---');
    const newJobPayload = {
      title: 'Senior Managing Director — Enterprise BFSI',
      designation: 'Senior Practice Lead',
      department: 'Banking & Financial Institutions',
      experience_text: '12+ Years Executive Search',
      location: 'Mumbai, Maharashtra',
      employment_type: 'Full-time Retained Mandate',
      description: 'Lead confidential executive mandates for tier-1 domestic banks and multinational financial institutions.',
      responsibilities: 'Oversee search practice, manage partner-level relationships, conduct fiduciary talent evaluations.',
      required_skills: ['Executive Search', 'BFSI Advisory', 'P&L Leadership', 'Compliance Governance'],
      deadline: '2026-12-31',
      status: 'active',
    };

    const createRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/admin/jobs',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      },
      newJobPayload
    );

    assert(createRes.statusCode === 201, 'Job creation returns 201 Created');
    assert(createRes.body.success && createRes.body.job, 'Created job object returned with ID');
    const createdJobId = createRes.body.job ? createRes.body.job.id : null;
    const createdSlug = createRes.body.job ? createRes.body.job.slug : null;

    // 5. Test Admin Job Edit
    if (createdJobId) {
      console.log('\n--- 5. Testing Admin Job Modification ---');
      const updateRes = await request(
        {
          hostname: 'localhost',
          port: 5000,
          path: `/api/admin/jobs/${createdJobId}`,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
        },
        {
          ...newJobPayload,
          title: 'Senior Managing Director — Enterprise BFSI & FinTech',
          status: 'active',
        }
      );
      assert(updateRes.statusCode === 200, 'Job update returns 200 OK');
      assert(updateRes.body.job.title.includes('FinTech'), 'Job title successfully updated in database');
    }

    // 6. Test Application Submission & Per-Job Application Count Increment
    console.log('\n--- 6. Testing Application Submission & Real Count Increment ---');
    if (createdJobId) {
      // Check count before
      const jobBefore = await request({
        hostname: 'localhost',
        port: 5000,
        path: `/api/jobs/${createdJobId}`,
        method: 'GET',
      });
      const countBefore = jobBefore.body.job.application_count || 0;

      // Submit test application using multipart
      const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
      const testResumeContent = `%PDF-1.4\n%Techora Executive Resume\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`;

      let multipartBody = '';
      const addField = (name, val) => {
        multipartBody += `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${val}\r\n`;
      };

      addField('job_id', createdJobId.toString());
      addField('full_name', 'Dr. Eleanor Vance');
      addField('email', 'eleanor.vance.test@enterprise.com');
      addField('phone', '+91 98200 54321');
      addField('location', 'Mumbai, Maharashtra');
      addField('total_experience', '14 Years');
      addField('relevant_experience', '10 Years Retained Advisory');
      addField('consent', 'true');

      // Add dummy resume file
      multipartBody += `--${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="Eleanor_Vance_Resume.pdf"\r\nContent-Type: application/pdf\r\n\r\n`;
      multipartBody += testResumeContent;
      multipartBody += `\r\n--${boundary}--\r\n`;

      const appRes = await request(
        {
          hostname: 'localhost',
          port: 5000,
          path: '/api/applications',
          method: 'POST',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
          },
        },
        multipartBody
      );

      assert(appRes.statusCode === 201, `Application submitted successfully (201 Created): Ref ${appRes.body.referenceNo}`);

      // Check count after
      const jobAfter = await request({
        hostname: 'localhost',
        port: 5000,
        path: `/api/jobs/${createdJobId}`,
        method: 'GET',
      });
      const countAfter = jobAfter.body.job.application_count || 0;
      assert(countAfter === countBefore + 1, `Application count accurately increased from ${countBefore} to ${countAfter} in DB`);

      // 7. Verify Admin Applications Dashboard sees the application
      console.log('\n--- 7. Testing Admin Application Listing & Filtering ---');
      const appsRes = await request({
        hostname: 'localhost',
        port: 5000,
        path: `/api/admin/applications?job_id=${createdJobId}`,
        method: 'GET',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      assert(appsRes.statusCode === 200, 'Admin application query returns 200 OK');
      assert(appsRes.body.applications.length >= 1, 'Submitted candidate record is present in admin query');
      const submittedApp = appsRes.body.applications[0];
      assert(submittedApp.full_name === 'Dr. Eleanor Vance', 'Candidate name matches submission');
      assert(submittedApp.email === 'eleanor.vance.test@enterprise.com', 'Candidate email matches submission');

      // 8. Test Status Transition
      console.log('\n--- 8. Testing Application Status Workflow Transition ---');
      const statusRes = await request(
        {
          hostname: 'localhost',
          port: 5000,
          path: `/api/admin/applications/${submittedApp.id}/status`,
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
        },
        { status: 'shortlisted' }
      );
      assert(statusRes.statusCode === 200, 'Application status updated to shortlisted');

      // 9. Test Secure Resume Access
      console.log('\n--- 9. Testing Secure Resume Download Protection ---');
      const safeResumeName = submittedApp.resume_path;
      const unauthResume = await request({
        hostname: 'localhost',
        port: 5000,
        path: `/api/admin/resumes/${safeResumeName}`,
        method: 'GET',
      });
      assert(unauthResume.statusCode === 401, 'Unauthenticated visitor cannot download resume (401 Unauthorized)');

      const authResume = await request({
        hostname: 'localhost',
        port: 5000,
        path: `/api/admin/resumes/${safeResumeName}`,
        method: 'GET',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      assert(authResume.statusCode === 200, 'Authorized admin successfully downloads resume (200 OK)');

      // 10. Test Safe Archival on Delete
      console.log('\n--- 10. Testing Safe Data Retention Rules on Delete ---');
      const deleteRes = await request({
        hostname: 'localhost',
        port: 5000,
        path: `/api/admin/jobs/${createdJobId}`,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      assert(deleteRes.statusCode === 200, 'Delete request responded 200 OK');
      assert(deleteRes.body.archived === true, 'Mandate safely archived to preserve applicant dossier');
    }

    console.log('\n================================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================');
  } catch (err) {
    console.error('Test execution error:', err);
  }
}

runTests();
