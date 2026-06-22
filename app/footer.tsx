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
				className="text-sm text-foreground/75 hover:text-primary transition-colors"
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
				className="text-sm text-foreground/75 hover:text-primary transition-colors"
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
			<h3 className="text-[10px] tracking-[0.32em] uppercase text-foreground/65 mb-5 font-medium">
				Collections
			</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/75 hover:text-primary transition-colors"
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
			<h3 className="text-[10px] tracking-[0.32em] uppercase text-foreground/65 mb-5 font-medium">
				Fine print
			</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-foreground/75 hover:text-primary transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

const certifications = ["NSF Certified", "Third-party Tested", "B Corp Pending", "Carbon-neutral shipping"];

export function Footer() {
	return (
		<footer className="bg-cream border-t border-border/60">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid gap-12 lg:grid-cols-5">
					{/* Brand */}
					<div className="lg:col-span-2 max-w-sm">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="text-base font-serif font-bold tracking-[0.18em] uppercase text-primary leading-tight"
						>
							<span className="block">Your Next</span>
							<span className="block">Store</span>
						</YnsLink>
						<p className="mt-5 text-sm text-muted-foreground leading-relaxed">
							A small-batch apothecary for restful evenings. Hand-blended, clinically-dosed, and shipped from
							our studio with a handwritten card.
						</p>
						<div className="mt-6 flex items-center gap-3">
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noreferrer"
								className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-foreground/65 hover:text-primary hover:border-primary/30 transition-colors"
								aria-label="Instagram"
							>
								<span className="sr-only">Instagram</span>
								<svg
									className="h-4 w-4"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={1.5}
									aria-hidden="true"
									role="img"
								>
									<title>Instagram</title>
									<rect x="3" y="3" width="18" height="18" rx="5" />
									<circle cx="12" cy="12" r="4" />
									<circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
								</svg>
							</a>
						</div>
					</div>

					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="text-[10px] tracking-[0.32em] uppercase text-foreground/65 mb-5 font-medium">
							Help
						</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-foreground/75 hover:text-primary transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-foreground/75 hover:text-primary transition-colors"
								>
									Frequently asked
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-foreground/75 hover:text-primary transition-colors"
								>
									Shop all
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Certifications strip */}
				<div className="py-5 border-t border-border/60 flex flex-wrap gap-x-6 gap-y-2 items-center justify-center text-[10px] tracking-[0.28em] uppercase text-foreground/55">
					{certifications.map((c) => (
						<span key={c}>{c}</span>
					))}
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border/60 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
					<p className="text-xs text-muted-foreground">
						&copy; {new Date().getFullYear()} Your Next Store. Made slowly in small batches.
					</p>
					<p className="text-[10px] tracking-[0.28em] uppercase text-foreground/45">
						These statements have not been evaluated by the FDA.
					</p>
				</div>
			</div>
		</footer>
	);
}
