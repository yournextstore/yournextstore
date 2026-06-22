import { Music, Send, Sparkle } from "lucide-react";
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
				className="text-[14px] text-white/80 hover:text-white transition-colors"
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
				className="text-[14px] text-white/80 hover:text-white transition-colors"
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

	return (
		<div>
			<h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b4a4dd]">Shop</h3>
			<ul className="mt-5 space-y-3">
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-[14px] text-white/80 hover:text-white transition-colors"
					>
						All bottles
					</YnsLink>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-[14px] text-white/80 hover:text-white transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink
						prefetch={"eager"}
						href="#bundles"
						className="text-[14px] text-white/80 hover:text-white transition-colors"
					>
						Build a bundle
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

	return (
		<div>
			<h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b4a4dd]">Company</h3>
			<ul className="mt-5 space-y-3">
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/#about"
						className="text-[14px] text-white/80 hover:text-white transition-colors"
					>
						Our story
					</YnsLink>
				</li>
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-[14px] text-white/80 hover:text-white transition-colors"
					>
						Sustainability
					</YnsLink>
				</li>
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-[14px] text-white/80 hover:text-white transition-colors"
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
		<footer className="bg-[#0f0d18] text-white">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="grid grid-cols-2 md:grid-cols-5 gap-10 py-16 sm:py-20">
					{/* Brand */}
					<div className="col-span-2">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display text-[36px] font-bold tracking-tight text-white"
						>
							Your Next Store<span className="text-[#b4a4dd]">.</span>
						</YnsLink>
						<p className="mt-4 text-[14px] text-white/65 leading-relaxed max-w-xs">
							Quietly considered hydration. Eleven shades, one shape, infinitely reusable.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{[Sparkle, Send, Music].map((Icon, i) => (
								<a
									key={i}
									href="#"
									className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 hover:bg-[#5e3ca8] hover:border-[#5e3ca8] transition-colors"
								>
									<Icon className="h-4 w-4" strokeWidth={1.8} />
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b4a4dd]">Help</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-[14px] text-white/80 hover:text-white transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-[14px] text-white/80 hover:text-white transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-[14px] text-white/80 hover:text-white transition-colors"
								>
									Contact
								</a>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-[14px] text-white/80 hover:text-white transition-colors"
								>
									Shipping & returns
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-[14px] text-white/80 hover:text-white transition-colors"
								>
									Care guide
								</YnsLink>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 py-7 border-t border-white/10">
					<p className="text-[12px] text-white/45">
						&copy; {new Date().getFullYear()} Your Next Store. Bottled with care.
					</p>
					<div className="flex items-center gap-2 text-white/40">
						{["VISA", "MC", "AMEX", "PAYPAL", "APAY", "GPAY"].map((p) => (
							<span
								key={p}
								className="text-[9px] font-bold tracking-wider px-2 py-1 rounded border border-white/15"
							>
								{p}
							</span>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
