export type Bookmark = {
  id: string;
  title: string;
  url: string;
  description: string;
  thumbnail?: string;
  folderId: string;
  folder: string;
};

export const folders = [
  { id: "reading", name: "읽을거리" },
  { id: "dev", name: "개발" },
  { id: "design", name: "디자인" },
  { id: "marketing", name: "마케팅" },
  { id: "personal", name: "개인 자료" },
];

export const links: Bookmark[] = [
  {
    id: "nextjs-docs",
    title: "Next.js Documentation",
    url: "nextjs.org",
    description: "App Router와 배포 흐름을 빠르게 확인할 때 사용하는 공식 문서.",
    folderId: "dev",
    folder: "개발",
  },
  {
    id: "react-reference",
    title: "React Reference",
    url: "react.dev",
    description: "컴포넌트, Hooks, 상태 관리 패턴을 정리해 둔 레퍼런스.",
    folderId: "dev",
    folder: "개발",
  },
  {
    id: "design-systems-repo",
    title: "Design Systems Repo",
    url: "designsystemsrepo.com",
    description: "프로덕트 UI 구조와 컴포넌트 사례를 찾아볼 수 있는 모음.",
    folderId: "design",
    folder: "디자인",
  },
  {
    id: "growth-notes",
    title: "Growth Notes",
    url: "growth.design",
    description: "사용자 경험과 전환율 개선 아이디어를 얻기 좋은 아티클.",
    folderId: "marketing",
    folder: "마케팅",
  },
  {
    id: "frontend-checklist",
    title: "Frontend Checklist",
    url: "frontendchecklist.io",
    description: "릴리즈 전에 접근성, 메타데이터, 성능 항목을 점검하는 링크.",
    folderId: "dev",
    folder: "개발",
  },
  {
    id: "reading-queue",
    title: "Reading Queue",
    url: "pocket.example",
    description: "나중에 읽을 글과 참고 자료를 모아두는 개인 폴더.",
    folderId: "reading",
    folder: "읽을거리",
  },
];

export function getFolder(folderId: string) {
  return folders.find((folder) => folder.id === folderId);
}

export function getLinksByFolder(folderId: string) {
  return links.filter((link) => link.folderId === folderId);
}
