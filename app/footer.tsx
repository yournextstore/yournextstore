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
				className="text-sm text-white/70 hover:text-[var(--color-butter)] transition-colors"
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
				className="text-sm text-white/70 hover:text-[var(--color-butter)] transition-colors"
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
			<h3 className="display text-sm uppercase tracking-[0.18em] text-[var(--color-butter)] mb-5">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/70 hover:text-[var(--color-butter)] transition-colors"
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
			<h3 className="display text-sm uppercase tracking-[0.18em] text-[var(--color-butter)] mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-white/70 hover:text-[var(--color-butter)] transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

const SOCIAL_ICONS = [
	{
		label: "Instagram",
		href: "https://instagram.com",
		path: "M16 11a4 4 0 11-8 0 4 4 0 018 0zM18 6h0",
	},
	{
		label: "TikTok",
		href: "https://tiktok.com",
		path: "M14 4v9a4 4 0 11-4-4M14 4c0 2 1.5 4 4 4",
	},
	{
		label: "YouTube",
		href: "https://youtube.com",
		path: "M3 7l9 5 9-5M3 7v10h18V7",
	},
] as const;

export function Footer() {
	return (
		<footer className="bg-[var(--color-espresso)] text-white border-t-2 border-foreground/10">
			{/* Big-mark wordmark band */}
			<div className="border-b border-white/10 overflow-hidden">
				<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-10 flex items-end justify-between gap-4">
					<h2 className="display text-5xl sm:text-7xl lg:text-[120px] leading-none uppercase tracking-tight text-[var(--color-butter)] italic">
						Your Next Store
					</h2>
					<p className="hidden md:block text-xs uppercase tracking-[0.3em] text-white/40 pb-3">
						Happy
						<br />
						tummy
						<br />
						coffee
					</p>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14 grid grid-cols-2 lg:grid-cols-12 gap-10">
				<div className="col-span-2 lg:col-span-4">
					<p className="text-sm text-white/70 leading-relaxed max-w-sm">
						YNS A2 lattes &mdash; gut-friendly dairy brewed for happy tummies and happier mornings. Made in
						California with love.
					</p>
					<div className="mt-6 flex items-center gap-3">
						{SOCIAL_ICONS.map((s) => (
							<a
								key={s.label}
								href={s.href}
								aria-label={s.label}
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center text-white/80 hover:bg-[var(--color-butter)] hover:text-foreground hover:border-[var(--color-butter)] transition-colors"
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.8"
									className="w-4 h-4"
								>
									<title>{s.label}</title>
									<rect x="3" y="3" width="18" height="18" rx="5" />
									<path d={s.path} />
								</svg>
							</a>
						))}
					</div>
				</div>

				<div className="lg:col-span-2">
					<FooterCollections />
				</div>

				<div className="lg:col-span-2">
					<h3 className="display text-sm uppercase tracking-[0.18em] text-[var(--color-butter)] mb-5">
						Help
					</h3>
					<ul className="space-y-3">
						<li>
							<YnsLink
								prefetch={"eager"}
								href="/about"
								className="text-sm text-white/70 hover:text-[var(--color-butter)] transition-colors"
							>
								About Us
							</YnsLink>
						</li>
						<FooterContactLink />
						<li>
							<YnsLink
								prefetch={"eager"}
								href="/faq"
								className="text-sm text-white/70 hover:text-[var(--color-butter)] transition-colors"
							>
								FAQ
							</YnsLink>
						</li>
						<FooterBlogLink />
						<li>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="text-sm text-white/70 hover:text-[var(--color-butter)] transition-colors"
							>
								Shipping
							</YnsLink>
						</li>
						<li>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="text-sm text-white/70 hover:text-[var(--color-butter)] transition-colors"
							>
								Wholesale
							</YnsLink>
						</li>
					</ul>
				</div>

				<div className="lg:col-span-2">
					<FooterLegalPages />
				</div>

				<div className="lg:col-span-2">
					<h3 className="display text-sm uppercase tracking-[0.18em] text-[var(--color-butter)] mb-5">
						Visit
					</h3>
					<address className="not-italic text-sm text-white/70 leading-relaxed">
						YNS Creamery
						<br />
						1972 Pasture Lane
						<br />
						Sonoma, CA 95476
					</address>
				</div>
			</div>

			<div className="border-t border-white/10">
				<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
					<p>&copy; {new Date().getFullYear()} Your Next Store. Drink happy.</p>
					<p className="uppercase tracking-[0.25em]">A2 Dairy &middot; Real Espresso &middot; No Seed Oils</p>
				</div>
			</div>
		</footer>
	);
}
