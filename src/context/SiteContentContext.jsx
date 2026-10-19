import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { defaultSiteContent } from '../content/siteContentDefaults';

const SiteContentContext = createContext(null);

const STORAGE_KEY = 'techora_site_content_overrides_v1';

// Deep merge helper
function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    // 1. Start with defaults
    let initial = defaultSiteContent;
    // 2. Hydrate from localStorage if present
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        initial = deepMerge(defaultSiteContent, parsed);
      }
    } catch (e) {
      console.warn('[CMS] Failed to read from localStorage:', e);
    }
    return initial;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch from server on mount
  const fetchRemoteContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.content) {
          setContent((prev) => {
            const merged = deepMerge(defaultSiteContent, data.content);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data.content));
            } catch (err) {}
            return merged;
          });
        }
      }
    } catch (err) {
      // Backend might be offline during dev, localStorage fallback serves fine
      console.info('[CMS] Running with local/cached content state.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen for storage events and in-app sync events
  useEffect(() => {
    const handleSync = () => {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setContent(deepMerge(defaultSiteContent, parsed));
        }
      } catch (e) {}
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('techora_content_changed', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('techora_content_changed', handleSync);
    };
  }, []);

  // Update a single page/section
  const updatePageContent = useCallback(async (pageKey, newPageContent) => {
    // 1. Optimistic UI update
    setContent((prev) => {
      const updated = {
        ...prev,
        [pageKey]: deepMerge(prev[pageKey] || {}, newPageContent),
      };
      try {
        const savedMap = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        savedMap[pageKey] = updated[pageKey];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMap));
        // Notify all components in the active window
        window.dispatchEvent(new CustomEvent('techora_content_changed', { detail: { pageKey } }));
      } catch (err) {}
      return updated;
    });

    // 2. Persist to server
    try {
      const token =
        localStorage.getItem('techora_admin_jwt') ||
        localStorage.getItem('techora_admin_token') ||
        sessionStorage.getItem('techora_admin_jwt') ||
        sessionStorage.getItem('techora_admin_token');

      const res = await fetch(`/api/content/${pageKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: newPageContent }),
      });
      return res.ok;
    } catch (err) {
      console.error(`[CMS] Failed to persist page '${pageKey}' to backend:`, err);
      return true; // Still persisted in localStorage and state
    }
  }, []);

  // Reset a page to default
  const resetPageContent = useCallback(async (pageKey) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        [pageKey]: defaultSiteContent[pageKey] || {},
      };
      try {
        const savedMap = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        delete savedMap[pageKey];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMap));
      } catch (err) {}
      return updated;
    });

    try {
      const token = localStorage.getItem('techora_admin_token') || sessionStorage.getItem('techora_admin_token');
      await fetch(`/api/content/reset/${pageKey}`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (err) {
      console.warn(`[CMS] Failed to reset page '${pageKey}' on server:`, err);
    }
  }, []);

  // Helper function to get text by dot-separated path with fallback
  // e.g. t('home.hero.slide1.headlineMain', 'Talent')
  const t = useCallback(
    (path, fallback = '') => {
      if (!path) return fallback;
      const parts = path.split('.');
      let curr = content;
      for (const p of parts) {
        if (curr && typeof curr === 'object' && p in curr) {
          curr = curr[p];
        } else {
          return fallback;
        }
      }
      return curr !== undefined && curr !== null ? curr : fallback;
    },
    [content]
  );

  return (
    <SiteContentContext.Provider
      value={{
        content,
        defaults: defaultSiteContent,
        isLoading,
        updatePageContent,
        resetPageContent,
        t,
        reloadContent: fetchRemoteContent,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return ctx;
}
