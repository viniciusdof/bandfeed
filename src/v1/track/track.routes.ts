import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { errorSchema } from "../../shared/schemas";
import {
	trackPageParamsSchema,
	trackPageResponseSchema,
} from "./track.schemas";
import { fetchTrackData } from "./track.service";

export const trackRouter = new OpenAPIHono();

const trackPageRoute = createRoute({
	method: "get",
	path: "/band/{subdomain}/track/{slug}",
	tags: ["Track"],
	summary: "Get detailed track information",
	description:
		"Fetches full track details including artist, album info, cover art, release date, and tags.",
	request: {
		params: trackPageParamsSchema,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: trackPageResponseSchema,
				},
			},
			description: "Successfully retrieved track details.",
		},
		500: {
			content: {
				"application/json": {
					schema: errorSchema,
				},
			},
			description: "Failed to fetch or parse the track page.",
		},
	},
});

trackRouter.openapi(trackPageRoute, async (c) => {
	const { subdomain, slug } = c.req.valid("param");
	try {
		const data = await fetchTrackData(subdomain, slug);
		return c.json(data, 200);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return c.json({ error: message }, 500);
	}
});
