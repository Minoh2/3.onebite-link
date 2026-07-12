import { isIP } from "node:net";

type OpenGraphData = {
  title: string;
  description: string;
  thumbnail?: string;
  url: string;
};

function decodeHtml(value: string) {
  const entities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    quot: '"',
  };

  return value.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, entity: string) => {
    if (entity.startsWith("#x")) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    if (entity.startsWith("#")) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    return entities[entity.toLowerCase()] ?? match;
  });
}

function getAttributes(tag: string) {
  const attributes = new Map<string, string>();
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    attributes.set(match[1].toLowerCase(), decodeHtml(match[2] ?? match[3] ?? match[4] ?? ""));
  }
  return attributes;
}

function getMeta(html: string, key: string) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = getAttributes(match[0]);
    if ((attributes.get("property") ?? attributes.get("name"))?.toLowerCase() === key) {
      return attributes.get("content")?.trim();
    }
  }
}

function isPrivateAddress(hostname: string) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host === "0.0.0.0") return true;
  if (isIP(host) === 4) {
    const [a, b] = host.split(".").map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
  }
  return isIP(host) === 6 && (host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80:"));
}

function normalizeUrl(value: string) {
  const url = new URL(value.trim());
  if (!['http:', 'https:'].includes(url.protocol) || isPrivateAddress(url.hostname)) {
    throw new Error("공개된 http 또는 https 링크를 입력해 주세요.");
  }
  return url;
}

async function extractOpenGraph(rawUrl: string): Promise<OpenGraphData> {
  const requestedUrl = normalizeUrl(rawUrl);
  const response = await fetch(requestedUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; OneBiteLink/1.0)" },
    redirect: "follow",
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) throw new Error("페이지를 불러오지 못했습니다.");
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) throw new Error("HTML 페이지 링크만 저장할 수 있습니다.");

  const html = (await response.text()).slice(0, 1_000_000);
  const finalUrl = normalizeUrl(response.url || requestedUrl.href);
  const titleTag = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const title = getMeta(html, "og:title") ?? (titleTag ? decodeHtml(titleTag).trim() : "") ?? finalUrl.hostname;
  const description = getMeta(html, "og:description") ?? getMeta(html, "description") ?? "설명이 제공되지 않은 링크입니다.";
  const canonicalUrl = new URL(getMeta(html, "og:url") ?? finalUrl.href, finalUrl).href;
  const image = getMeta(html, "og:image") ?? getMeta(html, "twitter:image");

  return {
    title: title || finalUrl.hostname,
    description,
    thumbnail: image ? new URL(image, finalUrl).href : undefined,
    url: canonicalUrl,
  };
}

async function respond(url: unknown) {
  if (typeof url !== "string" || !url.trim()) {
    return Response.json({ error: "링크 주소를 입력해 주세요." }, { status: 400 });
  }
  try {
    return Response.json(await extractOpenGraph(url));
  } catch (error) {
    const message = error instanceof Error ? error.message : "링크 정보를 추출하지 못했습니다.";
    return Response.json({ error: message }, { status: 422 });
  }
}

export async function GET(request: Request) {
  return respond(new URL(request.url).searchParams.get("url"));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return respond(body.url);
  } catch {
    return Response.json({ error: "올바른 JSON 요청이 아닙니다." }, { status: 400 });
  }
}
