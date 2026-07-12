import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-[var(--divider)] bg-[rgba(255,255,255,0.72)] px-6 backdrop-blur-[20px] backdrop-saturate-[180%]">
      <Link className="text-[17px] font-semibold tracking-[-0.2px]" href="/">
        한입 링크
      </Link>
      <Link className="primary-button-hover inline-flex min-h-8 items-center justify-center rounded-[980px] bg-[var(--accent)] px-4 text-sm font-medium text-white" href="/new">
        + 새 링크
      </Link>
    </header>
  );
}
