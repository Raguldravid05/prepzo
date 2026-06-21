import React from 'react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  icon = null
}) {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-[14px] transition-all duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer';
  
  const variants = {
    primary: 'bg-[#10B981] hover:bg-[#059669] text-white shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20',
    secondary: 'bg-[#111827] hover:bg-[#1E293B] text-[#E2E8F0] border border-[#1E293B] hover:border-[#334155]',
    danger: 'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-md shadow-red-500/10',
    warning: 'bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-md shadow-amber-500/10',
  };

  const sizes = {
    sm: 'h-[36px] px-[14px] text-[12px] rounded-[10px]',
    md: 'h-[44px] px-[20px] text-[13px]',
    lg: 'h-[52px] px-[24px] text-[14px]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <span className="w-[16px] h-[16px] border-2 border-current border-t-transparent rounded-full animate-spin mr-[8px]" />
      ) : icon ? (
        <span className="mr-[8px] flex items-center">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
