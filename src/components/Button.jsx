import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({ 
  children, 
  variant = 'primary', 
  to, 
  onClick, 
  type = 'button',
  className = '',
  disabled = false,
  ...props 
}) {
  let btnClass = 'btn-navy';
  if (variant === 'outline') {
    btnClass = 'btn-navy-outline';
  } else if (variant === 'text') {
    btnClass = 'btn-text-link';
  }

  const combinedClass = `${btnClass} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={combinedClass} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={combinedClass} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
