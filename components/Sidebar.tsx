"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import AddFolderButton from "./AddFolderButton";
import { useFolders } from "./FolderProvider";

export default function Sidebar() {
  const { folders, updateFolder, deleteFolder } = useFolders();
  const [folderToEdit, setFolderToEdit] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editedName, setEditedName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  function confirmDelete() {
    if (!folderToDelete) return;

    deleteFolder(folderToDelete.id);
    if (pathname === `/folder/${folderToDelete.id}`) {
      router.push("/");
    }
    setFolderToDelete(null);
  }

  function openEditModal(folder: { id: string; name: string }) {
    setFolderToEdit(folder);
    setEditedName(folder.name);
  }

  async function confirmEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!folderToEdit || !editedName.trim() || isEditing) return;

    setIsEditing(true);
    try {
      const wasUpdated = await updateFolder(folderToEdit.id, editedName);
      if (wasUpdated) setFolderToEdit(null);
    } finally {
      setIsEditing(false);
    }
  }

  return (
    <aside className="min-w-0 self-start">
      <Link
        className="primary-button-hover mb-7 flex min-h-11 w-full items-center justify-center rounded-[980px] bg-[var(--accent)] px-5 text-[15px] font-medium text-white max-[800px]:w-fit"
        href="/new"
      >
        + 새 링크
      </Link>
      <div className="mb-2 flex min-h-9 items-center justify-between gap-2 pl-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-sub)]">
          Library
        </p>
        <AddFolderButton />
      </div>
      <Link className="nav-link-hover flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-[var(--text)]" href="/">
        모든 링크
      </Link>
      <nav className="mt-1 flex flex-col gap-1 max-[800px]:grid max-[800px]:grid-cols-2 max-[480px]:grid-cols-1" aria-label="폴더 목록">
        {folders.map((folder) => (
          <div
            className="folder-row-hover flex min-h-10 items-center rounded-lg pr-1"
            key={folder.id}
          >
            <Link
              className="min-w-0 flex-1 truncate px-3 py-2 text-sm text-[var(--text-sub)]"
              href={`/folder/${folder.id}`}
            >
              {folder.name}
            </Link>
            <div className="folder-actions flex w-0 shrink-0 items-center overflow-hidden opacity-0 max-[800px]:w-16 max-[800px]:opacity-100">
              <button
                aria-label={`${folder.name} 폴더 수정`}
                className="folder-edit-button flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--text-sub)]"
                onClick={() => openEditModal(folder)}
                title="폴더 수정"
                type="button"
              >
                <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
                  <path d="m4 20 4.2-1 10.6-10.6a2.1 2.1 0 0 0-3-3L5.2 16 4 20Zm10.4-13.2 3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                </svg>
              </button>
              <button
                aria-label={`${folder.name} 폴더 삭제`}
                className="folder-delete-button flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--text-sub)]"
                onClick={() => setFolderToDelete(folder)}
                title="폴더 삭제"
                type="button"
              >
                <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
                  <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </nav>

      {folderToEdit && (
        <div
          aria-labelledby="edit-folder-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6 backdrop-blur-[4px]"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setFolderToEdit(null);
          }}
          role="dialog"
        >
          <form
            className="w-full max-w-[420px] rounded-2xl bg-[var(--background)] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.16)]"
            onSubmit={confirmEdit}
          >
            <h2 className="text-2xl font-semibold leading-[1.2] tracking-[-0.3px]" id="edit-folder-title">
              폴더 이름 수정
            </h2>
            <label className="mt-6 flex flex-col gap-2" htmlFor="edit-folder-name">
              <span className="text-sm font-medium">폴더 이름</span>
              <input
                autoFocus
                className="form-control-focus min-h-12 w-full rounded-[10px] border border-[var(--border)] bg-[var(--background)] px-4 text-[17px] text-[var(--text)]"
                disabled={isEditing}
                id="edit-folder-name"
                maxLength={30}
                onChange={(event) => setEditedName(event.target.value)}
                value={editedName}
              />
            </label>
            <div className="mt-7 flex justify-end gap-2">
              <button className="nav-link-hover min-h-11 rounded-[980px] px-5 text-[15px] font-medium" disabled={isEditing} onClick={() => setFolderToEdit(null)} type="button">
                취소
              </button>
              <button className="save-button-hover min-h-11 rounded-[980px] bg-[var(--accent)] px-5 text-[15px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-30" disabled={!editedName.trim() || isEditing} type="submit">
                {isEditing ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      )}

      {folderToDelete && (
        <div
          aria-labelledby="delete-folder-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6 backdrop-blur-[4px]"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setFolderToDelete(null);
          }}
          role="alertdialog"
        >
          <div className="w-full max-w-[420px] rounded-2xl bg-[var(--background)] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
            <h2
              className="text-2xl font-semibold leading-[1.2] tracking-[-0.3px]"
              id="delete-folder-title"
            >
              폴더를 삭제할까요?
            </h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-[var(--text-sub)]">
              ‘{folderToDelete.name}’ 폴더가 사이드바에서 삭제됩니다.
            </p>
            <div className="mt-7 flex justify-end gap-2">
              <button
                className="nav-link-hover min-h-11 rounded-[980px] px-5 text-[15px] font-medium"
                onClick={() => setFolderToDelete(null)}
                type="button"
              >
                취소
              </button>
              <button
                className="danger-button-hover min-h-11 rounded-[980px] bg-[var(--error)] px-5 text-[15px] font-medium text-white"
                onClick={confirmDelete}
                type="button"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
