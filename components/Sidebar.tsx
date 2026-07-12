import Link from "next/link";
import { folders } from "../lib/bookmarks";

export default function Sidebar() {
  return (
    <aside className="self-start max-[800px]:overflow-x-auto">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-sub)]">
        Library
      </p>
      <Link className="nav-link-hover flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-[var(--text)]" href="/">
        모든 링크
      </Link>
      <nav className="mt-1 flex flex-col gap-1 max-[800px]:flex-row" aria-label="폴더 목록">
        {folders.map((folder) => (
          <Link
            className="nav-link-hover flex min-h-10 items-center rounded-lg px-3 text-sm text-[var(--text-sub)] max-[800px]:shrink-0"
            href={`/folder/${folder.id}`}
            key={folder.id}
          >
            {folder.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
