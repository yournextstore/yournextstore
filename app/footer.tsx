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
			<h3 className="text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-6">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch="eager"
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
			<h3 className="text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-6">Info</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch="eager"
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
		<footer className="bg-[#f5f5f0] border-t border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-14 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
					{/* Brand */}
					<div className="lg:col-span-1">
						<YnsLink prefetch="eager" href="/" className="font-heading text-2xl font-light text-foreground">
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed">
							Fashion inspired by where we're from — curated essentials for modern living.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Legal / Info */}
					<FooterLegalPages />

					{/* Newsletter */}
					<div>
						<h3 className="text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-6">
							Stay in touch
						</h3>
						<p className="text-sm text-muted-foreground mb-4">
							Be the first to know about our biggest and best sales. We'll never send more than one email a
							month.
						</p>
						<form className="flex" onSubmit={(e) => e.preventDefault()}>
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 h-10 px-4 bg-white border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
							/>
							<button
								type="submit"
								className="h-10 px-6 bg-foreground text-white text-xs font-medium tracking-[0.1em] uppercase hover:bg-foreground/90 transition-colors"
							>
								Subscribe
							</button>
						</form>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-muted-foreground">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<div className="flex items-center gap-4">
						<span className="text-xs text-muted-foreground">USD $</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
