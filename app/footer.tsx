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
				className="text-sm text-[#fbe5ea]/80 hover:text-[#fbe5ea] transition-colors"
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
				className="text-sm text-[#fbe5ea]/80 hover:text-[#fbe5ea] transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.3em] text-[#d9a441] font-semibold">Collections</h3>
			<ul className="mt-4 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[#fbe5ea]/80 hover:text-[#fbe5ea] transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.3em] text-[#d9a441] font-semibold">Legal</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[#fbe5ea]/80 hover:text-[#fbe5ea] transition-colors"
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
		<footer className="bg-[#7a0e15] text-[#fbe5ea] relative">
			<div className="hayati-star-row absolute inset-x-0 top-0 h-4 opacity-80" aria-hidden />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
					<div className="col-span-2">
						<YnsLink prefetch={"eager"} href="/" className="font-display italic text-3xl text-[#fbe5ea]">
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-[#fbe5ea]/75 leading-relaxed max-w-sm">
							An Arabic food company celebrating the beauty of the Arab world — one tin, one letter, one
							family-milled spice at a time.
						</p>
						<div className="mt-6 flex items-center gap-3 text-[#d9a441]">
							<span className="hayati-star" />
							<span className="hayati-star" />
							<span className="hayati-star" />
							<span className="hayati-star" />
							<span className="hayati-star" />
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] uppercase tracking-[0.3em] text-[#d9a441] font-semibold">Support</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[#fbe5ea]/80 hover:text-[#fbe5ea] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[#fbe5ea]/80 hover:text-[#fbe5ea] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="#about"
									className="text-sm text-[#fbe5ea]/80 hover:text-[#fbe5ea] transition-colors"
								>
									Our story
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="#impact"
									className="text-sm text-[#fbe5ea]/80 hover:text-[#fbe5ea] transition-colors"
								>
									Impact &amp; sourcing
								</YnsLink>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="hayati-divider py-4">
					<span className="hayati-star" />
					<span className="hayati-star" />
					<span className="hayati-star" />
				</div>

				<div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[0.25em] text-[#fbe5ea]/60">
					<p>&copy; {new Date().getFullYear()} Your Next Store. Made with love.</p>
					<p>Tinned in small batches · Shipped worldwide</p>
				</div>
			</div>
		</footer>
	);
}
