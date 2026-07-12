const folders = ["읽을거리", "개발", "디자인", "마케팅", "개인 자료"];

export default function NewLinkForm() {
  return (
    <section className="new-link-section">
      <div className="section-heading">
        <div>
          <p>New Link</p>
          <h1>새 링크 저장</h1>
        </div>
      </div>
      <form className="new-link-form">
        <label className="form-field" htmlFor="link-url">
          <span>링크 주소</span>
          <input
            id="link-url"
            name="url"
            placeholder="https://example.com"
            type="url"
          />
        </label>
        <label className="form-field" htmlFor="folder">
          <span>폴더</span>
          <select id="folder" name="folder" defaultValue="">
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
        <button className="save-button" type="submit">
          저장
        </button>
      </form>
    </section>
  );
}
