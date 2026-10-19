import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  FileEdit, Search, Save, RotateCcw, ExternalLink, Check, AlertCircle, 
  Home, Building2, Briefcase, FileSpreadsheet, Factory, Users, 
  Landmark, Award, Handshake, Globe, ChevronDown, ChevronRight, Sparkles, CheckCircle2 
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

const PAGE_DEFINITIONS = [
  { id: 'home', label: 'Home Page', icon: Home, path: '/' },
  { id: 'about', label: 'About Us', icon: Building2, path: '/profile/about-us' },
  { id: 'recruitment', label: 'Executive Search', icon: Briefcase, path: '/services/recruitment' },
  { id: 'payroll', label: 'Payroll & Compliance', icon: FileSpreadsheet, path: '/services/payroll' },
  { id: 'industries', label: 'Industries', icon: Factory, path: '/industries' },
  { id: 'leadership', label: 'Leadership', icon: Users, path: '/profile/leadership' },
  { id: 'legacy', label: 'Our Legacy', icon: Landmark, path: '/profile/our-legacy' },
  { id: 'careers', label: 'Careers', icon: Award, path: '/careers' },
  { id: 'partner', label: 'Partner With Us', icon: Handshake, path: '/partner-with-us' },
  { id: 'global', label: 'Global & Footer', icon: Globe, path: '/' },
];

