import LinkCard from "./LinkCard";
import { links } from "../lib/bookmarks";

type LinkItem = {
  title: string;
  url: string;
  description: string;
  folder: string;
};

type LinkGridProps = {
  eyebrow?: string;
  title?: string;
  links?: LinkItem[];
};

export default function LinkGrid({
  eyebrow = "Saved Links",
  title = "등록된 링크",
  links: visibleLinks = links,
}: LinkGridProps) {
  return (
    <section className="main-section">
      <div className="section-heading">
        <div>
          <p>{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        <span>{visibleLinks.length}개</span>
      </div>
      <div className="link-grid">
        {visibleLinks.map((link) => (
          <LinkCard key={link.title} {...link} />
        ))}
      </div>
    </section>
  );
}
