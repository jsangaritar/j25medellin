interface FilterTab {
  key: string;
  label: string;
}

interface FilterBarProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function FilterBar({ tabs, activeTab, onTabChange }: FilterBarProps) {
  return (
    <div className="flex w-full border-b border-border bg-bg-primary">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`px-6 py-4 text-[13px] transition-colors cursor-pointer md:text-[13px] ${
              isActive
                ? 'border-b-2 border-accent-bright font-semibold text-text-primary'
                : 'font-medium text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
