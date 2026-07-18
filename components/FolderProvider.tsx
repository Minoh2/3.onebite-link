"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Bookmark } from "../lib/bookmarks";
import { createClient } from "../utils/supabase/client";

type Folder = {
  id: string;
  name: string;
};

type FolderContextValue = {
  folders: Folder[];
  links: Bookmark[];
  addLink: (link: Bookmark) => Promise<boolean>;
  updateLink: (link: Bookmark) => Promise<boolean>;
  deleteLink: (id: string) => void;
  addFolder: (name: string) => Promise<boolean>;
  updateFolder: (id: string, name: string) => Promise<boolean>;
  deleteFolder: (id: string) => Promise<boolean>;
};

const FolderContext = createContext<FolderContextValue | null>(null);

export function FolderProvider({ children }: { children: ReactNode }) {
  const [savedLinks, setSavedLinks] = useState<Bookmark[]>([]);
  const [savedFolders, setSavedFolders] = useState<Folder[]>([]);
  const [deletedFolderIds, setDeletedFolderIds] = useState<string[]>([]);
  const [folderNameOverrides, setFolderNameOverrides] = useState<
    Record<string, string>
  >({});
  const isAddingFolderRef = useRef(false);
  const isAddingLinkRef = useRef(false);

  useEffect(() => {
    let isActive = true;

    async function loadFolders() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("folders")
        .select("id, name")
        .order("created_at", { ascending: true })
        .order("id", { ascending: true });

      if (error) {
        console.error("폴더 목록을 불러오지 못했습니다.", error);
        return;
      }

      if (isActive) {
        setSavedFolders(
          data.map((folder) => ({
            id: String(folder.id),
            name: folder.name,
          })),
        );
      }
    }

    async function loadLinks() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("links")
        .select(
          "id, url, title, description, thumbnail_url, folder_id",
        )
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });

      if (error) {
        console.error("링크 목록을 불러오지 못했습니다.", error);
        return;
      }

      if (isActive) {
        setSavedLinks(
          data.map((link) => ({
            id: String(link.id),
            url: link.url,
            title: link.title ?? link.url,
            description: link.description ?? "",
            thumbnail: link.thumbnail_url ?? undefined,
            folderId:
              link.folder_id === null ? "" : String(link.folder_id),
            folder: "",
          })),
        );
      }
    }

    void loadFolders();
    void loadLinks();

    return () => {
      isActive = false;
    };
  }, []);

  const folders = useMemo(
    () =>
      savedFolders
        .filter((folder) => !deletedFolderIds.includes(folder.id))
        .map((folder) => ({
          ...folder,
          name: folderNameOverrides[folder.id] ?? folder.name,
        })),
    [savedFolders, deletedFolderIds, folderNameOverrides],
  );

  const links = useMemo(
    () =>
      savedLinks
        .filter((link) => folders.some((folder) => folder.id === link.folderId))
        .map((link) => ({
          ...link,
          folder:
            folders.find((folder) => folder.id === link.folderId)?.name ??
            link.folder,
        })),
    [folders, savedLinks],
  );

  async function addLink(link: Bookmark) {
    if (isAddingLinkRef.current) return false;

    isAddingLinkRef.current = true;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("links")
        .insert({
          url: link.url,
          title: link.title,
          description: link.description,
          thumbnail_url: link.thumbnail ?? null,
          folder_id: Number(link.folderId),
        })
        .select("id, url, title, description, thumbnail_url, folder_id")
        .single();

      if (error) {
        console.error("링크를 추가하지 못했습니다.", error);
        return false;
      }

      setSavedLinks((links) => [
        {
          id: String(data.id),
          url: data.url,
          title: data.title ?? data.url,
          description: data.description ?? "",
          thumbnail: data.thumbnail_url ?? undefined,
          folderId: String(data.folder_id),
          folder: link.folder,
        },
        ...links,
      ]);
      return true;
    } finally {
      isAddingLinkRef.current = false;
    }
  }

  async function updateLink(link: Bookmark) {
    const supabase = createClient();
    const { error } = await supabase
      .from("links")
      .update({
        title: link.title,
        description: link.description,
        folder_id: Number(link.folderId),
      })
      .eq("id", link.id);

    if (error) {
      console.error("링크를 수정하지 못했습니다.", error);
      return false;
    }

    setSavedLinks((links) =>
      links.map((item) => (item.id === link.id ? link : item)),
    );
    return true;
  }

  function deleteLink(id: string) {
    setSavedLinks((links) => links.filter((link) => link.id !== id));
  }

  async function addFolder(name: string) {
    const normalizedName = name.trim();
    if (!normalizedName || isAddingFolderRef.current) return false;

    isAddingFolderRef.current = true;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("folders")
        .insert({ name: normalizedName })
        .select("id, name")
        .single();

      if (error) {
        console.error("폴더를 추가하지 못했습니다.", error);
        return false;
      }

      setSavedFolders((folders) => [
        ...folders,
        { id: String(data.id), name: data.name },
      ]);
      return true;
    } finally {
      isAddingFolderRef.current = false;
    }
  }

  async function updateFolder(id: string, name: string) {
    const normalizedName = name.trim();
    if (!normalizedName) return false;

    const supabase = createClient();
    const { error } = await supabase
      .from("folders")
      .update({ name: normalizedName })
      .eq("id", id);

    if (error) {
      console.error("폴더 이름을 수정하지 못했습니다.", error);
      return false;
    }

    setFolderNameOverrides((names) => ({
      ...names,
      [id]: normalizedName,
    }));
    return true;
  }

  async function deleteFolder(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("folders").delete().eq("id", id);

    if (error) {
      console.error("폴더를 삭제하지 못했습니다.", error);
      return false;
    }

    setSavedFolders((folders) =>
      folders.filter((folder) => folder.id !== id),
    );
    setDeletedFolderIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
    return true;
  }

  return (
    <FolderContext.Provider
      value={{
        folders,
        links,
        addLink,
        updateLink,
        deleteLink,
        addFolder,
        updateFolder,
        deleteFolder,
      }}
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
