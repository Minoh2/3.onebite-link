import Header from "../../../components/Header";
import LinkGrid from "../../../components/LinkGrid";
import Sidebar from "../../../components/Sidebar";
import { getFolder, getLinksByFolder } from "../../../lib/bookmarks";

type FolderPageProps = {
  params: Promise<{
    folderId: string;
  }>;
};

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = await params;
  const folder = getFolder(folderId);
  const folderLinks = getLinksByFolder(folderId);

  return (
    <div className="bookmark-app">
      <Header />
      <main className="content-layout">
        <Sidebar />
        <LinkGrid
          eyebrow="Folder Links"
          title={folder ? `${folder.name} 링크` : "폴더 링크"}
          links={folderLinks}
        />
      </main>
    </div>
  );
}
