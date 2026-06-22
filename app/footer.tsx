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
				className="text-sm text-cream/80 hover:text-chili transition-colors"
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
				className="text-sm text-cream/80 hover:text-chili transition-colors"
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
			<h3 className="font-display text-xs uppercase tracking-[0.24em] text-chili">Shop</h3>
			<ul className="mt-5 space-y-3">
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-mahogany hover:text-chili transition-colors"
					>
						All flavors
					</YnsLink>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-mahogany hover:text-chili transition-colors"
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
			<h3 className="font-display text-xs uppercase tracking-[0.24em] text-chili">Fine print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-mahogany hover:text-chili transition-colors"
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
		<footer className="relative bg-charcoal text-cream overflow-hidden">
			<div
				aria-hidden
				className="absolute inset-0 opacity-20 pointer-events-none"
				style={{
					backgroundImage:
						"radial-gradient(circle at 10% 10%, rgba(217,67,39,0.4), transparent 35%), radial-gradient(circle at 90% 90%, rgba(245,229,200,0.1), transparent 40%)",
				}}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Top giant wordmark */}
				<div className="border-b border-cream/10 py-12 sm:py-16">
					<p className="font-display text-[11px] tracking-[0.32em] uppercase text-chili">Until next snack</p>
					<h2 className="mt-4 font-display text-5xl sm:text-7xl lg:text-9xl font-extrabold uppercase leading-[0.85] text-cream">
						YOUR NEXT
						<br />
						<span className="text-chili">STORE.</span>
					</h2>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 py-14">
					<div className="col-span-2 sm:col-span-1 lg:col-span-2 lg:max-w-xs">
						<p className="text-sm text-cream/70 leading-relaxed">
							Savory plant-protein snacks made in small batches. Big flavor in a pocket-sized pouch.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{[
								{
									name: "Instagram",
									path: "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.3 2.3.4.6.2 1 .5 1.5 1 .4.5.8.9 1 1.5.2.4.3 1 .4 2.3.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.9-.4 2.3-.2.6-.5 1-1 1.5-.5.4-.9.8-1.5 1-.4.2-1 .3-2.3.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.3-2.3-.4-.6-.2-1-.5-1.5-1-.4-.5-.8-.9-1-1.5-.2-.4-.3-1-.4-2.3C2.2 15.6 2.2 15.3 2.2 12s0-3.6.1-4.8c.1-1.2.3-1.9.4-2.3.2-.6.5-1 1-1.5.5-.4.9-.8 1.5-1 .4-.2 1-.3 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 5.8.1 4.9.4 4.1.7c-.8.3-1.5.8-2.2 1.5C1.2 2.9.7 3.6.4 4.4.1 5.2-.1 6.1-.1 7.4 0 8.5 0 8.9 0 12.2s0 3.7.1 4.9c.1 1.2.3 2.1.6 2.9.3.8.8 1.5 1.5 2.2.7.7 1.4 1.2 2.2 1.5.8.3 1.7.5 2.9.6 1.3.1 1.7.1 4.9.1s3.6 0 4.9-.1c1.2-.1 2.1-.3 2.9-.6.8-.3 1.5-.8 2.2-1.5.7-.7 1.2-1.4 1.5-2.2.3-.8.5-1.7.6-2.9.1-1.3.1-1.7.1-4.9s0-3.7-.1-4.9c-.1-1.2-.3-2.1-.6-2.9-.3-.8-.8-1.5-1.5-2.2C20.4 1.2 19.7.7 18.9.4 18.1.1 17.2-.1 16-.1 14.7 0 14.3 0 11 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM18.4 4.2a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z",
								},
								{
									name: "TikTok",
									path: "M16.6 5.82s.51.5 0 0A4.27 4.27 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7C12.92 21 15.54 18.39 15.54 15V8.79a7.36 7.36 0 0 0 4.32 1.39V7.1s-1.88.09-3.26-1.28z",
								},
								{
									name: "YouTube",
									path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.5 15.5v-7l6.5 3.5z",
								},
								{
									name: "X",
									path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
								},
							].map((s) => (
								<a
									key={s.name}
									href="https://instagram.com"
									target="_blank"
									rel="noreferrer"
									className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 hover:border-chili hover:bg-chili hover:text-cream transition-colors"
								>
									<span className="sr-only">{s.name}</span>
									<svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
										<title>{s.name}</title>
										<path d={s.path} />
									</svg>
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-display text-xs uppercase tracking-[0.24em] text-chili">Help</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-cream/80 hover:text-chili transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-mahogany hover:text-chili transition-colors text-cream/80 hover:text-chili"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="#newsletter"
									className="text-sm text-cream/80 hover:text-chili transition-colors"
								>
									Giveaway
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="#about"
									className="text-sm text-cream/80 hover:text-chili transition-colors"
								>
									Our story
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-cream/10 py-8">
					<p className="text-xs uppercase tracking-[0.2em] text-cream/50">
						© {new Date().getFullYear()} Your Next Store. Snack responsibly.
					</p>
					<div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-cream/50">
						<span>Non-GMO</span>
						<span aria-hidden>·</span>
						<span>Plant-based</span>
						<span aria-hidden>·</span>
						<span>Small batch</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
