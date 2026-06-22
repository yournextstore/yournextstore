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
				className="text-sm text-foreground/75 hover:text-foreground transition-colors"
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
				className="text-sm text-foreground/75 hover:text-foreground transition-colors"
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
			<h3 className="eyebrow text-foreground/55 mb-5">Collections</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/75 hover:text-foreground transition-colors"
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
			<h3 className="eyebrow text-foreground/55 mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-foreground/75 hover:text-foreground transition-colors"
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
		<footer className="bg-paper-grain border-t hairline">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-10 lg:gap-14">
					<div className="col-span-2 sm:col-span-4 lg:col-span-1">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display text-3xl tracking-tight text-foreground"
						>
							Your Next Store<span className="text-[var(--clay)]">.</span>
						</YnsLink>
						<p className="mt-5 text-sm leading-relaxed text-foreground/65 max-w-xs">
							Considered furniture for considered living — made to order in our European workshop.
						</p>
						<div className="mt-7 flex items-center gap-3 text-xs tracking-wide text-foreground/55">
							<span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--forest)]" />
							Atelier open weekdays · 09 — 18
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="eyebrow text-foreground/55 mb-5">Support</h3>
						<ul className="space-y-3">
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
									className="text-sm text-foreground/75 hover:text-foreground transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-foreground/75 hover:text-foreground transition-colors"
								>
									Shipping
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-foreground/75 hover:text-foreground transition-colors"
								>
									Care guides
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />

					<div>
						<h3 className="eyebrow text-foreground/55 mb-5">Visit</h3>
						<address className="not-italic text-sm text-foreground/75 leading-relaxed">
							Storgatan 14
							<br />
							114 51 Stockholm
							<br />
							Sweden
						</address>
					</div>
				</div>

				<div className="py-6 border-t hairline flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
					<p className="text-xs tracking-wide text-foreground/55">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<p className="text-xs tracking-wide text-foreground/55">
						Made with patience in Stockholm and Porto.
					</p>
				</div>
			</div>
		</footer>
	);
}
