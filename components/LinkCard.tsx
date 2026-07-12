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
    <article className="link-card">
      <div className="link-card-header">
        <span className="folder-badge">{folder}</span>
        <span className="link-domain">{url}</span>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
}
