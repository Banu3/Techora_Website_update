import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWebsiteContent, updateWebsiteContent, resetWebsiteContent, DEFAULT_CONTENT } from '../utils/api';

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(() => getWebsiteContent());

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) {
        setContent(e.detail);
      }
    };
    window.addEventListener('cms_content_updated', handleUpdate);
    return () => window.removeEventListener('cms_content_updated', handleUpdate);
  }, []);

  const saveContent = async (newContent, token) => {
    const res = await updateWebsiteContent(newContent, token);
    setContent(prev => ({ ...prev, ...newContent }));
    return res;
  };

  const resetContent = async (token) => {
    const res = await resetWebsiteContent(token);
    setContent(DEFAULT_CONTENT);
    return res;
  };

  return (
    <ContentContext.Provider value={{ content, saveContent, resetContent, DEFAULT_CONTENT }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    // Graceful fallback if called outside ContentProvider
    return { content: getWebsiteContent(), saveContent: updateWebsiteContent, resetContent: resetWebsiteContent, DEFAULT_CONTENT };
  }
  return ctx;
};
