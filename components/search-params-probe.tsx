import { Suspense } from "react";

/**
 * Without this read the client router would reuse a static listing's default view for every query string, so
 * `?page=2` would never reach the server and the `next.config.ts` rewrite (lib/listing-routes.ts). Reading the
 * query makes the router ask the server.
 */
export function SearchParamsProbe({ searchParams }: { searchParams: Promise<unknown> }) {
	return (
		<Suspense fallback={null}>
			<SearchParamsRead searchParams={searchParams} />
		</Suspense>
	);
}

async function SearchParamsRead({ searchParams }: { searchParams: Promise<unknown> }) {
	await searchParams;
	return null;
}
