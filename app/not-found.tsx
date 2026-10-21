import { ArrowLeft, House, ShoppingBag } from "lucide-react";
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
		<div className="flex min-h-[80dvh] flex-1 flex-col items-center justify-center px-5 py-24 text-center">
			<ShoppingBag className="size-20 text-foreground" strokeWidth={1.75} aria-hidden />
			<h1 className="ed-display mt-6 text-6xl font-bold">404</h1>
			<p className="ed-display mt-1 text-2xl text-muted-foreground">Not found</p>
			<p className="mt-8 text-base text-muted-foreground">
				The page you&apos;re looking for doesn&apos;t exist.
			</p>
			<div className="mt-6 flex flex-wrap justify-center gap-4">
				<Link href="/products" className="ed-btn ed-btn--ghost">
					<ArrowLeft className="h-4 w-4" aria-hidden />
					Keep shopping
				</Link>
				<Link href="/" className="ed-btn">
					<House className="h-4 w-4" aria-hidden />
					Return home
				</Link>
			</div>
		</div>
	);
}
