import { useState, useRef, useEffect } from 'react';

/* ─── Button ─────────────────────────────────────────────────────────── */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'neutral' | 'subtle';
  size?: 'medium' | 'small';
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  iconStart,
  iconEnd,
  children,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    border: 'none',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    borderRadius: 'var(--radius-full)',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    lineHeight: 1,
    transition: 'background 0.15s, opacity 0.15s',
    opacity: props.disabled ? 0.5 : 1,
    whiteSpace: 'nowrap',
    padding: size === 'small' ? '6px 14px' : '9px 18px',
    fontSize: size === 'small' ? '13px' : '14px',
    ...(variant === 'primary'
      ? { background: 'var(--kompak-primary)', color: '#fff' }
      : variant === 'neutral'
      ? {
          background: 'var(--kompak-surface-white)',
          color: 'var(--kompak-text-dark)',
          border: '1px solid var(--kompak-border-strong)',
        }
      : { background: 'transparent', color: 'var(--kompak-text-dark)' }),
    ...style,
  };

  return (
    <button style={base} className={className} {...props}>
      {iconStart && <span style={{ display: 'flex', alignItems: 'center' }}>{iconStart}</span>}
      {children}
      {iconEnd && <span style={{ display: 'flex', alignItems: 'center' }}>{iconEnd}</span>}
    </button>
  );
}

/* ─── ButtonGroup ─────────────────────────────────────────────────────── */
interface ButtonGroupProps {
  children: React.ReactNode;
  align?: 'justify' | 'start' | 'end' | 'center' | 'stack';
  className?: string;
}

export function ButtonGroup({ children, align = 'justify', className = '' }: ButtonGroupProps) {
  const justifyMap: Record<string, string> = {
    justify: 'space-between',
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
  };
  if (align === 'stack') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className={className}>
        {children}
      </div>
    );
  }
  return (
    <div
      style={{ display: 'flex', gap: '8px', justifyContent: justifyMap[align] ?? 'space-between', width: '100%' }}
      className={className}
    >
      {children}
    </div>
  );
}

/* ─── Badge ───────────────────────────────────────────────────────────── */
interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'brand' | 'secondary';
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export function Badge({ label, variant = 'default', removable, onRemove, className = '' }: BadgeProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: { background: 'var(--kompak-card-bg)', color: 'var(--kompak-text-dark)', border: '1px solid var(--kompak-border)' },
    success: { background: 'var(--kompak-verified-bg)', color: 'var(--kompak-verified)' },
    warning: { background: 'var(--kompak-pending-bg)', color: 'var(--kompak-pending)' },
    danger: { background: 'var(--kompak-danger-bg)', color: 'var(--kompak-danger)' },
    brand: { background: 'rgba(44,95,45,0.12)', color: 'var(--kompak-primary)' },
    secondary: { background: 'var(--kompak-card-bg)', color: 'var(--kompak-text-muted)' },
  };

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 10px',
        borderRadius: 'var(--radius-full)',
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        fontWeight: 600,
        ...variantStyles[variant],
      }}
    >
      {label}
      {removable && (
        <button
          onClick={onRemove}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, display: 'flex' }}
        >
          <span style={{ fontSize: '14px', lineHeight: '1' }}>×</span>
        </button>
      )}
    </span>
  );
}

/* ─── Tabs ────────────────────────────────────────────────────────────── */
interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, defaultTab, onChange, className = '' }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? '');
  const activeTab = tabs.find((t) => t.id === active);

  const handleClick = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--kompak-border)',
          background: 'var(--kompak-surface-white)',
          overflowX: 'auto',
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleClick(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '12px 16px',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--kompak-primary)' : 'var(--kompak-text-muted)',
                borderBottom: `2px solid ${isActive ? 'var(--kompak-primary)' : 'transparent'}`,
                marginBottom: '-1px',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel">{activeTab?.content}</div>
    </div>
  );
}

/* ─── InputField ──────────────────────────────────────────────────────── */
interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  description?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onChange?: (value: string) => void;
}

