import Link from "next/link";

export default function Header() {
  return (
    <header className="app-header">
      <Link className="logo" href="/">
        한입 링크
      </Link>
      <Link className="new-link-button" href="/new">
        + 새 링크
      </Link>
    </header>
  );
}
