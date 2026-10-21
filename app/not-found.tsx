import type { Metadata } from "next";
import Link from "next/link";
import { EmptyBasket } from "@/components/gf/icons";
import { gfGreenPill } from "@/lib/gf-styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Page Not Found",
	description:
		"This page doesn't exist or has been moved. Continue shopping to find what you're looking for.",
	robots: { index: false, follow: true },
};

export default function NotFound() {
	return (
		<div className="flex min-h-[70dvh] flex-col items-center justify-center py-16 text-center">
			<EmptyBasket />
			<h1 className="mt-6 text-gf-h2 font-bold">Page not found</h1>
			<p className="mt-2 max-w-xs text-gf-h6 text-muted-foreground">
				This page doesn&apos;t exist or has been moved. The shelves are still stocked, though.
			</p>
			<Link href="/" className={cn(gfGreenPill, "mt-6 h-[50px] w-auto px-8")}>
				Back to the catalog
			</Link>
		</div>
	);
}
