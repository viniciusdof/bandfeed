import { z } from "@hono/zod-openapi";
import { trackSchema } from "../album/album.schemas";

export const trackPageParamsSchema = z.object({
	subdomain: z.string().min(1).describe('The band subdomain (e.g. "cosmodef")'),
	slug: z
		.string()
		.min(1)
		.describe(
			'The exact track slug as it appears in the Bandcamp URL (e.g. "dissolvendo"). Bandcamp\'s slug generation is strange as fuck, so i not quite sure about creating a name to slug converter.',
		),
});

export const trackPageResponseSchema = trackSchema.extend({
	artist: z.string(),
	albumTitle: z.string().nullable(),
	albumUrl: z.string().nullable(),
	img: z.string().nullable(),
	releaseDate: z.string().nullable(),
	description: z.string().nullable(),
	lyrics: z.string().nullable(),
	credits: z.string().nullable(),
	tags: z.array(z.string()),
});
