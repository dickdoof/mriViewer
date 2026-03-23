interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-[var(--color-surface-container)] p-6 rounded-lg ghost-border">
      <h4 className="text-white font-bold mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[var(--color-primary)]">
          {icon}
        </span>
        {title}
      </h4>
      <p className="text-sm text-[var(--color-on-surface-variant)]">{description}</p>
    </div>
  );
}
