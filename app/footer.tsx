import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Shop</h3>
			<ul className="mt-4 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

async function FooterLegalPages() {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	if (pages.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Legal</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.path}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							{page.title}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="border-t border-border bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
					{/* Brand */}
					<div className="sm:col-span-2 lg:col-span-1">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-heading text-2xl font-semibold text-foreground"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
							Clean beauty essentials for every skin type. Thoughtfully formulated, cruelty-free, and designed
							to make you glow.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Help */}
					<div>
						<h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Help</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Contact
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Shipping Info
								</YnsLink>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-muted-foreground">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
