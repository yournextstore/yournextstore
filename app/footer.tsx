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
			<h3 className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/80 transition-colors hover:text-foreground"
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
			<h3 className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-foreground/80 transition-colors hover:text-foreground"
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
		<footer className="bg-background border-t border-border">
			<div className="max-w-7xl mx-auto px-5 sm:px-8">
				<div className="py-20 grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
					<div className="max-w-sm">
						<YnsLink prefetch={"eager"} href="/" className="inline-flex items-baseline gap-[0.18rem]">
							<span className="font-display text-[1.3rem] font-medium tracking-tight text-foreground lowercase">
								your
							</span>
							<span className="text-moss font-display text-[1.3rem]" aria-hidden="true">
								+
							</span>
							<span className="font-display text-[1.3rem] font-medium tracking-tight text-foreground lowercase">
								next store
							</span>
						</YnsLink>
						<p className="mt-5 text-sm leading-relaxed text-muted-foreground">
							A complete cellular energy system. Engineered for the long arc — mitochondrial support, NAD+
							metabolism, and the daily ritual that keeps it all moving.
						</p>
						<div className="mt-7 flex flex-wrap items-center gap-2">
							{["Third-party tested", "NSF certified", "Vegan"].map((tag) => (
								<span
									key={tag}
									className="inline-flex h-7 items-center rounded-full border border-border px-3 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground"
								>
									{tag}
								</span>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">Care</h3>
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
									className="text-sm text-foreground/80 transition-colors hover:text-foreground"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-foreground/80 transition-colors hover:text-foreground"
								>
									Subscribe &amp; save
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/#about"
									className="text-sm text-foreground/80 transition-colors hover:text-foreground"
								>
									Practitioners
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<p className="text-[0.78rem] text-muted-foreground">
						&copy; {new Date().getFullYear()} Your Next Store. Steady on.
					</p>
					<p className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
						These statements have not been evaluated by the FDA.
					</p>
				</div>
			</div>
		</footer>
	);
}
