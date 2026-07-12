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
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="mx-auto grid w-full max-w-[920px] grid-cols-[176px_minmax(0,680px)] gap-16 px-6 pb-20 pt-14 max-[800px]:grid-cols-1 max-[800px]:gap-10 max-[800px]:pt-8">
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
