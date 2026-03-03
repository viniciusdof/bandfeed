import { z } from "@hono/zod-openapi";

export const userParamsSchema = z.object({
	username: z
		.string()
		.min(1)
		.describe('The user username (e.g. "viniciusdof")'),
});

export const userResponseSchema = z.object({
	user: z
		.object({
			name: z.string().nullable(),
			username: z.string(),
			url: z.string(),
			location: z.string().nullable(),
			website: z.string().nullable(),
		})
		.nullable(),
	collection: z
		.array(
			z.object({
				title: z.string(),
				artist: z.string(),
				url: z.string(),
				img: z.string().nullable(),
				released: z.string().optional(),
				purchased: z.string().optional(),
			}),
		)
		.optional(),
	wishlist: z
		.array(
			z.object({
				title: z.string(),
				artist: z.string(),
				url: z.string(),
				img: z.string().nullable(),
			}),
		)
		.optional(),
});
