import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items = [], isLight = false }) {
  const linkColor = isLight ? 'rgba(255, 255, 255, 0.75)' : 'var(--ink)';
  const activeColor = isLight ? '#FFFFFF' : 'var(--navy-900)';
  const sepColor = isLight ? 'rgba(255, 255, 255, 0.4)' : 'var(--line)';

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '16px' }}>
      <ol style={{ display: 'flex', alignItems: 'center', gap: '8px', listStyle: 'none', fontSize: '0.8125rem', color: linkColor, flexWrap: 'wrap' }}>
        <li>
          <Link to="/" style={{ color: linkColor }}>Home</Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li>
                <ChevronRight size={13} style={{ color: sepColor }} />
              </li>
              <li>
                {isLast || !item.to ? (
                  <span style={{ color: activeColor, fontWeight: 600 }}>{item.label}</span>
                ) : (
                  <Link to={item.to} style={{ color: linkColor }}>{item.label}</Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
