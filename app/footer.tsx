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
				className="font-display text-xl text-cream hover:text-gold transition-colors"
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
				className="font-display text-xl text-cream hover:text-gold transition-colors"
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
			<h3 className="font-condensed text-[11px] tracking-[0.32em] text-gold">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="font-display text-xl text-cream hover:text-gold transition-colors"
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
			<h3 className="font-condensed text-[11px] tracking-[0.32em] text-gold">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="font-display text-xl text-cream hover:text-gold transition-colors"
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
		<footer className="relative bg-soot text-cream overflow-hidden">
			<div aria-hidden className="absolute inset-0 bg-soot-gradient opacity-90" />
			<div
				aria-hidden
				className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-ember/20 blur-3xl pointer-events-none"
			/>

			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
				{/* Top giant wordmark */}
				<div className="pt-16 pb-10 border-b border-cream/10">
					<YnsLink
						prefetch={"eager"}
						href="/"
						className="block font-condensed text-[14vw] sm:text-[12vw] lg:text-[10vw] leading-none tracking-[-0.01em] text-cream/95 hover:text-gold transition-colors"
					>
						YOUR NEXT STORE
					</YnsLink>
				</div>

				<div className="py-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
					<div className="col-span-2">
						<h3 className="font-condensed text-[11px] tracking-[0.32em] text-gold">The Kitchen</h3>
						<p className="mt-5 text-cream/75 leading-relaxed max-w-sm">
							Hand-jarred pasta sauce with attitude. Slow-simmered with Sangiovese, scorched garlic, and the
							loudest chilies we can legally ship.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{["Instagram", "TikTok", "YouTube"].map((s) => (
								<a
									key={s}
									href="#"
									className="inline-flex h-9 px-3 items-center justify-center border border-cream/25 font-condensed text-[10px] tracking-[0.28em] text-cream/85 hover:bg-cream hover:text-soot transition-colors"
								>
									{s}
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-condensed text-[11px] tracking-[0.32em] text-gold">Help</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="font-display text-xl text-cream hover:text-gold transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="font-display text-xl text-cream hover:text-gold transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<a
									href="#contact"
									className="font-display text-xl text-cream hover:text-gold transition-colors"
								>
									Contact
								</a>
							</li>
							<li>
								<a
									href="#find-us"
									className="font-display text-xl text-cream hover:text-gold transition-colors"
								>
									Find Us
								</a>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-cream/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="font-condensed text-[10px] tracking-[0.28em] text-cream/55">
						© {new Date().getFullYear()} Your Next Store · Made with garlic & spite.
					</p>
					<p className="font-condensed text-[10px] tracking-[0.28em] text-cream/55">
						Brooklyn · Napoli · The Pot On The Stove
					</p>
				</div>
			</div>
		</footer>
	);
}
