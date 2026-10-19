import React, { useEffect } from 'react';

export const SEOMeta = ({ title, description, path = '' }) => {
  useEffect(() => {
    // Dynamic document title
    if (title) {
      document.title = `${title} | TECHORA Enterprise`;
    }

    // Update meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }

    // Inject Organization & Service Schema.org JSON-LD
    const schemaId = 'techora-schema-jsonld';
    let scriptTag = document.getElementById(schemaId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://techora.com/#organization",
          "name": "TECHORA",
          "url": "https://techora.com",
          "logo": "https://techora.com/favicon.svg",
          "tagline": "Technology That Moves Business Forward.",
          "description": "Techora delivers strategic IT consulting and reliable payroll solutions for enterprise organizations.",
          "knowsAbout": [
            "IT Strategy Consulting",
            "Software Architecture",
            "Cloud Computing",
            "Cybersecurity",
            "Payroll Processing",
            "TDS & Statutory Compliance",
            "PF and ESI Management"
          ]
        },
        {
          "@type": "Service",
          "@id": "https://techora.com/#it-services",
          "name": "IT Consulting Services",
          "provider": { "@id": "https://techora.com/#organization" },
          "serviceType": "Strategic IT Consulting, Cloud Solutions, Cybersecurity",
          "description": "Strategic technology solutions that help organizations modernize infrastructure and strengthen security."
        },
        {
          "@type": "Service",
          "@id": "https://techora.com/#payroll-services",
          "name": "Payroll Services",
          "provider": { "@id": "https://techora.com/#organization" },
          "serviceType": "Enterprise Payroll Processing & Statutory Compliance",
          "description": "Reliable payroll management designed to simplify salary processing, statutory compliance, and payroll reporting."
        }
      ]
    };

    scriptTag.text = JSON.stringify(schemaData);

  }, [title, description, path]);

  return null;
};
