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
				className="text-sm text-white/85 hover:text-white transition-colors"
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
				className="text-sm text-white/85 hover:text-white transition-colors"
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Collections</h3>
			<ul className="mt-4 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/85 hover:text-white transition-colors"
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Legal</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-white/85 hover:text-white transition-colors"
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
		<footer className="bg-[color:var(--brick-ink)] text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
					{/* Brand */}
					<div className="max-w-sm">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="inline-flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-white"
						>
							<span
								aria-hidden
								className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/70"
							>
								<span className="block h-2.5 w-2.5 rounded-[2px] border border-white/70" />
							</span>
							YOUR NEXT STORE
						</YnsLink>
						<p className="mt-5 text-sm text-white/65 leading-relaxed">
							Intentional tech for a calmer life. Designed with care, built to last.
						</p>
						<div className="mt-6 flex items-center gap-2">
							<span className="inline-flex h-9 items-center rounded-full border border-white/15 px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
								iOS
							</span>
							<span className="inline-flex h-9 items-center rounded-full border border-white/15 px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
								Android
							</span>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Support</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-white/85 hover:text-white transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-white/85 hover:text-white transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="#story"
									className="text-sm text-white/85 hover:text-white transition-colors"
								>
									Our Story
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-white/85 hover:text-white transition-colors"
								>
									Shop
								</YnsLink>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
					<p className="text-xs text-white/55">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<p className="text-xs text-white/55">Made for focused humans.</p>
				</div>
			</div>
		</footer>
	);
}
