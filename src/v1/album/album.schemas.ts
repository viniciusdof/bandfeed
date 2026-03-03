import { z } from "@hono/zod-openapi";

export const albumParamsSchema = z.object({
	subdomain: z
		.string()
		.min(1)
		.describe('The band subdomain (e.g. "relacoespublicas")'),
	slug: z
		.string()
		.min(1)
		.describe(
			'The exact album slug as it appears in the Bandcamp URL (e.g. "pol-tica-popula-l-gica-estraga"). Bandcamp\'s slug generation is strange as fuck, so i not quite sure about creating a name to slug converter.',
		),
});

export const trackSchema = z.object({
	title: z.string(),
	number: z.number(),
	duration: z.number().nullable(),
	url: z.string().nullable(),
});

export const albumResponseSchema = z.object({
	title: z.string(),
	artist: z.string(),
	url: z.string(),
	img: z.string().nullable(),
	releaseDate: z.string().nullable(),
	description: z.string().nullable(),
	tracks: z.array(trackSchema),
	tags: z.array(z.string()),
});
