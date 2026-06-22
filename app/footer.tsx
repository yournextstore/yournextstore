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
				className="text-base font-medium text-ink hover:text-cherry transition-colors"
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
				className="text-base font-medium text-ink hover:text-cherry transition-colors"
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
			<h3 className="text-xs font-bold uppercase tracking-[0.3em] text-ink/60">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-base font-medium text-ink hover:text-cherry transition-colors"
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
			<h3 className="text-xs font-bold uppercase tracking-[0.3em] text-ink/60">Fine print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-base font-medium text-ink hover:text-cherry transition-colors"
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
		<footer className="relative bg-cream border-t-2 border-ink overflow-hidden">
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 lg:grid-cols-4 gap-10">
					<div className="col-span-2">
						<p className="text-base font-semibold text-ink/80 leading-relaxed max-w-xs">
							Spreadable, dippable, infinitely enjoyable goods — sourced with love, served with crunch.
						</p>
						<div className="mt-6 flex flex-wrap gap-2">
							<span className="rounded-full bg-sky text-ink px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
								Free shipping $45+
							</span>
							<span className="rounded-full bg-mustard text-ink px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
								Small batch
							</span>
						</div>
					</div>

					<FooterCollections />

					<div className="space-y-10">
						<div>
							<h3 className="text-xs font-bold uppercase tracking-[0.3em] text-ink/60">Support</h3>
							<ul className="mt-5 space-y-3">
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/about"
										className="text-base font-medium text-ink hover:text-cherry transition-colors"
									>
										About Us
									</YnsLink>
								</li>
								<FooterContactLink />
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/faq"
										className="text-base font-medium text-ink hover:text-cherry transition-colors"
									>
										FAQ
									</YnsLink>
								</li>
								<li>
									<a
										href="mailto:hello@yournextstore.com"
										className="text-base font-medium text-ink hover:text-cherry transition-colors"
									>
										Contact
									</a>
								</li>
								<li>
									<YnsLink
										prefetch={"eager"}
										href="#stockists"
										className="text-base font-medium text-ink hover:text-cherry transition-colors"
									>
										Where to find us
									</YnsLink>
								</li>
								<FooterBlogLink />
							</ul>
						</div>
						<FooterLegalPages />
					</div>
				</div>

				<div
					className="yns-display text-ink leading-[0.85] py-6 select-none"
					style={{ fontSize: "clamp(4rem, 14vw, 13rem)" }}
					aria-hidden="true"
				>
					<span className="block">YOUR&nbsp;NEXT</span>
					<span className="block text-cherry">STORE.</span>
				</div>

				<div className="border-t border-ink/15 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="text-xs font-semibold uppercase tracking-widest text-ink/60">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<p className="text-xs font-semibold uppercase tracking-widest text-ink/60">
						Dippable · Spreadable · Infinitely Enjoyable
					</p>
				</div>
			</div>
		</footer>
	);
}
