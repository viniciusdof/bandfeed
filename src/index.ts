import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { version } from "../package.json";
import { albumRouter } from "./v1/album/album.routes";
import { bandRouter } from "./v1/band/band.routes";
import { trackRouter } from "./v1/track/track.routes";
import { userRouter } from "./v1/user/user.routes";

const app = new OpenAPIHono();
const v1 = new OpenAPIHono();

v1.route("/", bandRouter);
v1.route("/", albumRouter);
v1.route("/", trackRouter);
v1.route("/", userRouter);

app.doc("/doc", {
	openapi: "3.0.0",
	info: {
		version,
		title: "Bandfeed API",
		description:
			"A API that transforms Bandcamp pages into structured JSON or RSS feeds. Built with Hono and Cloudflare Workers.",
	},
	tags: [
		{
			name: "Band",
			description:
				"Endpoints for fetching artist/band releases and profile information.",
		},
		{
			name: "Album",
			description:
				"Endpoints for fetching detailed album information and tracklists.",
		},
		{
			name: "Track",
			description: "Endpoints for fetching detailed track information.",
		},
		{
			name: "User",
			description: "Endpoints for tracking user collections and wishlists.",
		},
	],
});

app.get("/ui", swaggerUI({ url: "/doc" }));

app.route("/v1", v1);

app.get("/", (c) => c.redirect("/ui"));

export default app;
