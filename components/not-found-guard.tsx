import { notFound } from "next/navigation";
import { Suspense } from "react";

/**
 * Answers 404 for a missing catalogue address while the page body renders straight into `<main>`.
 *
 * `notFound()` has to throw inside a `<Suspense>` for the not-found page to keep the store's header and footer in
 * the HTML; thrown above every boundary it replaces the whole document with a bare error page. The page body can't
 * sit in that boundary, though: React moves a resolved boundary out of place, into a hidden block at the end of the
 * HTML, once the document passes 12,800 bytes, which leaves `<main>` empty for a crawler. So only this check lives in
 * the boundary (it renders nothing, so it stays in place), and the body beside it returns `null` for a missing
 * address instead of throwing (AGENTS.md).
 */
export function NotFoundGuard({ missing }: { missing: Promise<boolean> }) {
	return (
		<Suspense fallback={null}>
			<Guard missing={missing} />
		</Suspense>
	);
}

async function Guard({ missing }: { missing: Promise<boolean> }) {
	if (await missing) {
		notFound();
	}
	return null;
}
