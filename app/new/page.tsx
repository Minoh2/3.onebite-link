import Header from "../../components/Header";
import NewLinkForm from "../../components/NewLinkForm";
import Sidebar from "../../components/Sidebar";

export default function NewLinkPage() {
  return (
    <div className="bookmark-app">
      <Header />
      <main className="content-layout">
        <Sidebar />
        <NewLinkForm />
      </main>
    </div>
  );
}
