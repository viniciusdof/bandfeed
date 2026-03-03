export interface TrackData {
	title: string;
	number: number;
	duration: number | null;
	url: string | null;
}

export interface AlbumData {
	title: string;
	artist: string;
	url: string;
	img: string | null;
	releaseDate: string | null;
	description: string | null;
	tracks: TrackData[];
	tags: string[];
}

export interface RawBandcampTrack {
	title: string;
	track_num: number;
	duration: number | null;
	lyrics: string | null;
	file?: {
		"mp3-128": string;
	};
}

export interface RawBandcampAlbum {
	current: {
		title: string;
		release_date: string | null;
		about: string | null;
		credits: string | null;
	};
	artist: string;
	trackinfo: RawBandcampTrack[];
}
