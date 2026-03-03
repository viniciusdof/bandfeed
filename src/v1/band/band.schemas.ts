import { z } from "@hono/zod-openapi";

export const bandParamsSchema = z.object({
	subdomain: z
		.string()
		.min(1)
		.describe('The band subdomain (e.g. "ultraluna")'),
});

export const releaseSchema = z.object({
	title: z.string(),
	artist: z.string(),
	link: z.string(),
	img: z.string().nullable(),
});

export const bandResponseSchema = z.object({
	band: z
		.object({
			name: z.string(),
			url: z.string(),
			location: z.string().nullable(),
			bio: z.string().nullable(),
			websites: z.array(z.string()),
		})
		.nullable(),
	releases: z.array(releaseSchema),
});
