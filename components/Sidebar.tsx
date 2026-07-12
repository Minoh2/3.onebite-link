import Link from "next/link";
import { folders } from "../lib/bookmarks";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link className="all-button" href="/">
        ALL
      </Link>
      <nav className="folder-list" aria-label="폴더 목록">
        {folders.map((folder) => (
          <Link
            className="folder-button"
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
