import { decodeHTML } from "../../shared/utils/html";
import type { AlbumData, RawBandcampAlbum } from "./album.models";

export async function fetchAlbumData(
	subdomain: string,
	slug: string,
): Promise<AlbumData> {
	const url = `https://${subdomain}.bandcamp.com/album/${slug}`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Bandcamp returned ${res.status}`);

	const state: {
		rawAlbum: RawBandcampAlbum | null;
		img: string | null;
		tags: string[];
	} = {
		rawAlbum: null,
		img: null,
		tags: [],
	};

	const rewriter = new HTMLRewriter()
		.on("script[data-tralbum]", {
			element(el) {
				const attr = el.getAttribute("data-tralbum");
				if (attr) {
					try {
						state.rawAlbum = JSON.parse(decodeHTML(attr)) as RawBandcampAlbum;
					} catch (_e) {
						console.error("Failed to parse data-tralbum JSON");
					}
				}
			},
		})
		.on("#tralbumArt img", {
			element(el) {
				const src = el.getAttribute("src");
				if (src) {
					state.img = src.replace(/_[0-9]+\.jpg$/, "_10.jpg");
				}
			},
		})
		.on(".tag", {
			text(t) {
				const tag = t.text.trim();
				if (tag && !state.tags.includes(tag)) {
					state.tags.push(tag);
				}
			},
		});

	await rewriter.transform(res).arrayBuffer();

	if (!state.rawAlbum) throw new Error("Could not find album data on page");

	return {
		title: state.rawAlbum.current.title,
		artist: state.rawAlbum.artist,
		url,
		img: state.img,
		releaseDate: state.rawAlbum.current.release_date,
		description: state.rawAlbum.current.about,
		tags: state.tags,
		tracks: state.rawAlbum.trackinfo.map((t) => ({
			title: t.title,
			number: t.track_num,
			duration: t.duration,
			url: t.file?.["mp3-128"] || null,
		})),
	};
}
