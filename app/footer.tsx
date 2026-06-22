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
				className="text-sm text-[var(--cobalt)]/75 hover:text-[var(--cobalt)] transition-colors"
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
				className="text-sm text-[var(--cobalt)]/75 hover:text-[var(--cobalt)] transition-colors"
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
			<h3 className="font-display uppercase text-[var(--cobalt)] text-sm tracking-wide mb-4">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[var(--cobalt)]/75 hover:text-[var(--cobalt)] transition-colors"
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
			<h3 className="font-display uppercase text-[var(--cobalt)] text-sm tracking-wide mb-4">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[var(--cobalt)]/75 hover:text-[var(--cobalt)] transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

const socials = [
	{
		label: "Instagram",
		href: "#",
		path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z",
	},
	{
		label: "TikTok",
		href: "#",
		path: "M14 3v10a3 3 0 1 1-3-3v3a6 6 0 1 0 6 6V8a5 5 0 0 0 4 2V7a4 4 0 0 1-4-4h-3Z",
	},
	{
		label: "YouTube",
		href: "#",
		path: "M21 7a3 3 0 0 0-2-2c-2-1-7-1-7-1s-5 0-7 1a3 3 0 0 0-2 2c-1 2-1 5-1 5s0 3 1 5a3 3 0 0 0 2 2c2 1 7 1 7 1s5 0 7-1a3 3 0 0 0 2-2c1-2 1-5 1-5s0-3-1-5ZM10 15V9l5 3-5 3Z",
	},
];

export function Footer() {
	return (
		<footer className="relative bg-[var(--lavender)] text-[var(--cobalt)] overflow-hidden">
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
				<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
					<div className="lg:max-w-xs">
						<YnsLink prefetch={"eager"} href="/" className="font-display text-3xl italic leading-none">
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-[var(--cobalt)]/75 leading-relaxed">
							Better-for-you snacks with a bakery-warm soul. Good stuff, zero fluff.
						</p>
						<div className="mt-6 flex gap-3">
							{socials.map((s) => (
								<a
									key={s.label}
									href={s.href}
									className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--cobalt)]/30 text-[var(--cobalt)] hover:bg-[var(--cobalt)] hover:text-white transition-colors"
								>
									<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
										<path d={s.path} />
									</svg>
									<span className="sr-only">{s.label}</span>
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-display uppercase text-[var(--cobalt)] text-sm tracking-wide mb-4">Help</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[var(--cobalt)]/75 hover:text-[var(--cobalt)] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[var(--cobalt)]/75 hover:text-[var(--cobalt)] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[var(--cobalt)]/75 hover:text-[var(--cobalt)] transition-colors"
								>
									All Snacks
								</YnsLink>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="mt-16 relative">
					<div
						aria-hidden="true"
						className="select-none pointer-events-none font-display italic text-[var(--cobalt)]/12 leading-none text-[20vw] sm:text-[18vw] lg:text-[16vw] -mb-6 truncate"
					>
						your next store
					</div>
					<div className="pt-6 border-t border-[var(--cobalt)]/15 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
						<p className="text-xs text-[var(--cobalt)]/65">
							&copy; {new Date().getFullYear()} Your Next Store. Baked with care.
						</p>
						<p className="text-xs text-[var(--cobalt)]/65 uppercase tracking-wider">
							Good Stuff · Zero Fluff
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
