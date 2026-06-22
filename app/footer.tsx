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
				className="text-sm text-white/70 hover:text-white transition-colors"
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
				className="text-sm text-white/70 hover:text-white transition-colors"
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
			<h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/70 hover:text-white transition-colors"
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
			<h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-white/70 hover:text-white transition-colors"
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
		<footer className="relative bg-brand-ink text-white overflow-hidden">
			<svg
				aria-hidden
				viewBox="0 0 200 200"
				className="absolute -top-24 -right-10 h-72 w-72 text-brand-coral/15"
			>
				<title>blob</title>
				<path
					fill="currentColor"
					d="M48.2,-58.7C61.2,-50.6,69.4,-34.1,71.3,-17.4C73.2,-0.6,68.8,16.4,59.4,29.2C50,42,35.6,50.6,20.3,57.4C5,64.2,-11.2,69.1,-25,64.6C-38.8,60.1,-50.2,46.1,-57.5,30.9C-64.8,15.6,-67.9,-0.9,-63.4,-15C-58.9,-29.1,-46.7,-40.7,-33.5,-49.1C-20.2,-57.4,-5.8,-62.5,8.7,-63.5C23.2,-64.5,46.4,-61.4,48.2,-58.7Z"
					transform="translate(100 100)"
				/>
			</svg>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-14 sm:py-20 grid grid-cols-2 sm:grid-cols-12 gap-10">
					<div className="col-span-2 sm:col-span-5">
						<YnsLink prefetch={"eager"} href="/" className="font-display text-3xl tracking-tight text-white">
							Your <span className="text-brand-mustard italic">Next</span> Store
						</YnsLink>
						<p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
							Dessert snacks with functionality. Real fruits, real nuts, real superfoods — packed with
							nostalgia and zero compromise.
						</p>
						<div className="mt-6 flex items-center gap-2">
							<span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
								Plant-based
							</span>
							<span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
								Gluten free
							</span>
						</div>
					</div>

					<div className="sm:col-span-2">
						<FooterCollections />
					</div>

					<div className="sm:col-span-2">
						<h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-white/70 hover:text-white transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-white/70 hover:text-white transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="#about"
									className="text-sm text-white/70 hover:text-white transition-colors"
								>
									Our Story
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<div className="sm:col-span-3">
						<FooterLegalPages />
					</div>
				</div>

				<div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="text-xs text-white/60">
						&copy; {new Date().getFullYear()} Your Next Store. Made with real fruit and love.
					</p>
					<p className="text-xs text-white/60 uppercase tracking-[0.18em]">
						Snack <span className="text-brand-mustard">Bites</span> Co.
					</p>
				</div>
			</div>
		</footer>
	);
}
