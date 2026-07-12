"use client";

import { useFolders } from "./FolderProvider";
import LinkGrid from "./LinkGrid";

type LinkItem = {
  title: string;
  url: string;
  description: string;
  folder: string;
};

type FolderLinkGridProps = {
  folderId: string;
  initialTitle: string;
  links: LinkItem[];
};

export default function FolderLinkGrid({
  folderId,
  initialTitle,
  links,
}: FolderLinkGridProps) {
  const { folders } = useFolders();
  const folder = folders.find((item) => item.id === folderId);

  return (
    <LinkGrid
      eyebrow="Folder Links"
      title={folder ? `${folder.name} 링크` : initialTitle}
      links={links}
    />
  );
}
