import type { MiddlewareHandler } from "hono";

type CfProps = {
	country?: string;
	colo?: string;
};

export const structuredLogger = (): MiddlewareHandler => async (c, next) => {
	const start = Date.now();
	let errorMessage: string | null = null;

	try {
		await next();
	} catch (err) {
		errorMessage = err instanceof Error ? err.message : String(err);
		throw err;
	} finally {
		const status = c.res?.status ?? 500;
		const cf = c.req.raw.cf as CfProps | undefined;

		if (!errorMessage && status >= 500) {
			try {
				const body = await c.res.clone().json<{ error?: string }>();
				errorMessage = body?.error ?? null;
			} catch {
				// response body is not JSON or unreadable, skip
			}
		}

		const log = {
			timestamp: new Date().toISOString(),
			method: c.req.method,
			path: c.req.path,
			status,
			durationMs: Date.now() - start,
			cfRay: c.req.header("cf-ray") ?? null,
			country: cf?.country ?? null,
			colo: cf?.colo ?? null,
			error: errorMessage,
		};

		if (status >= 500) {
			console.error(JSON.stringify(log));
		} else {
			console.log(JSON.stringify(log));
		}
	}
};
