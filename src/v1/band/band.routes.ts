import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { errorSchema } from "../../shared/schemas";
import { generateRSS } from "../../shared/utils/rss";
import { bandParamsSchema, bandResponseSchema } from "./band.schemas";
import { fetchBandData } from "./band.service";

export const bandRouter = new OpenAPIHono();

const bandRoute = createRoute({
	method: "get",
	path: "/band/{subdomain}",
	tags: ["Band"],
	summary: "Get band releases as JSON",
	description:
		"Fetches a band's profile information and a full list of their music releases.",
	request: {
		params: bandParamsSchema,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: bandResponseSchema,
				},
			},
			description: "Successfully retrieved band data.",
		},
		500: {
			content: {
				"application/json": {
					schema: errorSchema,
				},
			},
			description: "Error fetching band data.",
		},
	},
});

bandRouter.openapi(bandRoute, async (c) => {
	const { subdomain } = c.req.valid("param");
	try {
		const data = await fetchBandData(subdomain);
		return c.json(data, 200);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return c.json({ error: message }, 500);
	}
});

const bandRSSRoute = createRoute({
	method: "get",
	path: "/band/{subdomain}/rss",
	tags: ["Band"],
	summary: "Get band releases as RSS feed",
	request: {
		params: bandParamsSchema,
	},
	responses: {
		200: {
			description: "An RSS XML feed.",
		},
		500: {
			description: "Error generating RSS.",
		},
	},
});

bandRouter.openapi(bandRSSRoute, async (c) => {
	const { subdomain } = c.req.valid("param");
	try {
		const { band, releases } = await fetchBandData(subdomain);
		const items = releases.map((r) => ({
			title: `${r.artist} - ${r.title}`,
			link: r.link,
			description: r.img ? `<img src="${r.img}" />` : "",
		}));

		const rss = generateRSS(
			`${band?.name || subdomain} on Bandcamp`,
			`https://${subdomain}.bandcamp.com/`,
			`Releases by ${band?.name || subdomain}`,
			items,
		);
		return c.text(rss, 200, { "Content-Type": "application/rss+xml" });
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return c.text(`Error: ${message}`, 500);
	}
});
