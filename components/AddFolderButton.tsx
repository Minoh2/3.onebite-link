"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useFolders } from "./FolderProvider";

export default function AddFolderButton() {
  const { addFolder } = useFolders();
  const [isOpen, setIsOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  function closeModal() {
    setFolderName("");
    setIsOpen(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!folderName.trim()) return;
    addFolder(folderName);
    closeModal();
  }

  return (
    <>
      <button
        className="nav-link-hover min-h-8 shrink-0 rounded-[980px] px-3 text-xs font-medium text-[var(--accent)]"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        + 새 폴더
      </button>

      {isOpen && (
        <div
          aria-labelledby="folder-modal-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6 backdrop-blur-[4px]"
          role="dialog"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) closeModal();
          }}
        >
          <form
            className="w-full max-w-[420px] rounded-2xl bg-[var(--background)] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.16)]"
            onSubmit={handleSubmit}
          >
            <h2
              className="text-2xl font-semibold leading-[1.2] tracking-[-0.3px]"
              id="folder-modal-title"
            >
              새 폴더
            </h2>
            <p className="mt-2 text-sm leading-[1.5] text-[var(--text-sub)]">
              링크를 정리할 새로운 폴더 이름을 입력하세요.
            </p>
            <label className="mt-6 flex flex-col gap-2" htmlFor="folder-name">
              <span className="text-sm font-medium">폴더 이름</span>
              <input
                className="form-control-focus min-h-12 w-full rounded-[10px] border border-[var(--border)] bg-[var(--background)] px-4 text-[17px] text-[var(--text)] transition-[border-color,box-shadow] duration-300"
                id="folder-name"
                maxLength={30}
                onChange={(event) => setFolderName(event.target.value)}
                placeholder="예: 공부 자료"
                ref={inputRef}
                value={folderName}
              />
            </label>
            <div className="mt-7 flex justify-end gap-2">
              <button
                className="nav-link-hover min-h-11 rounded-[980px] px-5 text-[15px] font-medium text-[var(--text)]"
                onClick={closeModal}
                type="button"
              >
                취소
              </button>
              <button
                className="save-button-hover min-h-11 rounded-[980px] bg-[var(--accent)] px-5 text-[15px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-30"
                disabled={!folderName.trim()}
                type="submit"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
