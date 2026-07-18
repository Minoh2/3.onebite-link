"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useFolders } from "./FolderProvider";

export default function NewLinkForm() {
  const router = useRouter();
  const { folders, addLink } = useFolders();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const isSubmittingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setError("");
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const url = String(formData.get("url") ?? "");
    const folderId = String(formData.get("folder") ?? "");
    const folder = folders.find((item) => item.id === folderId);

    try {
      if (!folder) throw new Error("폴더를 선택해 주세요.");

      const response = await fetch("/api/open-graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "링크 정보를 불러오지 못했습니다.");
      }

      const wasAdded = await addLink({
        id: "",
        ...data,
        folderId: folder.id,
        folder: folder.name,
      });
      if (!wasAdded) throw new Error("링크를 저장하지 못했습니다.");

      router.push("/");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "링크를 저장하지 못했습니다.",
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSaving(false);
    }
  }

  return (
    <section className="min-w-0">
      <div className="mb-12">
        <div>
          <p className="mb-2 text-sm leading-[1.4] text-[var(--text-sub)]">New Link</p>
          <h1 className="text-[40px] font-semibold leading-[1.1] tracking-[-0.5px] max-[520px]:text-[34px]">새 링크 저장</h1>
        </div>
      </div>
      <form className="flex max-w-[680px] flex-col gap-5 rounded-xl bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2" htmlFor="link-url">
          <span className="text-sm font-medium text-[var(--text)]">링크 주소</span>
          <input
            className="form-control-focus min-h-12 w-full rounded-[10px] border border-[var(--border)] bg-[var(--background)] px-4 text-[17px] text-[var(--text)] transition-[border-color,box-shadow] duration-300"
            id="link-url"
            name="url"
            placeholder="https://example.com"
            disabled={isSaving}
            type="url"
            required
          />
        </label>
        <label className="flex flex-col gap-2" htmlFor="folder">
          <span className="text-sm font-medium text-[var(--text)]">폴더</span>
          <select className="form-control-focus min-h-12 w-full rounded-[10px] border border-[var(--border)] bg-[var(--background)] px-4 text-[17px] text-[var(--text)] transition-[border-color,box-shadow] duration-300" disabled={isSaving} id="folder" name="folder" defaultValue="">
            <option value="" disabled>
              폴더를 선택하세요
            </option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </label>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <button className="save-button-hover mt-1 min-h-12 self-start rounded-[980px] bg-[var(--accent)] px-6 text-[17px] font-medium text-white disabled:cursor-wait disabled:opacity-60" disabled={isSaving} type="submit">
          {isSaving ? "정보 확인 중..." : "확인"}
        </button>
      </form>
    </section>
  );
}
