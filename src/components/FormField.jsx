import React from 'react';

export default function FormField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  as = 'input',
  options = [],
  rows = 4,
  ...props
}) {
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '0.9375rem',
    fontFamily: 'var(--font-body)',
    color: 'var(--navy-900)',
    backgroundColor: 'var(--white)',
    border: error ? '1.5px solid #EF4444' : '1px solid var(--line)',
    borderRadius: '3px',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label 
          htmlFor={id} 
          style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '0.8125rem', 
            fontWeight: 600, 
            color: 'var(--navy-700)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {label} {required && <span style={{ color: 'var(--sky-500)' }}>*</span>}
        </label>
      )}

      {as === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          style={{ ...inputStyle, resize: 'vertical' }}
          {...props}
        />
      ) : as === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          style={inputStyle}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={inputStyle}
          {...props}
        />
      )}

      {error && (
        <span style={{ fontSize: '0.75rem', color: '#EF4444' }}>
          {error}
        </span>
      )}
    </div>
  );
}
