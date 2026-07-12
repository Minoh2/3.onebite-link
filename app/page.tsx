import Header from "../components/Header";
import LinkGrid from "../components/LinkGrid";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="bookmark-app">
      <Header />
      <main className="content-layout">
        <Sidebar />
        <LinkGrid />
      </main>
    </div>
  );
}
