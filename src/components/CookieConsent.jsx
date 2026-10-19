import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cookie, X, Check, Sliders, ChevronDown, ChevronUp, Lock } from 'lucide-react';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Granular cookie preference state
  const [preferences, setPreferences] = useState({
    necessary: true,     // Always enabled
    analytics: true,
    functional: true,
    marketing: false,
  });

  // Accordion open states for settings modal
  const [expandedSections, setExpandedSections] = useState({
    necessary: false,
    analytics: false,
    functional: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if consent has already been recorded
    try {
      const savedConsent = localStorage.getItem('techora_cookie_consent');
      if (savedConsent) {
        const parsed = JSON.parse(savedConsent);
        if (parsed.preferences) {
          setPreferences(parsed.preferences);
        }
      } else {
        // Show banner after brief delay on initial entrance
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsVisible(true);
    }

    // Global listener so footer or any button can trigger the settings modal anytime
    const handleOpenSettings = () => {
      setShowSettings(true);
    };

    const handleOpenPolicy = () => {
      setShowPolicy(true);
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings);
    window.addEventListener('open-cookie-policy', handleOpenPolicy);
    window.openTechoraCookieSettings = handleOpenSettings;
    window.openTechoraCookiePolicy = handleOpenPolicy;

    return () => {
      window.removeEventListener('open-cookie-settings', handleOpenSettings);
      window.removeEventListener('open-cookie-policy', handleOpenPolicy);
      delete window.openTechoraCookieSettings;
      delete window.openTechoraCookiePolicy;
    };
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem(
      'techora_cookie_consent',
      JSON.stringify({
        status: 'all_accepted',
        timestamp: new Date().toISOString(),
        preferences: allAccepted,
      })
    );
    setIsVisible(false);
    setShowSettings(false);
    triggerToast('All cookies accepted. Your preferences have been saved.');
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    };
    setPreferences(onlyNecessary);
    localStorage.setItem(
      'techora_cookie_consent',
      JSON.stringify({
        status: 'rejected_optional',
        timestamp: new Date().toISOString(),
        preferences: onlyNecessary,
      })
    );
    setIsVisible(false);
    setShowSettings(false);
    triggerToast('Optional cookies rejected. Only necessary cookies will be used.');
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      'techora_cookie_consent',
      JSON.stringify({
        status: 'custom_preferences',
        timestamp: new Date().toISOString(),
        preferences: preferences,
      })
    );
    setShowSettings(false);
    setIsVisible(false);
    triggerToast('Your cookie preferences have been customized and saved.');
  };

  const toggleAccordion = (key) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-6 z-[9999] flex items-center space-x-3 bg-[#0A192F] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-sky-500/30 text-sm max-w-md"
          >
            <div className="w-7 h-7 rounded-full bg-[#0284C7]/20 flex items-center justify-center text-[#38BDF8] shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Cookie Banner (Exact Match to User's Screenshot) */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9990] w-[calc(100%-2rem)] sm:w-[420px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.35)] border border-slate-200/90 p-6 md:p-7 flex flex-col font-sans"
            role="dialog"
            aria-label="Cookie Consent Banner"
          >
            {/* Top decorative subtle icon & title bar */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-[#0B1E33]">
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#0284C7]">
                  <Cookie className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Cookie Consent
                </span>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description Text matching the screenshot */}
            <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-[#1F2937] font-normal mb-2">
              By clicking “Accept All Cookies”, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.
            </p>

            {/* Cookie Policy Link matching the screenshot */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowPolicy(true)}
                className="text-[14px] font-semibold text-[#0B1E33] hover:text-[#0284C7] underline underline-offset-4 decoration-[#0B1E33]/70 hover:decoration-[#0284C7] transition-colors cursor-pointer"
              >
                Cookie Policy
              </button>
            </div>

            {/* 3 Action Buttons matching the screenshot exactly */}
            <div className="flex flex-col space-y-2.5">
              {/* Button 1: Cookies Settings */}
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="w-full py-3 px-4 rounded-lg bg-white border border-[#0B1E33] hover:bg-slate-50 text-[#0B1E33] font-bold text-sm tracking-wide transition-all shadow-xs active:scale-[0.99] cursor-pointer"
              >
                Cookies Settings
              </button>

              {/* Button 2: Reject All */}
              <button
                type="button"
                onClick={handleRejectAll}
                className="w-full py-3 px-4 rounded-lg bg-[#4A5568] hover:bg-[#3D4756] text-white font-bold text-sm tracking-wide transition-all shadow-xs active:scale-[0.99] cursor-pointer"
              >
                Reject All
              </button>

              {/* Button 3: Accept All Cookies */}
              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full py-3 px-4 rounded-lg bg-[#0B1E33] hover:bg-[#071524] text-white font-bold text-sm tracking-wide transition-all shadow-sm active:scale-[0.99] cursor-pointer"
              >
                Accept All Cookies
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookies Settings Modal (Comprehensive Preference Center) */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
              role="dialog"
              aria-label="Cookie Preferences Center"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50/60 to-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shadow-sm">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#092342]">
                      Cookie Preference Center
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage how cookies and tracking technologies are used on Techora
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-600 divide-y divide-slate-100">
                <div className="pb-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                  When you visit our website, we store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences, or your device and is mostly used to make the site work as you expect it to. Because we respect your right to privacy, you can choose not to allow some types of cookies.
                </div>

                {/* 1. Strictly Necessary Cookies */}
                <div className="pt-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleAccordion('necessary')}
                      className="flex items-center space-x-2 text-left font-bold text-[#092342] text-sm hover:text-[#0284C7] transition-colors cursor-pointer"
                    >
                      <span>Strictly Necessary Cookies</span>
                      {expandedSections.necessary ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 flex items-center space-x-1">
                      <Lock className="w-3 h-3 text-slate-500 inline mr-1" />
                      Always Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    These cookies are essential for the website to function properly and cannot be switched off in our systems. They are usually set in response to actions made by you, such as logging in, filling forms, or navigating secure pages.
                  </p>
                  {expandedSections.necessary && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600 border border-slate-200/60"
                    >
                      <div className="font-semibold text-slate-800">Cookies Used:</div>
                      <div>• <code className="text-[#0284C7]">techora_session_token</code> (Authentication state)</div>
                      <div>• <code className="text-[#0284C7]">techora_cookie_consent</code> (Remembers your privacy choices)</div>
                      <div>• <code className="text-[#0284C7]">csrf_protection</code> (Secures forms against spoofing)</div>
                    </motion.div>
                  )}
                </div>

                {/* 2. Performance & Analytics Cookies */}
                <div className="pt-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleAccordion('analytics')}
                      className="flex items-center space-x-2 text-left font-bold text-[#092342] text-sm hover:text-[#0284C7] transition-colors cursor-pointer"
                    >
                      <span>Performance & Analytics Cookies</span>
                      {expandedSections.analytics ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {/* Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            analytics: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0284C7]"></div>
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    These cookies allow us to count visits, traffic sources, and page load durations so we can measure and improve the performance of our platform. All data collected is aggregated and anonymous.
                  </p>
                  {expandedSections.analytics && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600 border border-slate-200/60"
                    >
                      <div className="font-semibold text-slate-800">Cookies Used:</div>
                      <div>• <code className="text-[#0284C7]">_ga, _gid</code> (Google Analytics usage statistics)</div>
                      <div>• <code className="text-[#0284C7]">techora_metrics</code> (Page response latency telemetry)</div>
                    </motion.div>
                  )}
                </div>

                {/* 3. Functional Cookies */}
                <div className="pt-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleAccordion('functional')}
                      className="flex items-center space-x-2 text-left font-bold text-[#092342] text-sm hover:text-[#0284C7] transition-colors cursor-pointer"
                    >
                      <span>Functional & Preference Cookies</span>
                      {expandedSections.functional ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {/* Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            functional: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0284C7]"></div>
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    These cookies enable enhanced website functionality and personalization, such as remembering your regional currency preferences, live chat state, and interface customizations.
                  </p>
                  {expandedSections.functional && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600 border border-slate-200/60"
                    >
                      <div className="font-semibold text-slate-800">Cookies Used:</div>
                      <div>• <code className="text-[#0284C7]">techora_locale</code> (Language and region)</div>
                      <div>• <code className="text-[#0284C7]">roi_calc_inputs</code> (Saved calculator inputs for convenience)</div>
                    </motion.div>
                  )}
                </div>

                {/* 4. Marketing & Targeting Cookies */}
                <div className="pt-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleAccordion('marketing')}
                      className="flex items-center space-x-2 text-left font-bold text-[#092342] text-sm hover:text-[#0284C7] transition-colors cursor-pointer"
                    >
                      <span>Marketing & Targeting Cookies</span>
                      {expandedSections.marketing ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {/* Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            marketing: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0284C7]"></div>
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    These cookies may be set through our site by our marketing and advertising partners. They are used to build a profile of your interests and show you relevant Techora solution updates on other platforms.
                  </p>
                  {expandedSections.marketing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600 border border-slate-200/60"
                    >
                      <div className="font-semibold text-slate-800">Cookies Used:</div>
                      <div>• <code className="text-[#0284C7]">_fbp, ads_partner_id</code> (LinkedIn Insight and campaign measurement)</div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs tracking-wide transition-all cursor-pointer"
                >
                  Reject All
                </button>

                <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg border border-[#0B1E33] text-[#0B1E33] hover:bg-slate-100 font-bold text-xs tracking-wide transition-all cursor-pointer"
                  >
                    Confirm My Choices
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg bg-[#0B1E33] hover:bg-[#071524] text-white font-bold text-xs tracking-wide transition-all shadow-xs cursor-pointer"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cookie Policy Modal */}
      <AnimatePresence>
        {showPolicy && (
          <div className="fixed inset-0 z-[9996] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
              role="dialog"
              aria-label="Techora Cookie Policy"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50 to-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1E33] text-white flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#092342]">
                      Techora Cookie Policy
                    </h3>
                    <p className="text-xs text-slate-500">
                      Transparency & Data Protection Standards (GDPR, CCPA & ISO 27001 Compliant)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPolicy(false)}
                  className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Policy Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
                <div>
                  <h4 className="font-bold text-[#092342] text-sm mb-1">1. What are Cookies?</h4>
                  <p className="text-xs text-slate-600">
                    Cookies are small text files that are stored on your computer, tablet, or smartphone when you visit a website. They allow the website to recognize your device, remember preferences, and ensure seamless navigation between secure modules.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#092342] text-sm mb-1">2. How We Use Cookies</h4>
                  <p className="text-xs text-slate-600">
                    Techora Enterprise Solutions uses cookies to facilitate secure login sessions, calculate corporate ROI metrics without loss of inputs, safeguard enterprise portals, and analyze aggregated traffic trends to continuously improve our advisory infrastructure.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#092342] text-sm mb-1">3. Cookie Categories</h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                    <li><strong className="text-slate-800">Strictly Necessary:</strong> Critical for navigation, security authentication, and session persistence.</li>
                    <li><strong className="text-slate-800">Analytics & Performance:</strong> Aggregated anonymous indicators on visitor traffic and server responsiveness.</li>
                    <li><strong className="text-slate-800">Functional:</strong> Storing selected themes, calculators, and language locales.</li>
                    <li><strong className="text-slate-800">Targeting:</strong> Tailoring advisory communications and relevant industry whitepapers.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-[#092342] text-sm mb-1">4. Managing Your Preferences</h4>
                  <p className="text-xs text-slate-600">
                    You have the right to modify or withdraw your consent at any time. You can access our <span className="text-[#0284C7] font-semibold">Cookie Settings</span> directly from the website footer or by clearing your browser cache.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#092342] text-sm mb-1">5. Contact Our Privacy Office</h4>
                  <p className="text-xs text-slate-600">
                    If you have questions regarding our privacy practices or cookie governance, please reach out to our Chief Information Security Officer at <a href="mailto:privacy@techora.com" className="text-[#0284C7] font-medium hover:underline">privacy@techora.com</a>.
                  </p>
                </div>
              </div>

              {/* Policy Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPolicy(false)}
                  className="px-6 py-2.5 rounded-lg bg-[#0B1E33] hover:bg-[#071524] text-white font-bold text-xs tracking-wide transition-all shadow-xs cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
export default CookieConsent;
