import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--surface)] px-6 py-16">
      <section className="w-full max-w-[420px] rounded-2xl bg-[var(--background)] px-8 py-10 shadow-[0_12px_40px_rgba(0,0,0,0.08)] max-[480px]:px-6">
        <Link
          className="block text-center text-2xl font-semibold tracking-[-0.4px]"
          href="/"
        >
          한입 링크
        </Link>

        <form className="mt-10 flex flex-col gap-5">
          <label className="flex flex-col gap-2" htmlFor="signup-email">
            <span className="text-sm font-medium">이메일</span>
            <input
              autoComplete="email"
              className="form-control-focus min-h-12 rounded-[10px] border border-[var(--border)] bg-[var(--background)] px-4 text-[17px]"
              id="signup-email"
              name="email"
              placeholder="name@example.com"
              type="email"
            />
          </label>

          <label className="flex flex-col gap-2" htmlFor="signup-password">
            <span className="text-sm font-medium">비밀번호</span>
            <input
              autoComplete="new-password"
              className="form-control-focus min-h-12 rounded-[10px] border border-[var(--border)] bg-[var(--background)] px-4 text-[17px]"
              id="signup-password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              type="password"
            />
          </label>

          <label
            className="flex flex-col gap-2"
            htmlFor="signup-password-confirm"
          >
            <span className="text-sm font-medium">비밀번호 확인</span>
            <input
              autoComplete="new-password"
              className="form-control-focus min-h-12 rounded-[10px] border border-[var(--border)] bg-[var(--background)] px-4 text-[17px]"
              id="signup-password-confirm"
              name="passwordConfirm"
              placeholder="비밀번호를 다시 입력하세요"
              type="password"
            />
          </label>

          <button
            className="save-button-hover mt-2 min-h-12 rounded-[980px] bg-[var(--accent)] px-6 text-[17px] font-medium text-white"
            type="button"
          >
            회원가입
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-sub)]">
          이미 계정이 있나요?{" "}
          <Link className="font-medium text-[var(--accent)]" href="/login">
            로그인
          </Link>
        </p>
      </section>
    </main>
  );
}
