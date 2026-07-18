"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { createClient } from "../../utils/supabase/client";

function getSignupErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("already registered")) {
    return "이미 가입된 이메일입니다.";
  }
  if (normalizedMessage.includes("valid email")) {
    return "올바른 이메일 주소를 입력해 주세요.";
  }
  if (normalizedMessage.includes("password") && normalizedMessage.includes("least")) {
    return "비밀번호는 6자 이상 입력해 주세요.";
  }
  if (normalizedMessage.includes("rate limit")) {
    return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
  }

  return "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.";
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const canSubmit =
    email.trim() !== "" &&
    password !== "" &&
    passwordConfirm !== "" &&
    !isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isSubmittingRef.current) return;

    setError("");

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (signupError) {
        setError(getSignupErrorMessage(signupError.message));
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--surface)] px-6 py-16">
      {error && (
        <div
          className="fixed left-1/2 top-5 z-50 w-[calc(100%-3rem)] max-w-[420px] -translate-x-1/2 rounded-xl bg-[var(--error)] px-5 py-4 text-center text-sm font-medium text-white shadow-[0_10px_30px_rgba(215,0,21,0.24)]"
          role="alert"
        >
          {error}
        </div>
      )}

      <section className="w-full max-w-[420px] rounded-2xl bg-[var(--background)] px-8 py-10 shadow-[0_12px_40px_rgba(0,0,0,0.08)] max-[480px]:px-6">
        <Link
          className="block text-center text-2xl font-semibold tracking-[-0.4px]"
          href="/"
        >
          한입 링크
        </Link>

        <form className="mt-10 flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2" htmlFor="signup-email">
            <span className="text-sm font-medium">이메일</span>
            <input
              autoComplete="email"
              className="form-control-focus min-h-12 rounded-[10px] border border-[var(--border)] bg-[var(--background)] px-4 text-[17px]"
              disabled={isSubmitting}
              id="signup-email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
              type="email"
              value={email}
            />
          </label>

          <label className="flex flex-col gap-2" htmlFor="signup-password">
            <span className="text-sm font-medium">비밀번호</span>
            <input
              autoComplete="new-password"
              className="form-control-focus min-h-12 rounded-[10px] border border-[var(--border)] bg-[var(--background)] px-4 text-[17px]"
              disabled={isSubmitting}
              id="signup-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              type="password"
              value={password}
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
              disabled={isSubmitting}
              id="signup-password-confirm"
              name="passwordConfirm"
              onChange={(event) => setPasswordConfirm(event.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              required
              type="password"
              value={passwordConfirm}
            />
          </label>

          <button
            className="save-button-hover mt-2 min-h-12 rounded-[980px] bg-[var(--accent)] px-6 text-[17px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!canSubmit}
            type="submit"
          >
            {isSubmitting ? "가입 중..." : "회원가입"}
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
