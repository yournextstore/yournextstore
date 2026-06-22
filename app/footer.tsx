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
				className="text-sm text-white/85 hover:text-[var(--yns-cyan)] transition-colors"
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
				className="text-sm text-white/85 hover:text-[var(--yns-cyan)] transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

const socials = [
	{
		name: "Instagram",
		path: "M2 7a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8m5.5-1.5a1 1 0 1 0 0 .01",
	},
	{ name: "TikTok", path: "M14 4v9a4 4 0 1 1-4-4 4 4 0 0 1 1 .13V13M14 4a5 5 0 0 0 5 5" },
	{
		name: "YouTube",
		path: "M23 7a3 3 0 0 0-2.1-2.1C19 4.5 12 4.5 12 4.5s-7 0-8.9.4A3 3 0 0 0 1 7v10a3 3 0 0 0 2.1 2.1c1.9.4 8.9.4 8.9.4s7 0 8.9-.4A3 3 0 0 0 23 17M10 8.5l6 3.5-6 3.5z",
	},
	{
		name: "Twitter",
		path: "M22 5.8a8 8 0 0 1-2.3.6 4 4 0 0 0 1.8-2.3 8 8 0 0 1-2.6 1A4 4 0 0 0 12 9a11 11 0 0 1-8-4 4 4 0 0 0 1.2 5.3 4 4 0 0 1-1.8-.5v.1a4 4 0 0 0 3.2 4 4 4 0 0 1-1.8.1 4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.6 11 11 0 0 0 8 20.4c7.2 0 11.1-6 11.1-11.2v-.5A8 8 0 0 0 22 5.8z",
	},
];

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="font-display uppercase text-[11px] tracking-[0.22em] text-white/50">Flavors</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/85 hover:text-[var(--yns-cyan)] transition-colors"
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
			<h3 className="font-display uppercase text-[11px] tracking-[0.22em] text-white/50">Fine Print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-white/85 hover:text-[var(--yns-cyan)] transition-colors"
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
		<footer className="bg-black text-white border-t border-white/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
					<div className="col-span-2">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display uppercase text-2xl text-white tracking-tight flex items-center gap-1"
						>
							Your Next Store
							<span className="text-xs align-super text-white/50">™</span>
						</YnsLink>
						<p className="mt-5 text-sm text-white/60 leading-relaxed max-w-sm">
							Protein-packed pints. Real ingredients. No fake stuff. Built in Brooklyn, shipped frozen across
							the country.
						</p>
						<div className="mt-7 flex items-center gap-2">
							{socials.map((s) => (
								<a
									key={s.name}
									href="#"
									className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 hover:border-[var(--yns-cyan)] hover:text-[var(--yns-cyan)] transition-colors"
								>
									<span className="sr-only">{s.name}</span>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={1.6}
										strokeLinecap="round"
										strokeLinejoin="round"
										className="h-4 w-4"
										aria-hidden
									>
										<path d={s.path} />
									</svg>
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-display uppercase text-[11px] tracking-[0.22em] text-white/50">Shop</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-white/85 hover:text-[var(--yns-cyan)] transition-colors"
								>
									All Pints
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-white/85 hover:text-[var(--yns-cyan)] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-white/85 hover:text-[var(--yns-cyan)] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/newsletter"
									className="text-sm text-white/85 hover:text-[var(--yns-cyan)] transition-colors"
								>
									Newsletter
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
					<p className="text-xs text-white/40">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<p className="text-xs text-white/40 uppercase tracking-[0.18em]">
						Made in Brooklyn · Shipped Nationwide
					</p>
				</div>
			</div>
		</footer>
	);
}
