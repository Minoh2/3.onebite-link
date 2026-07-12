const folders = ["읽을거리", "개발", "디자인", "마케팅", "개인 자료"];

export default function NewLinkForm() {
  return (
    <section className="min-w-0">
      <div className="mb-12">
        <div>
          <p className="mb-2 text-sm leading-[1.4] text-[var(--text-sub)]">New Link</p>
          <h1 className="text-[40px] font-semibold leading-[1.1] tracking-[-0.5px] max-[520px]:text-[34px]">새 링크 저장</h1>
        </div>
      </div>
      <form className="flex max-w-[680px] flex-col gap-5 rounded-xl bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
        <label className="flex flex-col gap-2" htmlFor="link-url">
          <span className="text-sm font-medium text-[var(--text)]">링크 주소</span>
          <input
            className="form-control-focus min-h-12 w-full rounded-[10px] border border-[var(--border)] bg-[var(--background)] px-4 text-[17px] text-[var(--text)] transition-[border-color,box-shadow] duration-300"
            id="link-url"
            name="url"
            placeholder="https://example.com"
            type="url"
          />
        </label>
        <label className="flex flex-col gap-2" htmlFor="folder">
          <span className="text-sm font-medium text-[var(--text)]">폴더</span>
          <select className="form-control-focus min-h-12 w-full rounded-[10px] border border-[var(--border)] bg-[var(--background)] px-4 text-[17px] text-[var(--text)] transition-[border-color,box-shadow] duration-300" id="folder" name="folder" defaultValue="">
            <option value="" disabled>
              폴더를 선택하세요
            </option>
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </label>
        <button className="save-button-hover mt-1 min-h-12 self-start rounded-[980px] bg-[var(--accent)] px-6 text-[17px] font-medium text-white" type="submit">
          저장
        </button>
      </form>
    </section>
  );
}
