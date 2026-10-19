import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConsultationModal from './components/ConsultationModal';
import Loader from './components/Loader';
import ErrorBoundary from './components/ErrorBoundary';

// Static / core pages
import Home from './pages/Home';
import Careers from './pages/Careers';
import ApplyPage from './pages/ApplyPage';
import PartnerWithUs from './pages/PartnerWithUs';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';

// Lazy-loaded Profile, Services & Expertise Pages
const AboutUs = lazy(() => import('./pages/AboutUs'));
const OurLegacy = lazy(() => import('./pages/OurLegacy'));
const Leadership = lazy(() => import('./pages/Leadership'));
const Services = lazy(() => import('./pages/Services'));
const Recruitment = lazy(() => import('./pages/Recruitment'));
const Payroll = lazy(() => import('./pages/Payroll'));
const Clients = lazy(() => import('./pages/Clients'));
const Industries = lazy(() => import('./pages/Industries'));
const IndustryDetail = lazy(() => import('./pages/IndustryDetail'));
const Privacy = lazy(() => import('./pages/Privacy'));

function AppLayout() {
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [modalService, setModalService] = useState('Permanent Recruitment');
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const openConsultModal = (service) => {
    if (typeof service === 'string') {
      setModalService(service);
    }
    setConsultModalOpen(true);
  };
  const closeConsultModal = () => setConsultModalOpen(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', maxWidth: '100%', backgroundColor: 'var(--white)' }}>
      {!isAdmin && <Navbar onOpenConsultModal={openConsultModal} />}

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100%' }}>
        <ErrorBoundary>
          <Suspense fallback={<Loader message="Loading TECHORA Institutional Portal..." />}>
            <Routes>
              <Route path="/" element={<Home onOpenConsultModal={openConsultModal} />} />
              
              {/* Part 3 Profile Routes */}
              <Route path="/profile/about-us" element={<AboutUs onOpenConsultModal={openConsultModal} />} />
              <Route path="/profile/our-legacy" element={<OurLegacy onOpenConsultModal={openConsultModal} />} />
              <Route path="/profile/leadership" element={<Leadership onOpenConsultModal={openConsultModal} />} />

              {/* Backward-compatible redirects */}
              <Route path="/about-us" element={<Navigate to="/profile/about-us" replace />} />
              <Route path="/profile" element={<Navigate to="/profile/about-us" replace />} />
              <Route path="/profile/about" element={<Navigate to="/profile/about-us" replace />} />
              <Route path="/profile/legacy" element={<Navigate to="/profile/our-legacy" replace />} />

              {/* Services Routes */}
              <Route path="/services" element={<Services onOpenConsultModal={openConsultModal} />} />
              <Route path="/services/recruitment" element={<Recruitment onOpenConsultModal={openConsultModal} />} />
              <Route path="/services/payroll" element={<Payroll onOpenConsultModal={openConsultModal} />} />

              {/* Part 5: Clients (Locked Mode / Future Active Switch) */}
              <Route path="/clients" element={<Clients />} />

              {/* Part 5: Expertise -> Industries Routes */}
              <Route path="/expertise" element={<Navigate to="/expertise/industries" replace />} />
              <Route path="/expertise/industries" element={<Industries onOpenConsultModal={openConsultModal} />} />
              <Route path="/expertise/industries/:slug" element={<IndustryDetail onOpenConsultModal={openConsultModal} />} />

              {/* Careers & Job Mandates */}
              <Route path="/careers" element={<Careers onOpenConsultModal={openConsultModal} />} />
              <Route path="/careers/apply/:jobId" element={<ApplyPage onOpenConsultModal={openConsultModal} />} />
              <Route path="/careers/:slug/apply" element={<ApplyPage onOpenConsultModal={openConsultModal} />} />
              <Route path="/careers/:idOrSlug" element={<Careers onOpenConsultModal={openConsultModal} />} />

              {/* Partner With Us */}
              <Route path="/partner-with-us" element={<PartnerWithUs onOpenConsultModal={openConsultModal} />} />

              {/* Privacy Policy */}
              <Route path="/privacy" element={<Privacy onOpenConsultModal={openConsultModal} />} />

              {/* Admin Portal (Token Protected) */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      {!isAdmin && <Footer />}

      <ConsultationModal
        isOpen={consultModalOpen}
        onClose={closeConsultModal}
        defaultService={modalService}
      />
    </div>
  );
}

import { SiteContentProvider } from './context/SiteContentContext';

export default function App() {
  return (
    <Router>
      <SiteContentProvider>
        <AppLayout />
      </SiteContentProvider>
    </Router>
  );
}
