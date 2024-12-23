import { baseUrl } from '@app/sitemap';
import { siteConfig } from '@shared/config/site';
import { allLectures } from 'contentlayer/generated';

export async function GET() {
  const itemsXml = allLectures
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(
      (lecture) =>
        `<item>
          <title>${lecture.title}</title>
          <link>${baseUrl}/lectures/${lecture.slug}</link>
          <description>${lecture.description || ''}</description>
          <pubDate>${new Date(lecture.publishedAt).toUTCString()}</pubDate>
        </item>`,
    )
    .join('\n');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>${siteConfig.name}</title>
        <link>${baseUrl}</link>
        <description>${siteConfig.description}</description>
        ${itemsXml}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
