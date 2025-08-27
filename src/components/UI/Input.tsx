import React, { forwardRef } from 'react';
import './Input.css';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'standard';
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>((
  {
    label,
    placeholder,
    value,
    defaultValue,
    type = 'text',
    size = 'medium',
    variant = 'outlined',
    disabled = false,
    error = false,
    errorMessage,
    helperText,
    required = false,
    fullWidth = false,
    startIcon,
    endIcon,
    className = '',
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    ...props
  },
  ref
) => {
  const baseClass = 'input-wrapper';
  const sizeClass = `input-${size}`;
  const variantClass = `input-${variant}`;
  const errorClass = error ? 'input-error' : '';
  const disabledClass = disabled ? 'input-disabled' : '';
  const fullWidthClass = fullWidth ? 'input-full-width' : '';
  const hasIconsClass = (startIcon || endIcon) ? 'input-has-icons' : '';
  
  const wrapperClasses = [
    baseClass,
    sizeClass,
    variantClass,
    errorClass,
    disabledClass,
    fullWidthClass,
    hasIconsClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className="input-container">
        {startIcon && (
          <div className="input-icon input-start-icon">
            {startIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          className="input-field"
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          {...props}
        />
        
        {endIcon && (
          <div className="input-icon input-end-icon">
            {endIcon}
          </div>
        )}
      </div>
      
      {(errorMessage || helperText) && (
        <div className={`input-helper ${error ? 'input-helper-error' : ''}`}>
          {error ? errorMessage : helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;