import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="page-not-found" style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="404 — Page Not Found"
        subtitle="The page you requested does not exist or may have been relocated."
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Page Not Found', path: null },
        ]}
      />

      <section style={{ padding: '80px 0', flex: 1, backgroundColor: 'var(--white)' }}>
        <div className="container" style={{ maxWidth: '680px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              backgroundColor: 'var(--mist-50)',
              border: '1px solid var(--line)',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--ink-600)',
              marginBottom: '20px',
            }}
          >
            Institutional Advisory &amp; Workforce Portal
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
              fontWeight: 800,
              color: 'var(--navy-900)',
              marginBottom: '16px',
            }}
          >
            We Couldn't Locate That Resource
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'var(--ink-600)',
              marginBottom: '36px',
            }}
          >
            Please check the URL or navigate through TECHORA's institutional profile, specialized recruitment practice, or managed payroll divisions.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/">
              <Button variant="primary">Return to Home</Button>
            </Link>
            <Link to="/profile/about-us">
              <Button variant="outline">Explore About Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
