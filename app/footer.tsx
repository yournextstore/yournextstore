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
				className="text-sm text-white/65 hover:text-white transition-colors"
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
				className="text-sm text-white/65 hover:text-white transition-colors"
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
			<h3 className="font-display uppercase text-sm tracking-wider text-white">Flavors</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/65 hover:text-white transition-colors"
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
			<h3 className="font-display uppercase text-sm tracking-wider text-white">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-white/65 hover:text-white transition-colors"
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
		<footer className="bg-[#8b0a1c] text-white relative overflow-hidden">
			<div
				aria-hidden
				className="pointer-events-none absolute -top-20 -right-10 w-80 h-28 jam-capsule opacity-25"
				style={{ transform: "rotate(15deg)" }}
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -bottom-12 -left-16 w-72 h-24 jam-capsule opacity-25"
				style={{ transform: "rotate(-12deg)" }}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="pt-16 pb-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12">
					<div className="col-span-2 lg:col-span-2">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-script text-5xl sm:text-6xl text-white inline-block -rotate-2 leading-none"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-6 text-sm text-white/70 leading-relaxed max-w-xs">
							Frozen PB&amp;J the way it should be. Real fruit jelly, creamy peanut butter, soft crustless
							bread. Pop, go, smile.
						</p>
						<div className="mt-6 flex gap-2">
							{["IG", "TT", "YT", "X"].map((handle) => (
								<a
									key={handle}
									href={`https://${handle.toLowerCase()}.com`}
									className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white text-xs font-bold tracking-wider hover:bg-white hover:text-[#c8132b] transition-colors"
								>
									{handle}
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-display uppercase text-sm tracking-wider text-white">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-white/65 hover:text-white transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-white/65 hover:text-white transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-white/65 hover:text-white transition-colors"
								>
									Store Locator
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-3">
					<p className="text-xs text-white/55 tracking-wide">
						&copy; {new Date().getFullYear()} Your Next Store. Real fruit forever.
					</p>
					<p className="text-xs text-white/55 tracking-wide uppercase">
						Made with peanut butter in California
					</p>
				</div>
			</div>
		</footer>
	);
}
