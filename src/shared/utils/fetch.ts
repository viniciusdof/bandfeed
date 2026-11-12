export const BROWSER_HEADERS = {
	"User-Agent":
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
	Accept:
		"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
	"Accept-Language": "en-US,en;q=0.5",
};

export async function fetchBandcampPage(url: string): Promise<Response> {
	const res = await fetch(url, { method: "POST", headers: BROWSER_HEADERS });
	if (!res.ok) throw new Error(`Bandcamp returned ${res.status}`);

	const html = await res.text();
	if (html.includes("<title>Client Challenge</title>")) {
		throw new Error("Bandcamp blocked the request with a bot challenge");
	}

	return new Response(html, res);
}
