import { Mail, MapPin, Phone } from "lucide-react";
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
				className="text-sm text-[#f5f1ea]/80 hover:text-[#e89b3c] transition-colors"
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
				className="text-sm text-[#f5f1ea]/80 hover:text-[#e89b3c] transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.22em] text-[#f5f1ea]/55 mb-5">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[#f5f1ea]/80 hover:text-[#e89b3c] transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-[#f5f1ea]/80 hover:text-[#e89b3c] transition-colors"
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

	return (
		<div>
			<h3 className="text-[11px] uppercase tracking-[0.22em] text-[#f5f1ea]/55 mb-5">Company</h3>
			<ul className="space-y-3">
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/about"
						className="text-sm text-[#f5f1ea]/80 hover:text-[#e89b3c] transition-colors"
					>
						About Us
					</YnsLink>
				</li>
				<FooterContactLink />
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/faq"
						className="text-sm text-[#f5f1ea]/80 hover:text-[#e89b3c] transition-colors"
					>
						FAQ
					</YnsLink>
				</li>
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-[#f5f1ea]/80 hover:text-[#e89b3c] transition-colors"
					>
						Lookbook
					</YnsLink>
				</li>
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-[#f5f1ea]/80 hover:text-[#e89b3c] transition-colors"
					>
						Trade program
					</YnsLink>
				</li>
				<FooterBlogLink />
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[#f5f1ea]/80 hover:text-[#e89b3c] transition-colors"
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
		<footer className="bg-[#141b24] text-[#f5f1ea]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-10">
				<div className="grid grid-cols-2 md:grid-cols-12 gap-10 sm:gap-12">
					{/* Brand block */}
					<div className="col-span-2 md:col-span-5">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display text-2xl tracking-tight text-[#f5f1ea]"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-5 max-w-sm text-sm text-[#f5f1ea]/65 leading-relaxed">
							Calm, considered furniture for slow homes. Heirloom craft delivered, anywhere.
						</p>
						<ul className="mt-7 space-y-3 text-sm text-[#f5f1ea]/75">
							<li className="flex items-center gap-3">
								<MapPin className="h-4 w-4 text-[#c8a57a]" /> 24 Linen Yard, Brooklyn NY
							</li>
							<li className="flex items-center gap-3">
								<Mail className="h-4 w-4 text-[#c8a57a]" /> hello@yournextstore.com
							</li>
							<li className="flex items-center gap-3">
								<Phone className="h-4 w-4 text-[#c8a57a]" /> +1 (212) 555-0421
							</li>
						</ul>
						<div className="mt-7 flex items-center gap-3">
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-[#f5f1ea]/15 hover:bg-[#e89b3c] hover:text-[#1f2933] hover:border-transparent transition-colors"
							>
								<span className="sr-only">Instagram</span>
								<svg
									aria-hidden="true"
									className="h-4 w-4"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<rect x="3" y="3" width="18" height="18" rx="5" />
									<circle cx="12" cy="12" r="4" />
									<circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
								</svg>
							</a>
							<a
								href="https://pinterest.com"
								target="_blank"
								rel="noopener noreferrer"
								className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-[#f5f1ea]/15 hover:bg-[#e89b3c] hover:text-[#1f2933] hover:border-transparent transition-colors"
							>
								<span className="sr-only">Pinterest</span>
								<svg
									aria-hidden="true"
									className="h-4 w-4"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="12" cy="12" r="9" />
									<path d="M11 7.5c2.5 0 4.5 1.5 4.5 4 0 2.5-1.6 4-3.5 4-1 0-1.7-.5-1.7-.5L9.6 19" />
								</svg>
							</a>
						</div>
					</div>

					<div className="md:col-span-2">
						<FooterCollections />
					</div>
					<div className="md:col-span-2">
						<FooterLegalPages />
					</div>
					<div className="md:col-span-3">
						<h3 className="text-[11px] uppercase tracking-[0.22em] text-[#f5f1ea]/55 mb-5">Visit us</h3>
						<ul className="space-y-3 text-sm text-[#f5f1ea]/80">
							<li>Brooklyn Showroom · 11–7 daily</li>
							<li>Lisbon Atelier · by appointment</li>
							<li>Copenhagen Pop-up · Spring 2026</li>
						</ul>
					</div>
				</div>

				{/* Oversized wordmark */}
				<div aria-hidden="true" className="mt-16 sm:mt-20 overflow-hidden">
					<div className="brand-wordmark text-[22vw] sm:text-[18vw] lg:text-[15vw] text-[#f5f1ea]/95 leading-[0.78] -mb-[2vw]">
						Your Next Store
					</div>
				</div>

				<div className="mt-10 pt-6 border-t border-[#f5f1ea]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#f5f1ea]/55">
					<p>&copy; {new Date().getFullYear()} Your Next Store. Slow craft, anywhere.</p>
					<p className="uppercase tracking-[0.22em]">Made by hand · Shipped with care</p>
				</div>
			</div>
		</footer>
	);
}
