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
				className="text-sm text-cream/85 hover:text-white transition-colors"
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
				className="text-sm text-cream/85 hover:text-white transition-colors"
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-cream/70">Shelves</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-cream/85 hover:text-white transition-colors"
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-cream/70">The fine print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-cream/85 hover:text-white transition-colors"
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
		<footer className="bg-ink text-cream relative overflow-hidden">
			<div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-coral-gradient" />
			<div aria-hidden className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-honey/10 blur-3xl" />
			<div aria-hidden className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sage/10 blur-3xl" />

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
					{/* Brand */}
					<div className="col-span-2 sm:max-w-sm">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-serif italic text-3xl tracking-tight text-cream"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-5 text-sm text-cream/75 leading-relaxed">
							Slow goods, quietly considered. A small pantry of botanicals, beans, and preserves — hand-packed
							in Brooklyn since 2019.
						</p>
						<div className="mt-6 flex items-center gap-2">
							{["IG", "PIN", "TW", "@"].map((s) => (
								<a
									key={s}
									href="#"
									aria-label={`Follow us on ${s}`}
									className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-cream/20 text-cream/85 hover:bg-honey hover:text-ink hover:border-honey transition-colors text-xs font-semibold"
								>
									{s}
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-cream/70">Hello</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-cream/85 hover:text-white transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-cream/85 hover:text-white transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-cream/85 hover:text-white transition-colors"
								>
									Shop all
								</YnsLink>
							</li>
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-sm text-cream/85 hover:text-white transition-colors"
								>
									hello@yournextstore.com
								</a>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-cream/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="text-xs text-cream/60">
						&copy; {new Date().getFullYear()} Your Next Store. Brewed slowly in Brooklyn.
					</p>
					<p className="text-xs text-cream/60 font-serif italic">
						"The box of forgotten joys" — a YNS original.
					</p>
				</div>
			</div>
		</footer>
	);
}
