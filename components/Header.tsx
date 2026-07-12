import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex min-h-12 items-center border-b border-[var(--divider)] bg-[rgba(255,255,255,0.72)] px-6 py-2 backdrop-blur-[20px] backdrop-saturate-[180%] max-[480px]:px-4">
      <Link className="text-[17px] font-semibold tracking-[-0.2px]" href="/">
        한입 링크
      </Link>
    </header>
  );
}
