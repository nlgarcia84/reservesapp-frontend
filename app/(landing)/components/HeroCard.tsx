type HeroCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export const HeroCard = ({ title, description, icon }: HeroCardProps) => {
  return (
    <div
      className="group rounded-xl border p-8 transition-all duration-200"
      style={{
        borderColor: 'var(--border-primary)',
        backgroundColor: 'var(--bg-card)',
      }}
      /*
        El hover s'aplica només amb Tailwind per evitar flicker:
        hover:border-blue-400/50 hover:bg-[var(--bg-card-hover)]
      */
      /* Si vols més customització, afegeix aquestes classes: */
      /* className="... hover:border-blue-400/50 hover:bg-[var(--bg-card-hover)]" */
    >
      <div
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: 'var(--bg-accent-light)' }}
      >
        <div style={{ color: 'var(--accent-primary)' }}>{icon}</div>
      </div>
      <h3
        className="mb-3 text-lg font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h3>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>
    </div>
  );
};
