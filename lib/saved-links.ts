"use client";

import { useSyncExternalStore } from "react";
import { links as defaultLinks, type Bookmark } from "./bookmarks";

const STORAGE_KEY = "onebite-link:links-v2";
const LEGACY_STORAGE_KEY = "onebite-link:saved-links";
const CHANGE_EVENT = "onebite-link:saved-links-change";
const SERVER_LINKS: Bookmark[] = defaultLinks;

let cachedValue: Bookmark[] | null = null;
let cachedJson: string | null = null;

function readLinks() {
  const json = window.localStorage.getItem(STORAGE_KEY);
  if (cachedValue && json === cachedJson) return cachedValue;

  try {
    const legacyJson = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    const value: unknown = json
      ? JSON.parse(json)
      : legacyJson
        ? [...JSON.parse(legacyJson), ...defaultLinks]
        : defaultLinks;
    cachedValue = Array.isArray(value)
      ? value.filter(
          (link): link is Bookmark =>
            typeof link === "object" &&
            link !== null &&
            typeof (link as Bookmark).id === "string" &&
            typeof (link as Bookmark).title === "string" &&
            typeof (link as Bookmark).url === "string" &&
            typeof (link as Bookmark).folderId === "string",
        )
      : [];
  } catch {
    cachedValue = [];
  }

  cachedJson = json;
  return cachedValue;
}

function subscribe(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

export function useSavedLinks() {
  return useSyncExternalStore(subscribe, readLinks, () => SERVER_LINKS);
}

export function saveLink(link: Bookmark) {
  const links = [link, ...readLinks().filter((item) => item.url !== link.url)];
  const json = JSON.stringify(links);
  window.localStorage.setItem(STORAGE_KEY, json);
  cachedValue = links;
  cachedJson = json;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function updateSavedLink(link: Bookmark) {
  writeLinks(readLinks().map((item) => (item.id === link.id ? link : item)));
}

export function deleteSavedLink(id: string) {
  writeLinks(readLinks().filter((item) => item.id !== id));
}

function writeLinks(links: Bookmark[]) {
  const json = JSON.stringify(links);
  window.localStorage.setItem(STORAGE_KEY, json);
  cachedValue = links;
  cachedJson = json;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
