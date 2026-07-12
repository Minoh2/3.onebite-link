"use client";

import { useFolders } from "./FolderProvider";
import LinkGrid from "./LinkGrid";

type FolderLinkGridProps = {
  folderId: string;
  initialTitle: string;
};

export default function FolderLinkGrid({
  folderId,
  initialTitle,
}: FolderLinkGridProps) {
  const { folders, links: allLinks } = useFolders();
  const folder = folders.find((item) => item.id === folderId);

  return (
    <LinkGrid
      eyebrow="Folder Links"
      title={folder ? `${folder.name} 링크` : initialTitle}
      links={allLinks.filter((link) => link.folderId === folderId)}
    />
  );
}
