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
			<h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Shop</h3>
			<ul className="mt-4 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
			<h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Legal</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.path}`}
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
		<footer className="border-t border-border bg-card">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand */}
					<div className="sm:col-span-2 lg:col-span-1">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-heading text-2xl font-bold uppercase tracking-wider text-foreground"
						>
							YNS
						</YnsLink>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
							Your Next Store — next-gen gaming PCs, peripherals, and accessories. Built for performance.
							Designed for gamers.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Customer Care */}
					<div>
						<h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Customer Care</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									About
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									Contact
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									FAQ
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
					<div className="flex items-center gap-4 text-xs text-muted-foreground">
						<span>Powered by Your Next Store</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
