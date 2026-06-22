import { LeafIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce, meGetCached } from "@/lib/commerce";

async function FooterBlogLink() {
	"use cache";
	cacheLife("hours");

	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.blog) {
		return null;
	}

	return (
		<li>
			<YnsLink
				prefetch={"eager"}
				href="/blog"
				className="text-sm text-muted-foreground hover:text-foreground transition-colors"
			>
				Blog
			</YnsLink>
		</li>
	);
}

async function FooterContactLink() {
	"use cache";
	cacheLife("hours");

	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.contactForm) {
		return null;
	}

	return (
		<li>
			<YnsLink
				prefetch={"eager"}
				href="/contact"
				className="text-sm text-muted-foreground hover:text-foreground transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">Shop</h3>
			<ul className="mt-5 space-y-3.5">
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">Legal</h3>
			<ul className="mt-5 space-y-3.5">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="bg-leaf-50 border-t border-leaf-200/70">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-2 sm:max-w-xs">
						<YnsLink prefetch={"eager"} href="/" className="flex items-center gap-2">
							<span className="grid place-items-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
								<LeafIcon className="h-4 w-4" />
							</span>
							<span className="font-display text-2xl text-foreground">Your Next Store</span>
						</YnsLink>
						<p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-xs">
							Pure, plant-powered essentials thoughtfully formulated to support your daily rituals.
						</p>
						<div className="mt-6 flex items-center gap-2">
							{["Instagram", "Twitter", "YouTube"].map((label) => (
								<button
									key={label}
									type="button"
									aria-label={label}
									className="grid place-items-center h-9 w-9 rounded-full ring-1 ring-leaf-200 text-foreground hover:bg-foreground hover:text-background hover:ring-foreground transition-colors text-[10px] font-semibold uppercase tracking-wider"
								>
									{label.charAt(0)}
								</button>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">Support</h3>
						<ul className="mt-5 space-y-3.5">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/search"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Track order
								</YnsLink>
							</li>
							<li>
								<span className="text-sm text-muted-foreground">care@yournextstore.com</span>
							</li>
						</ul>
					</div>

					<FooterLegalPages />

					<div>
						<h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">Our promise</h3>
						<ul className="mt-5 space-y-3.5 text-sm text-muted-foreground">
							<li>Carbon-neutral shipping</li>
							<li>Lab-tested formulas</li>
							<li>Glass refill program</li>
						</ul>
					</div>
				</div>

				<div className="py-7 border-t border-leaf-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="text-xs text-muted-foreground">
						&copy; {new Date().getFullYear()} Your Next Store. Rooted in nature.
					</p>
					<p className="text-xs text-muted-foreground">USD · English · Ships worldwide</p>
				</div>
			</div>
		</footer>
	);
}
