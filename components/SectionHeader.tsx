type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
};

export default function SectionHeader({ eyebrow, title, description, align = 'left' }: Props) {
  const alignment = align === 'center' ? 'text-center mx-auto' : '';
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 font-serif text-display-lg text-charcoal text-balance">{title}</h2>
      {description && (
        <p className="mt-4 text-charcoal-muted leading-relaxed text-pretty">{description}</p>
      )}
    </div>
  );
}
