export type RSSItem = {
	title: string;
	link: string;
	guid?: string;
	description?: string;
	pubDate?: string;
};

export function generateRSS(
	title: string,
	link: string,
	description: string,
	items: RSSItem[],
) {
	const itemsXml = items
		.map(
			(item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid || item.link}</guid>
      <description><![CDATA[${item.description || ""}]]></description>
      ${item.pubDate ? `<pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>` : ""}
    </item>
  `,
		)
		.join("");

	return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${title}]]></title>
    <link>${link}</link>
    <description><![CDATA[${description}]]></description>
    ${itemsXml}
  </channel>
</rss>`;
}
