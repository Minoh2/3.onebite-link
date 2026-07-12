"use client";

import { useState, type FormEvent } from "react";
import { useFolders } from "./FolderProvider";

type LinkCardProps = {
  id: string;
  title: string;
  url: string;
  description: string;
  folderId: string;
  folder: string;
  thumbnail?: string;
};

export default function LinkCard(link: LinkCardProps) {
  const { folders, updateLink, deleteLink } = useFolders();
  const [modal, setModal] = useState<"edit" | "delete" | null>(null);

  function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const folderId = String(formData.get("folderId"));
    const folder = folders.find((item) => item.id === folderId);
    if (!folder) return;

    updateLink({
      ...link,
      folderId,
      folder: folder.name,
      title: String(formData.get("title")).trim(),
      description: String(formData.get("description")).trim(),
    });
    setModal(null);
  }

  return (
    <>
      <article className="link-card-hover group relative min-h-[210px] overflow-hidden rounded-xl bg-[var(--surface)] shadow-[var(--card-shadow)]">
        <div className="absolute right-3 top-3 z-[1] flex gap-1 rounded-full bg-white/90 p-1 opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 max-[800px]:opacity-100">
          <button aria-label={`${link.title} 링크 수정`} className="card-action-button flex size-8 items-center justify-center rounded-full text-[var(--text-sub)]" onClick={() => setModal("edit")} title="링크 수정" type="button">
            <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16"><path d="m4 20 4.2-1 10.6-10.6a2.1 2.1 0 0 0-3-3L5.2 16 4 20Zm10.4-13.2 3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>
          </button>
          <button aria-label={`${link.title} 링크 삭제`} className="card-action-button card-delete-button flex size-8 items-center justify-center rounded-full text-[var(--text-sub)]" onClick={() => setModal("delete")} title="링크 삭제" type="button">
            <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>
          </button>
        </div>
        {link.thumbnail && <div aria-label={`${link.title} 썸네일`} className="aspect-[16/9] w-full bg-[var(--surface-hover)] bg-cover bg-center" role="img" style={{ backgroundImage: `url(${JSON.stringify(link.thumbnail)})` }} />}
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <span className="rounded-[980px] bg-[var(--surface-hover)] px-3 py-1 text-[13px] leading-[1.4] text-[var(--text)]">{link.folder}</span>
            <span className="truncate text-[13px] leading-[1.4] text-[var(--text-sub)]">{link.url}</span>
          </div>
          <h2 className="mb-3 text-2xl font-semibold leading-[1.2] tracking-[-0.3px]">{link.title}</h2>
          <p className="text-[15px] leading-[1.5] text-[var(--text-sub)]">{link.description}</p>
        </div>
      </article>

      {modal === "edit" && (
        <div aria-labelledby={`edit-link-${link.id}`} aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6 backdrop-blur-[4px]" onMouseDown={(event) => event.currentTarget === event.target && setModal(null)} role="dialog">
          <form className="w-full max-w-[480px] rounded-2xl bg-[var(--background)] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.16)]" onSubmit={submitEdit}>
            <h2 className="text-2xl font-semibold" id={`edit-link-${link.id}`}>링크 수정</h2>
            <label className="mt-6 flex flex-col gap-2"><span className="text-sm font-medium">폴더</span><select className="form-control-focus min-h-12 rounded-[10px] border border-[var(--border)] bg-white px-4" defaultValue={link.folderId} name="folderId">{folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}</select></label>
            <label className="mt-4 flex flex-col gap-2"><span className="text-sm font-medium">제목</span><input className="form-control-focus min-h-12 rounded-[10px] border border-[var(--border)] px-4" defaultValue={link.title} name="title" required /></label>
            <label className="mt-4 flex flex-col gap-2"><span className="text-sm font-medium">설명</span><textarea className="form-control-focus min-h-28 resize-y rounded-[10px] border border-[var(--border)] p-4" defaultValue={link.description} name="description" required /></label>
            <div className="mt-7 flex justify-end gap-2"><button className="nav-link-hover min-h-11 rounded-full px-5" onClick={() => setModal(null)} type="button">취소</button><button className="save-button-hover min-h-11 rounded-full bg-[var(--accent)] px-5 text-white" type="submit">저장</button></div>
          </form>
        </div>
      )}

      {modal === "delete" && (
        <div aria-labelledby={`delete-link-${link.id}`} aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6 backdrop-blur-[4px]" onMouseDown={(event) => event.currentTarget === event.target && setModal(null)} role="alertdialog">
          <div className="w-full max-w-[420px] rounded-2xl bg-[var(--background)] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
            <h2 className="text-2xl font-semibold" id={`delete-link-${link.id}`}>링크를 삭제할까요?</h2>
            <p className="mt-3 text-[15px] text-[var(--text-sub)]">‘{link.title}’ 링크가 보관함에서 삭제됩니다.</p>
            <div className="mt-7 flex justify-end gap-2"><button className="nav-link-hover min-h-11 rounded-full px-5" onClick={() => setModal(null)} type="button">취소</button><button className="danger-button-hover min-h-11 rounded-full bg-[var(--error)] px-5 text-white" onClick={() => deleteLink(link.id)} type="button">삭제</button></div>
          </div>
        </div>
      )}
    </>
  );
}
