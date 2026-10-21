import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Page Not Found",
	description:
		"This page doesn't exist or has been moved. Continue shopping to find what you're looking for.",
	robots: { index: false, follow: true },
};

// The original's 404: a big emerald number, one line, one link home.
export default function NotFound() {
	return (
		<div className="container grid flex-1 justify-center py-44 text-center">
			<p className="text-6xl font-bold text-emerald-900">404</p>
			<h1 className="mt-4 text-xl">Page not found</h1>
			<Link href="/" className="mt-6 font-semibold text-emerald-900 hover:text-emerald-700">
				Go back home
				<span aria-hidden> &rarr;</span>
			</Link>
		</div>
	);
}
