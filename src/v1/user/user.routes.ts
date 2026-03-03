import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { cache } from "hono/cache";
import { errorSchema } from "../../shared/schemas";
import { generateRSS } from "../../shared/utils/rss";
import type { BandcampItemRaw } from "./user.models";
import { userParamsSchema, userResponseSchema } from "./user.schemas";
import { fetchAllItems, fetchUserBlob } from "./user.service";

export const userRouter = new OpenAPIHono();

const CACHE_TTL = 3600; // 1 hour

userRouter.openapi(
	createRoute({
		method: "get",
		path: "/user/{username}/collection",
		tags: ["User"],
		summary: "Get user collection as JSON",
		middleware: [
			cache({
				cacheName: "user-collection",
				cacheControl: `max-age=${CACHE_TTL}`,
			}),
		],
		request: { params: userParamsSchema },
		responses: {
			200: {
				content: { "application/json": { schema: userResponseSchema } },
				description: "Retrieved collection.",
			},
			500: {
				content: { "application/json": { schema: errorSchema } },
				description: "Error.",
			},
		},
	}),
	async (c) => {
		const { username } = c.req.valid("param");
		try {
			const blob = await fetchUserBlob(username);
			const fan = blob.fan_data;
			const initialItems = Object.values(blob.item_cache.collection);
			const allCollectionItems = await fetchAllItems(
				fan.fan_id,
				initialItems,
				blob.collection_data.last_token,
				"collection",
			);

			const collection = allCollectionItems.map((item: BandcampItemRaw) => ({
				title: item.item_title,
				artist: item.band_name,
				url: item.item_url,
				img: item.item_art_id
					? `https://f4.bcbits.com/img/a${item.item_art_id}_10.jpg`
					: null,
				released: item.released,
				purchased: item.purchased,
			}));
			return c.json(
				{
					user: {
						name: fan.name,
						username: fan.username,
						url: fan.trackpipe_url,
						location: fan.location,
						website: fan.website_url,
					},
					collection,
				},
				200,
			);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			return c.json({ error: message }, 500);
		}
	},
);

userRouter.openapi(
	createRoute({
		method: "get",
		path: "/user/{username}/collection/rss",
		tags: ["User"],
		summary: "Get user collection as RSS feed",
		middleware: [
			cache({
				cacheName: "user-collection-rss",
				cacheControl: `max-age=${CACHE_TTL}`,
			}),
		],
		request: { params: userParamsSchema },
		responses: {
			200: { description: "RSS feed." },
			500: { description: "Error." },
		},
	}),
	async (c) => {
		const { username } = c.req.valid("param");
		try {
			const blob = await fetchUserBlob(username);
			const fan = blob.fan_data;
			const initialItems = Object.values(blob.item_cache.collection);
			const allCollectionItems = await fetchAllItems(
				fan.fan_id,
				initialItems,
				blob.collection_data.last_token,
				"collection",
			);

			const collection = allCollectionItems.sort(
				(a, b) =>
					new Date(b.purchased || 0).getTime() -
					new Date(a.purchased || 0).getTime(),
			);
			const items = collection.map((item: BandcampItemRaw) => ({
				title: `${item.band_name} - ${item.item_title}`,
				link: item.item_url,
				description: `<p>Purchased by ${blob.fan_data.name}</p>${
					item.item_art_id
						? `<p><img src="https://f4.bcbits.com/img/a${item.item_art_id}_10.jpg" /></p>`
						: ""
				}<p><a href="${item.item_url}">Listen</a></p>`,
				pubDate: item.purchased,
			}));
			const rss = generateRSS(
				`${blob.fan_data.name}'s Collection`,
				`https://bandcamp.com/${username}`,
				`Items collected by ${blob.fan_data.name}`,
				items,
			);
			return c.text(rss, 200, { "Content-Type": "application/rss+xml" });
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			return c.text(`Error: ${message}`, 500);
		}
	},
);

userRouter.openapi(
	createRoute({
		method: "get",
		path: "/user/{username}/wishlist",
		tags: ["User"],
		summary: "Get user wishlist as JSON",
		middleware: [
			cache({
				cacheName: "user-wishlist",
				cacheControl: `max-age=${CACHE_TTL}`,
			}),
		],
		request: { params: userParamsSchema },
		responses: {
			200: {
				content: { "application/json": { schema: userResponseSchema } },
				description: "Retrieved wishlist.",
			},
			500: {
				content: { "application/json": { schema: errorSchema } },
				description: "Error.",
			},
		},
	}),
	async (c) => {
		const { username } = c.req.valid("param");
		try {
			const blob = await fetchUserBlob(username);
			const fan = blob.fan_data;
			const initialItems = Object.values(blob.item_cache.wishlist);
			const allWishlistItems = await fetchAllItems(
				fan.fan_id,
				initialItems,
				blob.wishlist_data.last_token,
				"wishlist",
			);

			const wishlist = allWishlistItems.map((item: BandcampItemRaw) => ({
				title: item.item_title,
				artist: item.band_name,
				url: item.item_url,
				img: item.item_art_id
					? `https://f4.bcbits.com/img/a${item.item_art_id}_10.jpg`
					: null,
			}));
			return c.json(
				{
					user: {
						name: fan.name,
						username: fan.username,
						url: fan.trackpipe_url,
						location: fan.location,
						website: fan.website_url,
					},
					wishlist,
				},
				200,
			);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			return c.json({ error: message }, 500);
		}
	},
);

userRouter.openapi(
	createRoute({
		method: "get",
		path: "/user/{username}/wishlist/rss",
		tags: ["User"],
		summary: "Get user wishlist as RSS feed",
		middleware: [
			cache({
				cacheName: "user-wishlist-rss",
				cacheControl: `max-age=${CACHE_TTL}`,
			}),
		],
		request: { params: userParamsSchema },
		responses: {
			200: { description: "RSS feed." },
			500: { description: "Error." },
		},
	}),
	async (c) => {
		const { username } = c.req.valid("param");
		try {
			const blob = await fetchUserBlob(username);
			const fan = blob.fan_data;
			const initialItems = Object.values(blob.item_cache.wishlist);
			const allWishlistItems = await fetchAllItems(
				fan.fan_id,
				initialItems,
				blob.wishlist_data.last_token,
				"wishlist",
			);

			const items = allWishlistItems.map((item: BandcampItemRaw) => ({
				title: `${item.band_name} - ${item.item_title}`,
				link: item.item_url,
				description: `<p>Wishlisted by ${blob.fan_data.name}</p>${
					item.item_art_id
						? `<p><img src="https://f4.bcbits.com/img/a${item.item_art_id}_10.jpg" /></p>`
						: ""
				}`,
			}));
			const rss = generateRSS(
				`${blob.fan_data.name}'s Wishlist`,
				`https://bandcamp.com/${username}/wishlist`,
				`Items wishlisted by ${blob.fan_data.name}`,
				items,
			);
			return c.text(rss, 200, { "Content-Type": "application/rss+xml" });
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			return c.text(`Error: ${message}`, 500);
		}
	},
);
