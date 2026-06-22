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
				className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors"
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
				className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors"
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
			<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8a8f94]">Catalog</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors"
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
			<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8a8f94]">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors"
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
		<footer className="bg-[#0f1012] text-[#f2f3f5]">
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
				{/* Giant wordmark band */}
				<div className="border-b border-[#22262a] py-14 sm:py-20">
					<h2 className="display-headline text-[clamp(2.5rem,11vw,9rem)] text-[#f2f3f5] leading-[0.85]">
						Your Next
						<br />
						Store.
					</h2>
				</div>

				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 py-14 sm:py-16">
					<div className="lg:col-span-2 max-w-xs">
						<p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8a8f94]">Your Next Store</p>
						<p className="mt-5 text-sm leading-relaxed text-[#c8ccd0]">
							Premium hardware for the next generation of commerce. Designed, engineered, and assembled with
							obsession.
						</p>
						<div className="mt-6 flex items-center gap-2 text-xs text-[#8a8f94]">
							<span className="inline-block size-1.5 rounded-full bg-[#22c55e] signal-dot" />
							<span className="font-mono uppercase tracking-[0.2em]">All systems nominal</span>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8a8f94]">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="#reserve"
									className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors"
								>
									Test Ride
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[#c8ccd0] hover:text-[#f2f3f5] transition-colors"
								>
									Shop
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-[#22262a] py-6 text-xs text-[#8a8f94]">
					<p className="font-mono uppercase tracking-[0.2em]">
						© {new Date().getFullYear()} Your Next Store · Edition 01
					</p>
					<p className="font-mono uppercase tracking-[0.2em]">Designed on Earth · Built to last</p>
				</div>
			</div>
		</footer>
	);
}
