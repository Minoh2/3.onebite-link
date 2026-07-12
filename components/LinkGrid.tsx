"use client";

import LinkCard from "./LinkCard";
import { useFolders } from "./FolderProvider";
import type { Bookmark } from "../lib/bookmarks";

type LinkGridProps = {
  eyebrow?: string;
  title?: string;
  links?: Bookmark[];
};

export default function LinkGrid({
  eyebrow = "Saved Links",
  title = "등록된 링크",
  links: providedLinks,
}: LinkGridProps) {
  const { links } = useFolders();
  const visibleLinks = providedLinks ?? links;
  return (
    <section className="min-w-0">
      <div className="mb-12 flex items-end justify-between gap-6 max-[520px]:items-start">
        <div>
          <p className="mb-2 text-sm leading-[1.4] text-[var(--text-sub)]">{eyebrow}</p>
          <h1 className="text-[40px] font-semibold leading-[1.1] tracking-[-0.5px] max-[520px]:text-[34px]">{title}</h1>
        </div>
        <span className="shrink-0 pb-1 text-sm leading-[1.4] text-[var(--text-sub)]">{visibleLinks.length}개</span>
      </div>
      <div className="grid grid-cols-2 gap-5 max-[620px]:grid-cols-1">
        {visibleLinks.map((link) => (
          <LinkCard key={link.id} {...link} />
        ))}
      </div>
    </section>
  );
}
