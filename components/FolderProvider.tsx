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
};

const FolderContext = createContext<FolderContextValue | null>(null);

export function FolderProvider({ children }: { children: ReactNode }) {
  const [customFolders, setCustomFolders] = useState<Folder[]>([]);

  const folders = useMemo(
    () => [...defaultFolders, ...customFolders],
    [customFolders],
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

  return (
    <FolderContext.Provider value={{ folders, addFolder }}>
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
