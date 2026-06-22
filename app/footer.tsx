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
				className="text-sm text-[var(--cream)]/80 hover:text-[var(--cream)] transition-colors"
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
				className="text-sm text-[var(--cream)]/80 hover:text-[var(--cream)] transition-colors"
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
			<h3 className="text-xs font-semibold text-[var(--cream)] uppercase tracking-[0.18em]">Flavors</h3>
			<ul className="mt-4 space-y-2">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[var(--cream)]/80 hover:text-[var(--cream)] transition-colors"
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
			<h3 className="text-xs font-semibold text-[var(--cream)] uppercase tracking-[0.18em]">Legal</h3>
			<ul className="mt-4 space-y-2">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[var(--cream)]/80 hover:text-[var(--cream)] transition-colors"
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
		<footer className="bg-coral-gradient text-[var(--cream)] relative overflow-hidden">
			<div aria-hidden="true" className="absolute inset-0 bg-halftone opacity-[0.05] mix-blend-overlay" />
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-14 sm:py-20 grid grid-cols-12 gap-8">
					{/* Brand wordmark */}
					<div className="col-span-12 md:col-span-5">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display italic text-4xl sm:text-5xl tracking-tight text-[var(--cream)] leading-none inline-block"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-5 text-sm text-[var(--cream)]/80 leading-relaxed max-w-sm">
							Small-batch sparkling energy, brewed with real fruit and zero shortcuts. Bold flavor in every
							can.
						</p>
					</div>

					<div className="col-span-6 md:col-span-2">
						<FooterCollections />
					</div>

					<div className="col-span-6 md:col-span-2">
						<h3 className="text-xs font-semibold text-[var(--cream)] uppercase tracking-[0.18em]">Support</h3>
						<ul className="mt-4 space-y-2">
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
									className="text-sm text-[var(--cream)]/80 hover:text-[var(--cream)] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[var(--cream)]/80 hover:text-[var(--cream)] transition-colors"
								>
									All products
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<div className="col-span-12 md:col-span-3">
						<FooterLegalPages />
					</div>
				</div>

				<div className="py-6 border-t border-[var(--cream)]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="text-xs text-[var(--cream)]/70 tracking-[0.14em] uppercase">
						© {new Date().getFullYear()} Your Next Store · Bold flavor, delivered cold
					</p>
					<div className="flex gap-5 text-xs text-[var(--cream)]/70 tracking-wider uppercase">
						<a href="https://instagram.com" className="hover:text-[var(--cream)] transition-colors">
							Instagram
						</a>
						<a href="https://twitter.com" className="hover:text-[var(--cream)] transition-colors">
							Twitter
						</a>
						<a href="https://tiktok.com" className="hover:text-[var(--cream)] transition-colors">
							TikTok
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
