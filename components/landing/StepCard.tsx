interface StepCardProps {
  number: number;
  icon: string;
  title: string;
  description: string;
}

export default function StepCard({ number, icon, title, description }: StepCardProps) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-[var(--color-primary-container)]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--color-primary)]">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="text-xl font-[family-name:var(--font-display)] font-semibold mb-4 text-white">
        {number}. {title}
      </h3>
      <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
