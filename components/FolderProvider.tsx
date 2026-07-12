"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { folders as defaultFolders } from "../lib/bookmarks";

type Folder = {
  id: string;
  name: string;
};

type FolderContextValue = {
  folders: Folder[];
  addFolder: (name: string) => void;
  updateFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
};

const FolderContext = createContext<FolderContextValue | null>(null);

export function FolderProvider({ children }: { children: ReactNode }) {
  const [customFolders, setCustomFolders] = useState<Folder[]>([]);
  const [deletedFolderIds, setDeletedFolderIds] = useState<string[]>([]);
  const [folderNameOverrides, setFolderNameOverrides] = useState<
    Record<string, string>
  >({});

  const folders = useMemo(
    () =>
      [...defaultFolders, ...customFolders]
        .filter((folder) => !deletedFolderIds.includes(folder.id))
        .map((folder) => ({
          ...folder,
          name: folderNameOverrides[folder.id] ?? folder.name,
        })),
    [customFolders, deletedFolderIds, folderNameOverrides],
  );

  function addFolder(name: string) {
    const normalizedName = name.trim();
    if (!normalizedName) return;

    const baseId = normalizedName
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/^-|-$/g, "") || "folder";
    const id = `${baseId}-${Date.now()}`;
    const nextFolders = [...customFolders, { id, name: normalizedName }];

    setCustomFolders(nextFolders);
  }

  function updateFolder(id: string, name: string) {
    const normalizedName = name.trim();
    if (!normalizedName) return;

    setFolderNameOverrides((names) => ({
      ...names,
      [id]: normalizedName,
    }));
  }

  function deleteFolder(id: string) {
    setCustomFolders((folders) =>
      folders.filter((folder) => folder.id !== id),
    );
    setDeletedFolderIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
  }

  return (
    <FolderContext.Provider
      value={{ folders, addFolder, updateFolder, deleteFolder }}
    >
      {children}
    </FolderContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FolderContext);

  if (!context) {
    throw new Error("useFolders must be used inside FolderProvider");
  }

  return context;
}
