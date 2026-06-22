import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
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
			<Link href="/blog" className="text-sm text-[#F5EFE6]/65 hover:text-[#8FB1C7] transition-colors">
				Blog
			</Link>
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
			<Link href="/contact" className="text-sm text-[#F5EFE6]/65 hover:text-[#8FB1C7] transition-colors">
				Contact Us
			</Link>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ active: true, limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#F5EFE6] mb-5">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-[#F5EFE6]/65 hover:text-[#8FB1C7] transition-colors"
						>
							{collection.name}
						</Link>
					</li>
				))}
				<li>
					<Link href="/products" className="text-sm text-[#F5EFE6]/65 hover:text-[#8FB1C7] transition-colors">
						All Products
					</Link>
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
			<h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#F5EFE6] mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-[#F5EFE6]/65 hover:text-[#8FB1C7] transition-colors"
						>
							{page.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

const socials = [
	{ name: "Instagram", href: "#" },
	{ name: "TikTok", href: "#" },
	{ name: "Pinterest", href: "#" },
];

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="bg-[#0F1820] text-[#F5EFE6]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10 sm:gap-12">
					<div className="col-span-2 sm:col-span-4 lg:col-span-2 lg:max-w-sm">
						<Link
							href="/"
							className="headline-display text-2xl sm:text-3xl tracking-[0.12em] text-[#F5EFE6] block"
						>
							YOUR NEXT STORE
						</Link>
						<p className="script-tag text-xl text-[#8FB1C7] mt-3">make laundry day a vibe</p>
						<p className="mt-5 text-sm text-[#F5EFE6]/65 leading-relaxed max-w-xs">
							Plant-based, refillable, dye-free essentials for the people and the planet you love.
						</p>
						<div className="mt-6 flex flex-wrap gap-3">
							{socials.map((s) => (
								<a
									key={s.name}
									href={s.href}
									className="inline-flex h-9 px-4 items-center rounded-full border border-[#F5EFE6]/15 text-xs uppercase tracking-[0.14em] text-[#F5EFE6]/80 hover:border-[#8FB1C7] hover:text-[#8FB1C7] transition-colors"
								>
									{s.name}
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#F5EFE6] mb-5">Help</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-[#F5EFE6]/65 hover:text-[#8FB1C7] transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-[#F5EFE6]/65 hover:text-[#8FB1C7] transition-colors"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-[#F5EFE6]/65 hover:text-[#8FB1C7] transition-colors"
								>
									Refills
								</Link>
							</li>
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-sm text-[#F5EFE6]/65 hover:text-[#8FB1C7] transition-colors"
								>
									Contact
								</a>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-[#F5EFE6]/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
					<p className="text-xs uppercase tracking-[0.18em] text-[#F5EFE6]/45">
						&copy; {year} Your Next Store · Made with bubbles in Brooklyn
					</p>
					<p className="text-xs uppercase tracking-[0.18em] text-[#F5EFE6]/45">Plastic Negative Since 2024</p>
					{/* Card marks are full-colour logos: a cream chip keeps them legible on the navy footer. */}
					<PaymentMethods className="rounded-md bg-[#F5EFE6] p-2" />
				</div>
			</div>
		</footer>
	);
}
