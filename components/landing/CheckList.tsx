interface CheckListProps {
  items: string[];
}

export default function CheckList({ items }: CheckListProps) {
  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-3 text-[var(--color-on-surface)]">
          <span className="material-symbols-outlined text-[var(--color-primary)]">
            check_circle
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
