import { Camera, Mail, MapPin } from "lucide-react";
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
				className="text-sm text-[#0f0f10]/65 hover:text-[#e11226] transition-colors"
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
				className="text-sm text-[#0f0f10]/65 hover:text-[#e11226] transition-colors"
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
			<h3 className="text-[10px] tracking-[0.36em] uppercase font-semibold text-[#0f0f10]">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[#0f0f10]/65 hover:text-[#e11226] transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-[#0f0f10]/65 hover:text-[#e11226] transition-colors"
					>
						All products
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
			<h3 className="text-[10px] tracking-[0.36em] uppercase font-semibold text-[#0f0f10]">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[#0f0f10]/65 hover:text-[#e11226] transition-colors"
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
		<footer className="relative bg-[#fbf6ec] border-t border-[#0f0f10]/10">
			<div aria-hidden="true" className="absolute inset-0 yns-grain opacity-30" />
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid gap-12 sm:gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
					{/* Brand */}
					<div className="max-w-sm">
						<YnsLink prefetch={"eager"} href="/" className="block">
							<span className="font-serif italic text-[#e11226] text-3xl tracking-tight font-medium">
								Your Next Store
							</span>
							<span className="block text-[9px] tracking-[0.32em] uppercase text-[#0f0f10]/70 mt-1">
								Yes, you&apos;re hot
							</span>
						</YnsLink>
						<p className="mt-5 text-sm text-[#0f0f10]/65 leading-relaxed">
							An elevated soda experience. Infused with aloe vera, prebiotic fibers, and all-natural
							ingredients.
						</p>
						<div className="mt-6 flex items-center gap-3">
							<a
								href="https://instagram.com"
								className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0f0f10]/15 text-[#0f0f10] hover:bg-[#e11226] hover:text-[#fbf6ec] hover:border-[#e11226] transition-colors"
							>
								<Camera className="h-4 w-4" />
							</a>
							<a
								href="mailto:hello@yournextstore.com"
								className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0f0f10]/15 text-[#0f0f10] hover:bg-[#e11226] hover:text-[#fbf6ec] hover:border-[#e11226] transition-colors"
							>
								<Mail className="h-4 w-4" />
							</a>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[10px] tracking-[0.36em] uppercase font-semibold text-[#0f0f10]">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[#0f0f10]/65 hover:text-[#e11226] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[#0f0f10]/65 hover:text-[#e11226] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/search"
									className="text-sm text-[#0f0f10]/65 hover:text-[#e11226] transition-colors"
								>
									Search
								</YnsLink>
							</li>
							<li className="text-sm text-[#0f0f10]/65 flex items-center gap-2">
								<MapPin className="h-3.5 w-3.5" />
								Sunshine, CA
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-8 border-t border-[#0f0f10]/10 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
					<p className="text-xs text-[#0f0f10]/55 tracking-wide">
						© {new Date().getFullYear()} Your Next Store. Stay hot, stay hydrated.
					</p>
					<p className="text-[10px] tracking-[0.36em] uppercase text-[#0f0f10]/45 font-semibold">
						Made with aloe & love
					</p>
				</div>
			</div>
		</footer>
	);
}
