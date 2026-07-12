type LinkCardProps = {
  title: string;
  url: string;
  description: string;
  folder: string;
};

export default function LinkCard({
  title,
  url,
  description,
  folder,
}: LinkCardProps) {
  return (
    <article className="link-card-hover min-h-[210px] rounded-xl bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
      <div className="mb-6 flex items-center justify-between gap-3">
        <span className="rounded-[980px] bg-[var(--surface-hover)] px-3 py-1 text-[13px] leading-[1.4] text-[var(--text)]">{folder}</span>
        <span className="truncate text-[13px] leading-[1.4] text-[var(--text-sub)]">{url}</span>
      </div>
      <h2 className="mb-3 text-2xl font-semibold leading-[1.2] tracking-[-0.3px]">{title}</h2>
      <p className="text-[15px] leading-[1.5] text-[var(--text-sub)]">{description}</p>
    </article>
  );
}
