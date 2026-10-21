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
				<p className="eyebrow mb-[1.4rem]">
					<span className="grid-ref" aria-hidden="true">
						[ 00.00°N / 00.00°E ]
					</span>
					SIGNAL LOST {/* 404 */}
				</p>
				<h1 className="title-hero text-ink">
					Off the
					<br />
					map.
				</h1>
				<p className="lead mt-6">
					This page doesn't exist or has been moved. The way back to the shop is right here.
				</p>
				<Link href="/" className="btn btn-primary mt-10">
					Back to base
				</Link>
			</div>
		</div>
	);
}
