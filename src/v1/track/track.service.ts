import { decodeHTML } from "../../shared/utils/html";
import type {
	RawBandcampAlbum,
	RawBandcampEmbed,
	TrackPageData,
} from "./track.models";

export async function fetchTrackData(
	subdomain: string,
	slug: string,
): Promise<TrackPageData> {
	const url = `https://${subdomain}.bandcamp.com/track/${slug}`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Bandcamp returned ${res.status}`);

	const state: {
		rawAlbum: RawBandcampAlbum | null;
		rawEmbed: RawBandcampEmbed | null;
		img: string | null;
		tags: string[];
	} = {
		rawAlbum: null,
		rawEmbed: null,
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
		.on("script[data-embed]", {
			element(el) {
				const attr = el.getAttribute("data-embed");
				if (attr) {
					try {
						state.rawEmbed = JSON.parse(decodeHTML(attr)) as RawBandcampEmbed;
					} catch (_e) {
						console.error("Failed to parse data-embed JSON");
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

	if (!state.rawAlbum || !state.rawAlbum.trackinfo[0]) {
		throw new Error("Could not find track data on page");
	}

	const track = state.rawAlbum.trackinfo[0];

	return {
		title: track.title,
		number: track.track_num,
		duration: track.duration,
		url: track.file?.["mp3-128"] || null,
		artist: state.rawAlbum.artist,
		albumTitle: state.rawEmbed?.album_title || null,
		albumUrl: state.rawEmbed?.linkback || null,
		img: state.img,
		releaseDate: state.rawAlbum.current.release_date,
		description: state.rawAlbum.current.about,
		lyrics: track.lyrics,
		credits: state.rawAlbum.current.credits,
		tags: state.tags,
	};
}
