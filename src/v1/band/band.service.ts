import { decodeHTML } from "../../shared/utils/html";
import type { BandData, RawBandcampBand, ReleaseData } from "./band.models";

export async function fetchBandData(subdomain: string): Promise<{
	band: BandData | null;
	releases: ReleaseData[];
}> {
	const url = `https://${subdomain}.bandcamp.com/music`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Bandcamp returned ${res.status}`);

	const state: {
		rawBand: RawBandcampBand | null;
		releases: ReleaseData[];
		websites: string[];
		currentRelease: ReleaseData | null;
		capturingTitle: boolean;
		capturingArtist: boolean;
	} = {
		rawBand: null,
		releases: [],
		websites: [],
		currentRelease: null,
		capturingTitle: false,
		capturingArtist: false,
	};

	const rewriter = new HTMLRewriter()
		.on("script[data-band]", {
			element(el) {
				const attr = el.getAttribute("data-band");
				if (attr) {
					try {
						state.rawBand = JSON.parse(decodeHTML(attr)) as RawBandcampBand;
					} catch (_e) {
						console.error("Failed to parse data-band JSON");
					}
				}
			},
		})
		.on("#band-links li a", {
			element(el) {
				const href = el.getAttribute("href");
				if (href) state.websites.push(href);
			},
		})
		.on(".music-grid-item", {
			element() {
				state.currentRelease = { title: "", artist: "", link: "", img: "" };
				state.releases.push(state.currentRelease);
			},
		})
		.on(".music-grid-item a", {
			element(el) {
				if (state.currentRelease && !state.currentRelease.link) {
					const path = el.getAttribute("href");
					state.currentRelease.link = path?.startsWith("http")
						? path
						: `https://${subdomain}.bandcamp.com${path}`;
				}
			},
		})
		.on(".music-grid-item img", {
			element(el) {
				if (state.currentRelease) {
					const src = el.getAttribute("src");
					state.currentRelease.img =
						src?.replace(/_[0-9]+\.jpg$/, "_10.jpg") ?? null;
				}
			},
		})
		.on(".music-grid-item .title", {
			element() {
				state.capturingTitle = true;
			},
			text(t) {
				if (state.capturingTitle && state.currentRelease) {
					state.currentRelease.title += t.text;
				}
			},
		})
		.on(".music-grid-item .title", {
			element(el) {
				el.onEndTag(() => {
					state.capturingTitle = false;
				});
			},
		})
		.on(".music-grid-item .artist-override", {
			element() {
				state.capturingArtist = true;
			},
			text(t) {
				if (state.capturingArtist && state.currentRelease) {
					state.currentRelease.artist += t.text;
				}
			},
		})
		.on(".music-grid-item .artist-override", {
			element(el) {
				el.onEndTag(() => {
					state.capturingArtist = false;
				});
			},
		});

	await rewriter.transform(res).arrayBuffer();

	for (const r of state.releases) {
		r.title = r.title.trim();
		const artistName = state.rawBand?.name || "";
		r.artist = r.artist.trim() || artistName;
	}

	const band: BandData | null = state.rawBand
		? {
				name: state.rawBand.name || subdomain,
				url: state.rawBand.url || url,
				location: state.rawBand.location || null,
				bio: state.rawBand.bio || null,
				websites: state.websites,
			}
		: null;

	return { band, releases: state.releases };
}
