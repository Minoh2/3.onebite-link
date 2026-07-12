import Header from "../components/Header";
import LinkGrid from "../components/LinkGrid";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="mx-auto grid w-full max-w-[920px] grid-cols-[176px_minmax(0,680px)] gap-16 px-6 pb-20 pt-14 max-[800px]:grid-cols-1 max-[800px]:gap-10 max-[800px]:pt-8">
        <Sidebar />
        <LinkGrid />
      </main>
    </div>
  );
}
