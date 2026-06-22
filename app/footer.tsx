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
				className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
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
				className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
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
			<h3 className="eyebrow text-bone/60 text-[0.65rem] mb-5">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
					>
						All Products
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

	if (pages.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="eyebrow text-bone/60 text-[0.65rem] mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
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
		<footer className="bg-ink text-bone">
			<div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-20 pb-10">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-10">
					<div className="col-span-2 md:col-span-1">
						<YnsLink prefetch={"eager"} href="/" className="font-serif text-2xl tracking-[0.18em] text-bone">
							YOUR NEXT STORE
						</YnsLink>
						<p className="mt-5 font-serif italic text-bone/65 text-base leading-relaxed max-w-xs">
							Intimate by nature. Intuitive by design. Made slowly, in small batches.
						</p>
					</div>

					<FooterCollections />

					<div>
						<h3 className="eyebrow text-bone/60 text-[0.65rem] mb-5">Atelier</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="#about"
									className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
								>
									About
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="#muses"
									className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
								>
									Muses
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
								>
									Stockists
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="mt-20 pt-8 border-t border-bone/15">
					<p className="font-serif italic text-clay/80 text-center text-3xl sm:text-5xl tracking-[0.25em] mb-8">
						Y&nbsp;·&nbsp;N&nbsp;·&nbsp;S
					</p>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<p className="eyebrow text-bone/45 text-[0.6rem]">
							© {new Date().getFullYear()} Your Next Store — All Rights Reserved
						</p>
						<p className="eyebrow text-bone/45 text-[0.6rem]">Made slowly · Shipped warmly · Worldwide</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
