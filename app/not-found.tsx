import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Page Not Found",
	description:
		"This page doesn't exist or has been moved. Continue shopping to find what you're looking for.",
	robots: { index: false, follow: true },
};

export default function NotFound() {
	return (
		<div className="flex min-h-[70dvh] flex-1 flex-col items-start justify-center gap-5 py-16">
			<h1 className="font-display text-[min(300px,60vw)] leading-[0.8] lg:text-[min(420px,29vw)]">404</h1>
			<p className="max-w-[40ch] text-lg">
				This page doesn&apos;t exist or has been moved. The shop is still open.
			</p>
			<Link
				href="/products"
				className="press flex h-14 items-center rounded-full bg-foreground px-[26px] font-semibold text-background transition-colors hover:bg-ink-hover"
			>
				See what&apos;s new
			</Link>
		</div>
	);
}
