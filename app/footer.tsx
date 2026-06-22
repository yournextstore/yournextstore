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
				className="text-sm text-[#fff8e7] hover:text-[#fcefa8] transition-colors"
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
				className="text-sm text-[#fff8e7] hover:text-[#fcefa8] transition-colors"
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
			<h3 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#fcefa8]/80">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[#fff8e7] hover:text-[#fcefa8] transition-colors"
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
			<h3 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#fcefa8]/80">
				The Fine Print
			</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[#fff8e7] hover:text-[#fcefa8] transition-colors"
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
		<footer className="relative bg-[#e8456a] text-[#fff8e7] overflow-hidden">
			<div aria-hidden="true" className="absolute inset-0 opacity-15 bg-confetti pointer-events-none" />
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">
					<div className="col-span-2 md:col-span-1">
						<YnsLink prefetch={"eager"} href="/" className="inline-flex flex-col leading-none">
							<span className="font-display text-[2rem] text-[#fcefa8] -rotate-2 leading-[0.85]">Your</span>
							<span className="font-display text-[2rem] text-[#fff8e7] rotate-1 -mt-2 leading-[0.85]">
								Next Store
							</span>
						</YnsLink>
						<p className="mt-5 text-sm text-[#fff8e7]/85 leading-relaxed max-w-xs">
							Better-for-you classics, baked with chickpeas and a whole lot of joy.
						</p>
						<div className="mt-6 flex items-center gap-3 text-[#fcefa8]">
							{["Instagram", "TikTok", "Pinterest"].map((label) => (
								<span
									key={label}
									className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#fcefa8]/50 hover:bg-[#fcefa8] hover:text-[#e8456a] transition-colors text-xs font-bold"
									title={label}
								>
									<span className="sr-only">{label}</span>
									<span aria-hidden>{label.charAt(0)}</span>
								</span>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#fcefa8]/80">Help</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[#fff8e7] hover:text-[#fcefa8] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[#fff8e7] hover:text-[#fcefa8] transition-colors"
								>
									FAQs
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[#fff8e7] hover:text-[#fcefa8] transition-colors"
								>
									Shop All
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="#about"
									className="text-sm text-[#fff8e7] hover:text-[#fcefa8] transition-colors"
								>
									Our Story
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t-2 border-[#fcefa8]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="text-xs uppercase tracking-[0.2em] text-[#fff8e7]/80">
						&copy; {new Date().getFullYear()} Your Next Store · Baked with chickpeas
					</p>
					<p className="text-xs uppercase tracking-[0.2em] text-[#fcefa8]/80">Made with ♥ for snack time</p>
				</div>
			</div>
		</footer>
	);
}
