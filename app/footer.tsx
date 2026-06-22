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
			<h3 className="font-label text-white/55 mb-5">SHOP</h3>
			<ul className="space-y-3">
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
			<h3 className="font-label text-white/55 mb-5">LEGAL</h3>
			<ul className="space-y-3">
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

export function Footer() {
	return (
		<footer className="bg-[#231b15] text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10 sm:gap-12">
					{/* Brand */}
					<div className="col-span-2">
						<YnsLink prefetch={"eager"} href="/" className="font-editorial text-2xl font-medium text-white">
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-white/65 leading-relaxed max-w-xs">
							Functional mushroom gummies — sourced, dual-extracted, and tested for what actually moves the
							needle.
						</p>
						<div className="mt-7 flex items-center gap-3">
							{[
								{
									name: "Instagram",
									path: "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.3 2.3.4.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.1.4.3 1.1.4 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.8-.4 2.3-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.4.1-1.1.3-2.3.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.3-2.3-.4-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.1-.4-.3-1.1-.4-2.3-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.3-1.8.4-2.3.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .4-.1 1.1-.3 2.3-.4 1.2-.1 1.6-.1 4.8-.1zm0 5.3a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm5.5-.6a1.1 1.1 0 11-2.1 0 1.1 1.1 0 012.1 0zm-5.5 2.5a2.6 2.6 0 110 5.2 2.6 2.6 0 010-5.2z",
								},
								{
									name: "X",
									path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
								},
								{
									name: "TikTok",
									path: "M19.6 6.3a4.9 4.9 0 01-3-1.4 4.9 4.9 0 01-1.3-2.9h-3.5v13.4a2.4 2.4 0 11-2.4-2.4c.3 0 .5.1.8.1V9.6a5.9 5.9 0 105.9 5.9V9.2a8.4 8.4 0 003.5 1z",
								},
							].map((s) => (
								<a
									key={s.name}
									href="/"
									className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 hover:bg-white hover:text-[#231b15] transition-colors"
								>
									<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
										<path d={s.path} />
									</svg>
									<span className="sr-only">{s.name}</span>
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-label text-white/55 mb-5">SUPPORT</h3>
						<ul className="space-y-3">
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
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-white/75 hover:text-white transition-colors"
								>
									Shop all
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<p className="font-label text-[11px] text-white/45">
						© {new Date().getFullYear()} YOUR NEXT STORE. ALL RIGHTS RESERVED.
					</p>
					<p className="font-label text-[11px] text-white/45">
						SOURCED · DUAL-EXTRACTED · THIRD-PARTY TESTED
					</p>
				</div>
			</div>
		</footer>
	);
}
