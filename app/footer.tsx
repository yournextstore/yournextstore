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
			<h3 className="editorial-eyebrow text-foreground/80">Collections</h3>
			<ul className="mt-5 space-y-3">
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
			<h3 className="editorial-eyebrow text-foreground/80">Fine print</h3>
			<ul className="mt-5 space-y-3">
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
		<footer className="relative bg-background border-t border-border/70">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Editorial outro headline */}
				<div className="pt-20 pb-14 border-b border-border/60">
					<p className="editorial-eyebrow text-muted-foreground">Catalog · Volume Seven</p>
					<p className="mt-4 font-display italic text-5xl sm:text-6xl lg:text-8xl leading-[0.9] tracking-tight text-foreground max-w-5xl">
						Slow design, <span className="text-[var(--color-rust)]">delivered</span> with intent.
					</p>
				</div>

				<div className="py-14 grid grid-cols-2 sm:grid-cols-12 gap-10">
					{/* Brand block */}
					<div className="col-span-2 sm:col-span-4">
						<YnsLink prefetch={"eager"} href="/" className="flex items-baseline gap-1 text-foreground">
							<span className="font-display italic text-2xl leading-none">your</span>
							<span className="text-[0.75rem] tracking-[0.22em] uppercase font-medium pl-1">next.store</span>
						</YnsLink>
						<p className="mt-5 max-w-xs text-sm text-muted-foreground leading-relaxed">
							A modern catalog of considered objects, photographed in natural light and made to outlast the
							season.
						</p>
						<p className="mt-6 editorial-eyebrow text-muted-foreground">Studio · Brooklyn, NY</p>
					</div>

					{/* Collections */}
					<div className="sm:col-span-2">
						<FooterCollections />
					</div>

					{/* Support */}
					<div className="sm:col-span-2">
						<h3 className="editorial-eyebrow text-foreground/80">Support</h3>
						<ul className="mt-5 space-y-3">
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
									Frequently asked
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Trade program
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									White-glove delivery
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<div className="sm:col-span-2">
						<FooterLegalPages />
					</div>

					{/* Studio details */}
					<div className="col-span-2 sm:col-span-2">
						<h3 className="editorial-eyebrow text-foreground/80">Studio</h3>
						<ul className="mt-5 space-y-3 text-sm text-muted-foreground">
							<li>61 Greenpoint Ave</li>
							<li>Brooklyn, NY 11222</li>
							<li className="pt-2">
								<a href="mailto:hello@yournext.store" className="hover:text-foreground transition-colors">
									hello@yournext.store
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border/60 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
					<p className="text-xs text-muted-foreground tracking-wide">
						&copy; {new Date().getFullYear()} Your Next Store. Every piece, photographed in the same light.
					</p>
					<p className="editorial-eyebrow text-muted-foreground/80">
						Set in{" "}
						<span className="font-display italic text-foreground/80 normal-case tracking-normal">
							Playfair
						</span>{" "}
						<span className="px-1">·</span> Inter
					</p>
				</div>
			</div>
		</footer>
	);
}
