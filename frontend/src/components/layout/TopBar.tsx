import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../stores/themeStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface TopBarProps {
  breadcrumb?: ReactNode;
  title?: string;
  actions?: ReactNode;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export function TopBar({ breadcrumb, title, actions, searchPlaceholder, onSearch, className = '' }: TopBarProps) {
  const { t } = useTranslation('common');
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`h-14 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-6 sticky top-0 z-50 ${className}`} role="banner">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-4">
        {breadcrumb && (
          <nav className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)]" aria-label="Breadcrumb">
            {breadcrumb}
          </nav>
        )}
      </div>

      {/* Center: Command Bar */}
      <div className="flex-1 max-w-2xl mx-8 relative">
        <Input
          type="search"
          placeholder={searchPlaceholder ?? t('common.searchPlaceholder')}
          value=""
          onChange={(e) => onSearch?.(e.target.value)}
          leftIcon={<svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>}
          className="w-full"
          aria-label={t('common.commandSearch')}
          autoComplete="off"
          spellCheck={false}
        />
        <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--color-text-placeholder)] font-mono pointer-events-none">⌘K</kbd>
      </div>

      {/* Right: Actions + Theme + Avatar */}
      <div className="flex items-center gap-3">
        {actions}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? t('common.switchToLightTheme') : t('common.switchToDarkTheme')}
          title={theme === 'dark' ? t('common.lightTheme') : t('common.darkTheme')}
        >
          {theme === 'dark' ? (
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </Button>
        <Button variant="ghost" size="sm" aria-label={t('common.notifications')}>
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </Button>
        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-semibold text-sm" aria-label={t('common.userProfile')}>
          UT
        </div>
      </div>
    </header>
  );
}