import { allLectures } from "contentlayer/generated";

export const baseUrl = 'https://example.vercel.app';

export default async function sitemap() {
  const lectures = allLectures.map((lecture) => ({
    url: `${baseUrl}/lectures/${lecture.slug}`,
    lastModified: lecture.publishedAt,
  }));

  const routes = ['', '/lectures'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));
  
  return [...routes, ...lectures];
}
