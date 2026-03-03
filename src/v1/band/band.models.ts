export interface BandData {
	name: string;
	url: string;
	location: string | null;
	bio: string | null;
	websites: string[];
}

export interface ReleaseData {
	title: string;
	artist: string;
	link: string;
	img: string | null;
}

export interface RawBandcampBand {
	name?: string;
	url?: string;
	location?: string;
	bio?: string;
	website?: string;
}
