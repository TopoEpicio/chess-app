import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
  badge?: string | number;
  badgeVariant?: 'primary' | 'warning' | 'danger';
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface SidebarProps {
  workspaceName?: string;
  logo?: ReactNode;
  navGroups: NavGroup[];
  footer?: ReactNode;
  className?: string;
}

export function Sidebar({ workspaceName, logo, navGroups, footer, className = '' }: SidebarProps) {
  const { t } = useTranslation('common')
  const workspace = workspaceName ?? t('common.personal')

  return (
    <aside className={`w-60 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col h-screen sticky top-0 z-50 ${className}`} aria-label={t('common.mainNavigation')}>
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          {logo || (
            <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--color-primary)] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          )}
          <span className="font-semibold text-[var(--color-text)] tracking-tight">{t('app.name')}</span>
        </div>
        <p className="mt-2 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">{workspace}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto" aria-label={t('common.mainMenu')}>
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">{group.label}</p>
            {group.items.map((item, itemIndex) => (
              <NavLink
                key={itemIndex}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]'
                  }
                `}
                title={item.label}
              >
                <span className="flex-shrink-0 w-5 h-5" aria-hidden="true">{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`
                    flex-shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-[var(--radius-sm)]
                    ${item.badgeVariant === 'warning' ? 'bg-[var(--color-warning-light)] text-[var(--color-warning)]' : ''}
                    ${item.badgeVariant === 'danger' ? 'bg-[var(--color-danger-light)] text-[var(--color-danger)]' : ''}
                    ${item.badgeVariant === 'primary' || !item.badgeVariant ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : ''}
                  `}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--color-border)]">
        {footer || (
          <NavLink
            to="/impostazioni"
            className={({ isActive }) => `
              flex items-center justify-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium transition-all duration-150
              ${isActive
                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]'
              }
            `}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            {t('nav.settings')}
          </NavLink>
        )}
      </div>
    </aside>
  );
}