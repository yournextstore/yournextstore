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
				className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
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
				className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
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
			<h3 className="text-xs font-bold uppercase tracking-[0.25em] text-fizz-sky">Drinks</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
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
			<h3 className="text-xs font-bold uppercase tracking-[0.25em] text-fizz-sky">Fine Print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
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
		<footer className="bg-fizz-yellow text-fizz-ink">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-4 gap-10 gap-y-12">
					<div className="col-span-2">
						<p className="text-xs font-bold uppercase tracking-[0.3em] text-fizz-sky">Your Next Store</p>
						<p className="mt-4 text-base font-semibold text-fizz-ink/80 max-w-sm leading-relaxed">
							Five-times distilled spirits, purified still water, natural fruit. Crafted for the fizz-free
							era.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{["Instagram", "TikTok", "Spotify"].map((s) => (
								<a
									key={s}
									href="#"
									className="inline-flex items-center justify-center h-10 px-4 rounded-full bg-fizz-ink text-fizz-yellow text-xs font-bold uppercase tracking-[0.18em] hover:bg-fizz-berry transition-colors"
								>
									{s}
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs font-bold uppercase tracking-[0.25em] text-fizz-sky">Help</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
								>
									Stockists
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/search"
									className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
								>
									Search
								</YnsLink>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Oversized wordmark */}
				<div className="border-t-2 border-fizz-ink/15 py-10 sm:py-12">
					<p
						aria-hidden="true"
						className="font-display uppercase text-fizz-ink leading-[0.85] tracking-[-0.02em] text-[clamp(3rem,15vw,12rem)] text-center"
					>
						YOUR NEXT STORE
					</p>
				</div>

				<div className="py-6 border-t-2 border-fizz-ink/15 flex flex-col sm:flex-row gap-3 sm:gap-6 items-center justify-between">
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-fizz-ink/70">
						© {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-fizz-ink/70">
						Drink responsibly · 21+
					</p>
				</div>
			</div>
		</footer>
	);
}
