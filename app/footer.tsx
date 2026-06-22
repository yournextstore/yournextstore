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
				className="text-sm text-white/75 hover:text-white transition-colors"
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
				className="text-sm text-white/75 hover:text-white transition-colors"
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
			<h3 className="font-display text-xs uppercase tracking-[0.2em] text-white">Flavors</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/75 hover:text-white transition-colors"
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
			<h3 className="font-display text-xs uppercase tracking-[0.2em] text-white">Fine Print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-white/75 hover:text-white transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

function MarqueeStrip() {
	const phrases = [
		"Real Fruit",
		"Plant-Based",
		"Wonderfully Weird",
		"Under 60 Cal",
		"Clean Ingredients",
		"Big Jiggle Energy",
	];
	const items = [...phrases, ...phrases, ...phrases];
	return (
		<div className="overflow-hidden bg-[var(--pink)] py-4 text-white">
			<div className="marquee-track flex whitespace-nowrap">
				{items.map((p, i) => (
					<span
						key={`${p}-${i}`}
						className="mx-6 flex shrink-0 items-center gap-6 font-display text-base sm:text-lg uppercase tracking-[0.2em]"
					>
						{p}
						<span aria-hidden className="text-[var(--sun)]">
							✦
						</span>
					</span>
				))}
			</div>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="bg-[var(--purple-deep)] text-white">
			<MarqueeStrip />
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
					<div className="sm:col-span-2">
						<YnsLink
							prefetch="eager"
							href="/"
							className="font-script text-4xl text-[var(--pink)] drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-4 max-w-md text-sm leading-relaxed text-white/75">
							Plant-based jiggly snacks made with real fruit, real fun, and zero artificial nonsense. Find us
							in fridges and on shelves near you.
						</p>
						<div className="mt-6 flex gap-3">
							{["IG", "TT", "YT"].map((s) => (
								<span
									key={s}
									className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xs font-bold text-white/90 hover:bg-[var(--pink)] transition-colors"
								>
									{s}
								</span>
							))}
						</div>
					</div>
					<FooterCollections />
					<div>
						<h3 className="font-display text-xs uppercase tracking-[0.2em] text-white">Help</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-white/75 hover:text-white transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-white/75 hover:text-white transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-white/75 hover:text-white transition-colors"
								>
									Store Locator
								</YnsLink>
							</li>
						</ul>
					</div>
					<FooterLegalPages />
				</div>

				<div className="flex flex-col gap-3 border-t border-white/15 py-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs uppercase tracking-[0.2em] text-white/60">
						&copy; {new Date().getFullYear()} Your Next Store — Stay wobbly.
					</p>
					<p className="text-xs uppercase tracking-[0.2em] text-white/60">
						Made with real fruit + a little chaos
					</p>
				</div>
			</div>
		</footer>
	);
}