export default function WebsiteContentEditor() {
  const { content, defaults, updatePageContent, resetPageContent } = useSiteContent();
  const [activePage, setActivePage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageDrafts, setPageDrafts] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved'
  const autoSaveTimerRef = useRef(null);

  const [expandedSections, setExpandedSections] = useState({
    'home.hero': true,
    'home.welcome': true,
    'home.servicesCards': true,
    'home.ctaBanner': true,
  });

  // Current working content for active page (draft if modified, else context content)
  const currentPageData = useMemo(() => {
    return pageDrafts[activePage] || content[activePage] || defaults[activePage] || {};
  }, [pageDrafts, activePage, content, defaults]);

  const defaultPageData = useMemo(() => {
    return defaults[activePage] || {};
  }, [defaults, activePage]);

  // Check if active page has unsaved local changes compared to saved context
  const hasChanges = useMemo(() => {
    return Boolean(pageDrafts[activePage]);
  }, [pageDrafts, activePage]);

  // Save changes to backend & localStorage
  const handleSave = async (overrideData = null) => {
    const dataToSave = overrideData || pageDrafts[activePage] || currentPageData;
    setIsSaving(true);
    setAutoSaveStatus('saving');
    try {
      await updatePageContent(activePage, dataToSave);
      setPageDrafts((prev) => {
        const copy = { ...prev };
        delete copy[activePage];
        return copy;
      });
      setAutoSaveStatus('saved');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save:', err);
      setAutoSaveStatus('unsaved');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle field change by path (e.g. ['welcome', 'eyebrow'])
  const handleFieldChange = (pathArr, value) => {
    const updated = JSON.parse(JSON.stringify(pageDrafts[activePage] || content[activePage] || defaults[activePage] || {}));
    let target = updated;
    for (let i = 0; i < pathArr.length - 1; i++) {
      const key = pathArr[i];
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      target = target[key];
    }
    target[pathArr[pathArr.length - 1]] = value;

    // Update draft in state
    setPageDrafts((prev) => ({
      ...prev,
      [activePage]: updated,
    }));
    setAutoSaveStatus('unsaved');

    // Debounced AUTO-SAVE (500ms): Automatically saves to website without requiring manual button click!
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      handleSave(updated);
    }, 500);
  };

  // Reset page to original factory default
  const handleReset = async () => {
    const pageObj = PAGE_DEFINITIONS.find((p) => p.id === activePage);
    const confirmed = window.confirm(`Are you sure you want to reset all content on "${pageObj?.label}" back to original defaults?`);
    if (!confirmed) return;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    await resetPageContent(activePage);
    setPageDrafts((prev) => {
      const copy = { ...prev };
      delete copy[activePage];
      return copy;
    });
    setAutoSaveStatus('saved');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleSection = (secKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [secKey]: !prev[secKey],
    }));
  };

  // Flatten active page object into editable fields grouped by section
  const sections = useMemo(() => {
    const result = [];

    function recurse(obj, defaultObj, path = []) {
      for (const [key, val] of Object.entries(obj)) {
        const currPath = [...path, key];
        const defVal = defaultObj ? defaultObj[key] : undefined;

        if (val && typeof val === 'object' && !Array.isArray(val)) {
          if (currPath.length === 1) {
            const sectionItems = [];
            collectLeafs(val, defVal, currPath, sectionItems);
            if (sectionItems.length > 0) {
              result.push({
                key: currPath.join('.'),
                title: formatLabel(key),
                items: sectionItems,
              });
            }
          }
        }
      }
    }

    function collectLeafs(obj, defaultObj, path, items) {
      for (const [key, val] of Object.entries(obj)) {
        const currPath = [...path, key];
        const defVal = defaultObj ? defaultObj[key] : undefined;
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          collectLeafs(val, defVal, currPath, items);
        } else if (typeof val === 'string' || typeof val === 'number') {
          items.push({
            path: currPath,
            keyName: key,
            label: formatLabel(key),
            fullPath: currPath.join(' > '),
            value: String(val),
            defaultValue: defVal !== undefined ? String(defVal) : '',
            isTextArea: String(val).length > 60 || key.toLowerCase().includes('text') || key.toLowerCase().includes('description') || key.toLowerCase().includes('subtitle') || key.toLowerCase().includes('message') || key.toLowerCase().includes('body'),
          });
        }
      }
    }

    function formatLabel(str) {
      return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .replace(/([0-9]+)/g, ' $1')
        .trim();
    }

    recurse(currentPageData, defaultPageData);

    if (!searchQuery.trim()) {
      return result;
    }

    const q = searchQuery.toLowerCase().trim();
    return result
      .map((sec) => {
        const filteredItems = sec.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.value.toLowerCase().includes(q) ||
            item.fullPath.toLowerCase().includes(q)
        );
        return {
          ...sec,
          items: filteredItems,
        };
      })
      .filter((sec) => sec.items.length > 0);
  }, [currentPageData, defaultPageData, searchQuery]);

  const activePageMeta = PAGE_DEFINITIONS.find((p) => p.id === activePage) || PAGE_DEFINITIONS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, position: 'relative' }}>
      {/* Top Action Bar */}
      <div
        style={{
          padding: '14px 24px',
          backgroundColor: 'var(--white)',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileEdit size={20} color="var(--sky-600)" />
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.125rem',
                color: 'var(--navy-900)',
                margin: 0,
                fontWeight: 700,
              }}
            >
              Website Content CMS Editor
            </h3>
          </div>

          {/* Auto-Save & Status Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            {autoSaveStatus === 'saved' ? (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#F0FDF4',
                  color: '#166534',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  border: '1px solid #86EFAC',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCircle2 size={13} color="#166534" />
                Live &amp; Auto-Saved
              </span>
            ) : autoSaveStatus === 'saving' ? (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#EFF6FF',
                  color: '#1D4ED8',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  border: '1px solid #93C5FD',
                }}
              >
                Syncing with Website...
              </span>
            ) : (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  border: '1px solid #FCD34D',
                }}
              >
                Saving Changes...
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Preview, Reset, and Prominent Save */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Live Page Preview Button */}
          <a
            href={activePageMeta.path}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--navy-800)',
              backgroundColor: 'var(--mist)',
              border: '1px solid var(--line)',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Preview Page</span>
            <ExternalLink size={14} />
          </a>

          {/* Reset Page Button */}
          <button
            type="button"
            onClick={handleReset}
            title="Reset this page to factory defaults"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--slate-600)',
              backgroundColor: 'transparent',
              border: '1px solid var(--line)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <RotateCcw size={14} />
            <span>Reset Default</span>
          </button>

          {/* Prominent Save Button */}
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--white)',
              backgroundColor: 'var(--sky-600)',
              border: 'none',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px rgba(47, 164, 231, 0.4)',
              transition: 'all 0.15s ease',
            }}
          >
            <Save size={16} />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish Now'}</span>
          </button>
        </div>
      </div>

      {/* Main CMS Layout (Sidebar Tabs + Content Workspace) */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Left Page Selector Tabs */}
        <aside
          style={{
            width: '230px',
            backgroundColor: 'var(--white)',
            borderRight: '1px solid var(--line)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            overflowY: 'auto',
          }}
        >
          <div style={{ padding: '12px 14px 6px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--slate-500)' }}>
            Select Website Page
          </div>
          <div style={{ padding: '4px 8px 16px' }}>
            {PAGE_DEFINITIONS.map((p) => {
              const Icon = p.icon;
              const isSelected = activePage === p.id;
              const isModified = Boolean(pageDrafts[p.id]);

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setActivePage(p.id);
                    setSearchQuery('');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? 'var(--sky-700)' : 'var(--navy-800)',
                    backgroundColor: isSelected ? 'rgba(47, 164, 231, 0.12)' : 'transparent',
                    border: isSelected ? '1px solid rgba(47, 164, 231, 0.3)' : '1px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: '3px',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={16} color={isSelected ? 'var(--sky-600)' : 'var(--slate-500)'} />
                    <span>{p.label}</span>
                  </div>
                  {isModified && (
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: '#F59E0B',
                        flexShrink: 0,
                      }}
                      title="Has pending edits"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Editor Workspace */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto', backgroundColor: '#F8FAFC' }}>
          {/* Search & Filter Header */}
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--white)',
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <div style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
              <Search
                size={16}
                color="var(--slate-400)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder={`Search text within ${activePageMeta.label}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  fontSize: '0.8125rem',
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  backgroundColor: 'var(--mist)',
                  color: 'var(--navy-900)',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Page Route:</span>
              <code style={{ backgroundColor: 'var(--mist)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--line)' }}>
                {activePageMeta.path}
              </code>
            </div>
          </div>

          {/* Form Fields Container */}
          <div style={{ padding: '20px 24px 100px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {sections.length === 0 ? (
              <div
                style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  backgroundColor: 'var(--white)',
                  borderRadius: '8px',
                  border: '1px solid var(--line)',
                }}
              >
                <AlertCircle size={32} color="var(--slate-400)" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ margin: '0 0 6px', color: 'var(--navy-900)' }}>No text fields matching "{searchQuery}"</h4>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                  Clear your search query to view all editable sections for {activePageMeta.label}.
                </p>
              </div>
            ) : (
              sections.map((section) => {
                const isExpanded = expandedSections[section.key] !== false;

                return (
                  <div
                    key={section.key}
                    style={{
                      backgroundColor: 'var(--white)',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Section Header */}
                    <button
                      type="button"
                      onClick={() => toggleSection(section.key)}
                      style={{
                        width: '100%',
                        padding: '12px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: isExpanded ? 'rgba(7, 20, 38, 0.02)' : 'var(--white)',
                        borderBottom: isExpanded ? '1px solid var(--line)' : 'none',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '2px',
                            backgroundColor: 'var(--sky-500)',
                          }}
                        />
                        <h4
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '0.9375rem',
                            fontWeight: 700,
                            color: 'var(--navy-900)',
                            margin: 0,
                          }}
                        >
                          {section.title} Section
                        </h4>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--slate-500)',
                            backgroundColor: 'var(--mist)',
                            padding: '2px 8px',
                            borderRadius: '100px',
                            border: '1px solid var(--line)',
                          }}
                        >
                          {section.items.length} {section.items.length === 1 ? 'Field' : 'Fields'}
                        </span>
                      </div>
                      {isExpanded ? <ChevronDown size={18} color="var(--slate-500)" /> : <ChevronRight size={18} color="var(--slate-500)" />}
                    </button>

                    {/* Section Fields */}
                    {isExpanded && (
                      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {section.items.map((item) => {
                          const isModifiedFromDefault = item.value !== item.defaultValue;

                          return (
                            <div
                              key={item.path.join('.')}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                                paddingBottom: '14px',
                                borderBottom: '1px solid #F1F5F9',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label
                                  style={{
                                    fontSize: '0.8125rem',
                                    fontWeight: 700,
                                    color: 'var(--navy-900)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <span>{item.label}</span>
                                  {isModifiedFromDefault && (
                                    <span
                                      style={{
                                        fontSize: '0.68rem',
                                        color: '#B45309',
                                        backgroundColor: '#FEF3C7',
                                        padding: '1px 6px',
                                        borderRadius: '4px',
                                      }}
                                    >
                                      Customized
                                    </span>
                                  )}
                                </label>
                                <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                                  {item.value.length} chars
                                </span>
                              </div>

                              {item.isTextArea ? (
                                <textarea
                                  value={item.value}
                                  onChange={(e) => handleFieldChange(item.path, e.target.value)}
                                  onBlur={() => handleSave()}
                                  rows={Math.min(6, Math.max(2, Math.ceil(item.value.length / 75)))}
                                  style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.5,
                                    borderRadius: '6px',
                                    border: isModifiedFromDefault ? '1px solid var(--sky-400)' : '1px solid var(--line)',
                                    backgroundColor: 'var(--white)',
                                    color: 'var(--navy-900)',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    transition: 'border-color 0.15s ease',
                                    boxSizing: 'border-box',
                                  }}
                                  onFocus={(e) => (e.target.style.borderColor = 'var(--sky-500)')}
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={item.value}
                                  onChange={(e) => handleFieldChange(item.path, e.target.value)}
                                  onBlur={() => handleSave()}
                                  style={{
                                    width: '100%',
                                    padding: '9px 14px',
                                    fontSize: '0.875rem',
                                    borderRadius: '6px',
                                    border: isModifiedFromDefault ? '1px solid var(--sky-400)' : '1px solid var(--line)',
                                    backgroundColor: 'var(--white)',
                                    color: 'var(--navy-900)',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    transition: 'border-color 0.15s ease',
                                    boxSizing: 'border-box',
                                  }}
                                  onFocus={(e) => (e.target.style.borderColor = 'var(--sky-500)')}
                                />
                              )}

                              {/* Original Reference Hint */}
                              {item.defaultValue && isModifiedFromDefault && (
                                <div
                                  style={{
                                    fontSize: '0.72rem',
                                    color: 'var(--slate-500)',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '6px',
                                    marginTop: '2px',
                                  }}
                                >
                                  <span style={{ fontWeight: 600 }}>Default:</span>
                                  <span style={{ fontStyle: 'italic', opacity: 0.85 }}>"{item.defaultValue}"</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
