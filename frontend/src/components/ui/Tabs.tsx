import { type HTMLAttributes, useState, createContext, useContext, type ReactNode } from 'react';

interface TabsContextValue {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
  defaultTab: string;
  onChange?: (tab: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({ defaultTab, onChange, children, className = '', ...props }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, onTabChange: handleTabChange }}>
      <div className={className} {...props}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps extends HTMLAttributes<HTMLDivElement> {}
export function TabsList({ className = '', children, ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={`flex gap-1 bg-[var(--color-bg)] p-1 rounded-[var(--radius)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface TabTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: ReactNode;
}

export function TabTrigger({ value, icon, children, className = '', ...props }: TabTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabTrigger must be used within Tabs');
  const { activeTab, onTabChange } = context;
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`${value}-panel`}
      id={`${value}-trigger`}
      onClick={() => onTabChange(value)}
      className={`
        flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)]
        transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]
        ${isActive
          ? 'text-[var(--color-primary)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]'
          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
        }
        ${className}
      `}
      {...props}
    >
      {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}

interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabPanel({ value, children, className = '', ...props }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');
  const { activeTab } = context;

  if (activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      aria-labelledby={`${value}-trigger`}
      id={`${value}-panel`}
      className={`animate-fade-in ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}