export function InputField({ label, description, prefix, suffix, onChange, className = '', style, ...props }: InputFieldProps) {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      {label && (
        <label style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: 'var(--kompak-text-dark)' }}>
          {label}
        </label>
      )}
      {description && (
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--kompak-text-muted)' }}>
          {description}
        </span>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--kompak-card-bg)',
          border: '1px solid var(--kompak-border)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
        }}
      >
        {prefix && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{prefix}</span>}
        <input
          {...props}
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--kompak-text-dark)',
            minWidth: 0,
          }}
        />
        {suffix && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--kompak-text-muted)' }}>{suffix}</span>}
      </div>
    </div>
  );
}

/* ─── TextareaField ───────────────────────────────────────────────────── */
interface TextareaFieldProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  description?: string;
  onChange?: (value: string) => void;
}

export function TextareaField({ label, description, onChange, rows = 3, className = '', style, ...props }: TextareaFieldProps) {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      {label && (
        <label style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: 'var(--kompak-text-dark)' }}>
          {label}
        </label>
      )}
      {description && (
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--kompak-text-muted)' }}>{description}</span>
      )}
      <textarea
        {...props}
        rows={rows}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          background: 'var(--kompak-card-bg)',
          border: '1px solid var(--kompak-border)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--kompak-text-dark)',
          outline: 'none',
          resize: 'vertical',
        }}
      />
    </div>
  );
}

/* ─── SelectField ─────────────────────────────────────────────────────── */
interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function SelectField({ options, value = '', onChange, placeholder = 'Pilih...', label, description, disabled, className = '' }: SelectFieldProps) {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: 'var(--kompak-text-dark)' }}>
          {label}
        </label>
      )}
      {description && (
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--kompak-text-muted)' }}>{description}</span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          background: 'var(--kompak-card-bg)',
          border: '1px solid var(--kompak-border)',
          borderRadius: 'var(--radius-md)',
          padding: '9px 12px',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: value ? 'var(--kompak-text-dark)' : 'var(--kompak-text-muted)',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235C6B52' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: '32px',
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

/* ─── SidebarNavigation ───────────────────────────────────────────────── */
interface SidebarNavigationProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function SidebarNavigation({ children, footer, className = '' }: SidebarNavigationProps) {
  return (
    <aside
      className={className}
      style={{
        width: '60px',
        height: '100vh',
        background: 'var(--kompak-surface-white)',
        borderRight: '1px solid var(--kompak-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 0',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '8px',
          background: 'var(--kompak-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          flexShrink: 0,
        }}
      >
        <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-body)' }}>K</span>
      </div>

      {/* Nav items */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          {footer}
        </div>
      )}
    </aside>
  );
}

/* ─── SidebarButton ───────────────────────────────────────────────────── */
interface SidebarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  active?: boolean;
}

export function SidebarButton({ icon, active = false, className = '', style, ...props }: SidebarButtonProps) {
  return (
    <button
      className={className}
      style={{
        width: 40,
        height: 40,
        borderRadius: '8px',
        border: 'none',
        background: active ? 'var(--kompak-card-bg)' : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'var(--kompak-primary)' : 'var(--kompak-text-muted)',
        opacity: active ? 1 : 0.6,
        transition: 'background 0.15s, opacity 0.15s',
        ...style,
      }}
      {...props}
    >
      <span style={{ display: 'flex', width: 20, height: 20 }}>{icon}</span>
    </button>
  );
}

/* ─── Avatar ──────────────────────────────────────────────────────────── */
interface AvatarProps {
  type?: 'image' | 'initial';
  src?: string;
  initials?: string;
  size?: 'small' | 'medium' | 'large';
  shape?: 'circle' | 'square';
  alt?: string;
}

export function Avatar({ type = 'image', src, initials = 'U', size = 'medium', shape = 'circle', alt = 'Avatar' }: AvatarProps) {
  const px = size === 'small' ? 24 : size === 'medium' ? 32 : 40;
  const radius = shape === 'circle' ? '50%' : '6px';
  const fontSize = size === 'small' ? '9px' : size === 'medium' ? '11px' : '14px';

  if (type === 'image' && src) {
    return (
      <img
        src={src}
        alt={alt}
        style={{ width: px, height: px, borderRadius: radius, objectFit: 'cover' }}
      />
    );
  }

  return (
    <div
      style={{
        width: px,
        height: px,
        borderRadius: radius,
        background: 'var(--kompak-secondary)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
        fontSize,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initials.slice(0, 2)}
    </div>
  );
}

/* ─── ThemeProvider ───────────────────────────────────────────────────── */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
