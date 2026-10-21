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
		<div className="section-x flex min-h-[80dvh] flex-1 flex-col justify-center py-24">
			<div className="frame">
				<p className="kicker mb-4">404 · no signal</p>
				<h1 className="title-hero text-ink">
					Nothing patched
					<br />
					<span className="text-signal">into this jack.</span>
				</h1>
				<p className="lead mt-6 max-w-[52ch]">
					This page doesn't exist or has been moved. Pull the cable and try another route — the line is right
					here.
				</p>
				<div className="mt-10 flex flex-wrap gap-[0.7rem]">
					<Link href="/" className="btn btn-primary">
						Back to the rack
					</Link>
					<Link href="/products" className="btn btn-ghost">
						See the line <span aria-hidden="true">→</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
