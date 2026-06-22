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
				className="text-sm text-foreground/60 hover:text-bone transition-colors"
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
				className="text-sm text-foreground/60 hover:text-bone transition-colors"
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
			<h3 className="text-[10px] tracking-[0.28em] uppercase text-bone mb-5">Collections</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/60 hover:text-bone transition-colors"
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
			<h3 className="text-[10px] tracking-[0.28em] uppercase text-bone mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-foreground/60 hover:text-bone transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

const SOCIAL = [
	{ name: "Instagram", href: "#" },
	{ name: "TikTok", href: "#" },
	{ name: "Strava", href: "#" },
	{ name: "YouTube", href: "#" },
] as const;

export function Footer() {
	return (
		<footer className="relative granite border-t border-white/5">
			{/* Giant wordmark */}
			<div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-20 sm:pt-28">
				<div className="font-display font-light leading-[0.85] tracking-[-0.03em] text-bone/95 text-[22vw] sm:text-[20vw] lg:text-[18vw]">
					<span className="italic">Quality</span> Hydration<span className="text-foreground/40">™</span>
				</div>
			</div>

			<div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-16">
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 sm:gap-12 pb-16 border-t border-white/10 pt-12">
					{/* Brand */}
					<div className="col-span-2 max-w-xs">
						<div className="font-display text-base font-semibold tracking-[0.35em] uppercase text-bone">
							Y.N.S
						</div>
						<p className="mt-4 text-sm text-foreground/60 leading-relaxed">
							Your Next Store. A sports drink designed to replace what you sweat. Formulated in Boulder,
							canned in Pennsylvania, tested everywhere in between.
						</p>
						<div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
							{SOCIAL.map((s) => (
								<a
									key={s.name}
									href={s.href}
									className="text-[11px] tracking-[0.22em] uppercase text-foreground/60 hover:text-bone transition-colors"
								>
									{s.name}
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[10px] tracking-[0.28em] uppercase text-bone mb-5">Support</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-foreground/60 hover:text-bone transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-foreground/60 hover:text-bone transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-foreground/60 hover:text-bone transition-colors"
								>
									Subscriptions
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="#contact"
									className="text-sm text-foreground/60 hover:text-bone transition-colors"
								>
									Contact
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-8 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
					<p className="text-xs text-foreground/45">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<p className="text-[10px] tracking-[0.28em] uppercase text-foreground/45">
						Formulated for what comes next.
					</p>
				</div>
			</div>
		</footer>
	);
}
