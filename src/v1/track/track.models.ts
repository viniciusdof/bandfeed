import type { RawBandcampAlbum, TrackData } from "../album/album.models";

export interface TrackPageData extends TrackData {
	artist: string;
	albumTitle: string | null;
	albumUrl: string | null;
	img: string | null;
	releaseDate: string | null;
	description: string | null;
	lyrics: string | null;
	credits: string | null;
	tags: string[];
}

export interface RawBandcampEmbed {
	album_title?: string;
	linkback?: string;
}

export type { RawBandcampAlbum };
