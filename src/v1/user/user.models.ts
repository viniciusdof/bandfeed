export interface BandcampItemRaw {
	item_id: number;
	item_type: string;
	item_title: string;
	band_name: string;
	item_url: string;
	item_art_id: number | null;
	released?: string;
	purchased?: string;
}

export interface UserBlobRaw {
	fan_data: {
		fan_id: number;
		name: string | null;
		username: string;
		trackpipe_url: string;
		location: string | null;
		website_url: string | null;
	};
	collection_data: {
		last_token: string | null;
	};
	wishlist_data: {
		last_token: string | null;
	};
	item_cache: {
		collection: Record<string, BandcampItemRaw>;
		wishlist: Record<string, BandcampItemRaw>;
	};
}
