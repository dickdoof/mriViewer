interface ModalityItem {
  icon: string;
  label: string;
}

interface ModalityGridProps {
  items: ModalityItem[];
}

export default function ModalityGrid({ items }: ModalityGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 p-4 bg-[var(--color-surface)] rounded border border-[var(--color-outline-variant)]/10"
        >
          <span className="material-symbols-outlined text-[var(--color-primary)]">
            {item.icon}
          </span>
          <span className="text-sm font-semibold">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
