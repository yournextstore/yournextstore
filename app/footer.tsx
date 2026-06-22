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
				className="text-sm text-[color:var(--color-mush-cream)]/70 hover:text-[color:var(--color-mush-yellow)] transition-colors"
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
				className="text-sm text-[color:var(--color-mush-cream)]/70 hover:text-[color:var(--color-mush-yellow)] transition-colors"
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
			<h3 className="font-display text-sm tracking-[0.22em] uppercase text-[color:var(--color-mush-cream)]">
				Shop
			</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[color:var(--color-mush-cream)]/70 hover:text-[color:var(--color-mush-yellow)] transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-[color:var(--color-mush-cream)]/70 hover:text-[color:var(--color-mush-yellow)] transition-colors"
					>
						All products
					</YnsLink>
				</li>
			</ul>
		</div>
	);
}

async function FooterLegalPages() {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	return (
		<div>
			<h3 className="font-display text-sm tracking-[0.22em] uppercase text-[color:var(--color-mush-cream)]">
				Fine print
			</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[color:var(--color-mush-cream)]/70 hover:text-[color:var(--color-mush-yellow)] transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/faq"
						className="text-sm text-[color:var(--color-mush-cream)]/70 hover:text-[color:var(--color-mush-yellow)] transition-colors"
					>
						FAQ
					</YnsLink>
				</li>
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="bg-[color:var(--color-mush-espresso)] text-[color:var(--color-mush-cream)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
					<div className="md:col-span-5">
						<YnsLink prefetch={"eager"} href="/" className="inline-flex flex-col leading-none">
							<span className="text-[10px] tracking-[0.25em] font-display text-[color:var(--color-mush-yellow)]">
								YOUR NEXT
							</span>
							<span className="font-script text-5xl text-[color:var(--color-mush-cream)] -mt-1">Store</span>
						</YnsLink>
						<p className="mt-6 max-w-sm text-[color:var(--color-mush-cream)]/70 leading-relaxed">
							Functional mushroom apothecary. Grown on logs, harvested by hand, packed in a small workshop on
							the edge of the forest.
						</p>
						<div className="mt-8 flex gap-3">
							{["Instagram", "TikTok", "Substack"].map((s) => (
								<a
									key={s}
									href="/"
									className="rounded-full border border-[color:var(--color-mush-cream)]/20 px-4 py-2 text-[10px] tracking-[0.22em] uppercase font-display text-[color:var(--color-mush-cream)] hover:bg-[color:var(--color-mush-yellow)] hover:text-[color:var(--color-mush-espresso)] hover:border-transparent transition-colors"
								>
									{s}
								</a>
							))}
						</div>
					</div>

					<div className="md:col-span-2">
						<FooterCollections />
					</div>

					<div className="md:col-span-2">
						<h3 className="font-display text-sm tracking-[0.22em] uppercase text-[color:var(--color-mush-cream)]">
							About
						</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[color:var(--color-mush-cream)]/70 hover:text-[color:var(--color-mush-yellow)] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/#about"
									className="text-sm text-[color:var(--color-mush-cream)]/70 hover:text-[color:var(--color-mush-yellow)] transition-colors"
								>
									Our farm
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[color:var(--color-mush-cream)]/70 hover:text-[color:var(--color-mush-yellow)] transition-colors"
								>
									Product quality
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/#about"
									className="text-sm text-[color:var(--color-mush-cream)]/70 hover:text-[color:var(--color-mush-yellow)] transition-colors"
								>
									Sustainability
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<div className="md:col-span-3">
						<FooterLegalPages />
					</div>
				</div>

				<div className="py-6 border-t border-[color:var(--color-mush-cream)]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
					<p className="text-xs text-[color:var(--color-mush-cream)]/50">
						&copy; {new Date().getFullYear()} Your Next Store. Harvested in Portugal. Shipped EU-wide.
					</p>
					<p className="text-xs text-[color:var(--color-mush-cream)]/50">
						Made with mycelium &amp;{" "}
						<span className="font-script text-base text-[color:var(--color-mush-yellow)]">care</span>.
					</p>
				</div>
			</div>
		</footer>
	);
}
