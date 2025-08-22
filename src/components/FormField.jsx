import React from 'react';

export default function FormField({ 
  label, 
  error, 
  required = false, 
  children, 
  helpText,
  className = '' 
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {helpText && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helpText}</p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}