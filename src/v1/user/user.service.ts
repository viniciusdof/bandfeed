import { decodeHTML } from "../../shared/utils/html";
import type { BandcampItemRaw, UserBlobRaw } from "./user.models";

const USER_AGENT =
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

export async function fetchUserBlob(username: string): Promise<UserBlobRaw> {
	const url = `https://bandcamp.com/${username}`;
	const res = await fetch(url, {
		headers: {
			"User-Agent": USER_AGENT,
		},
	});
	if (!res.ok) throw new Error(`Bandcamp returned ${res.status}`);

	const state: { blob: UserBlobRaw | null } = { blob: null };

	const rewriter = new HTMLRewriter().on("#pagedata", {
		element(el) {
			const attr = el.getAttribute("data-blob");
			if (attr) {
				try {
					state.blob = JSON.parse(decodeHTML(attr)) as UserBlobRaw;
				} catch (_e) {
					console.error("Failed to parse pagedata blob");
				}
			}
		},
	});

	await rewriter.transform(res).arrayBuffer();

	if (!state.blob) throw new Error("Could not find user data on page");
	return state.blob;
}

interface CollectionItemsResponse {
	items: BandcampItemRaw[];
	last_token: string | null;
	more_available: boolean;
}

export async function fetchAllItems(
	fan_id: number,
	initialItems: BandcampItemRaw[],
	initialToken: string | null,
	type: "collection" | "wishlist",
): Promise<BandcampItemRaw[]> {
	const allItems = [...initialItems];
	let lastToken = initialToken;
	let moreAvailable = !!initialToken;

	const endpoint = `https://bandcamp.com/api/fancollection/1/${
		type === "collection" ? "collection_items" : "wishlist_items"
	}`;

	while (moreAvailable && lastToken) {
		const res = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": USER_AGENT,
			},
			body: JSON.stringify({
				fan_id,
				older_than_token: lastToken,
				count: 200,
			}),
		});

		if (!res.ok) break;

		const data = (await res.json()) as CollectionItemsResponse;
		if (data.items && data.items.length > 0) {
			allItems.push(...data.items);
			lastToken = data.last_token;
			moreAvailable = data.more_available;
		} else {
			moreAvailable = false;
		}
	}

	return allItems;
}
