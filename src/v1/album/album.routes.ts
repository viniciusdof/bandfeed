import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { errorSchema } from "../../shared/schemas";
import { albumParamsSchema, albumResponseSchema } from "./album.schemas";
import { fetchAlbumData } from "./album.service";

export const albumRouter = new OpenAPIHono();

const albumRoute = createRoute({
	method: "get",
	path: "/band/{subdomain}/album/{slug}",
	tags: ["Album"],
	summary: "Get detailed album information",
	description:
		"Fetches full album details including tracklist, release date, description, and tags.",
	request: {
		params: albumParamsSchema,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: albumResponseSchema,
				},
			},
			description: "Successfully retrieved album details.",
		},
		500: {
			content: {
				"application/json": {
					schema: errorSchema,
				},
			},
			description: "Failed to fetch or parse the album page.",
		},
	},
});

albumRouter.openapi(albumRoute, async (c) => {
	const { subdomain, slug } = c.req.valid("param");
	try {
		const data = await fetchAlbumData(subdomain, slug);
		return c.json(data, 200);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return c.json({ error: message }, 500);
	}
});
