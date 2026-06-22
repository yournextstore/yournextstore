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
			<Link href="/blog" className="hover:text-[#F5F1EB]">
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
			<Link href="/contact" className="hover:text-[#F5F1EB]">
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
		return (
			<div>
				<h3 className="text-[11px] yns-letter-spacing-mid uppercase text-[#F5F1EB]/80">Shop</h3>
				<ul className="mt-5 space-y-3 font-serif text-base italic text-[#F5F1EB]/75">
					<li>
						<Link href="/products" className="hover:text-[#F5F1EB]">
							All Products
						</Link>
					</li>
				</ul>
			</div>
		);
	}

	return (
		<div>
			<h3 className="text-[11px] yns-letter-spacing-mid uppercase text-[#F5F1EB]/80">Shop</h3>
			<ul className="mt-5 space-y-3 font-serif text-base italic text-[#F5F1EB]/75">
				<li>
					<Link href="/products" className="hover:text-[#F5F1EB]">
						All Products
					</Link>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link href={`/collection/${collection.slug}`} className="hover:text-[#F5F1EB]">
							{collection.name}
						</Link>
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
			<h3 className="text-[11px] yns-letter-spacing-mid uppercase text-[#F5F1EB]/80">Legal</h3>
			<ul className="mt-5 space-y-3 font-serif text-base italic text-[#F5F1EB]/75">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link href={`/legal${page.href}`} className="hover:text-[#F5F1EB]">
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

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="yns-footer-wash text-[#F5F1EB]">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-12 pt-20 pb-12 sm:grid-cols-2 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<Link href="/" className="font-serif text-2xl yns-letter-spacing-mid text-[#F5F1EB]">
							YOUR&nbsp;&nbsp;NEXT&nbsp;&nbsp;STORE
						</Link>
						<p className="mt-5 max-w-xs font-serif text-lg italic font-light text-[#F5F1EB]/75 leading-relaxed">
							Clean, considered care for the dog you love.
						</p>
						<p className="mt-5 max-w-xs text-xs leading-relaxed text-[#F5F1EB]/55">
							Cruelty-free, vegan, made in small batches. Every order ships with a complimentary linen
							bandana.
						</p>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] yns-letter-spacing-mid uppercase text-[#F5F1EB]/80">Support</h3>
						<ul className="mt-5 space-y-3 font-serif text-base italic text-[#F5F1EB]/75">
							<li>
								<Link href="/about" className="hover:text-[#F5F1EB]">
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className="hover:text-[#F5F1EB]">
									FAQ
								</Link>
							</li>
							<li>
								<Link href="/search" className="hover:text-[#F5F1EB]">
									Search
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />

					<div>
						<h3 className="text-[11px] yns-letter-spacing-mid uppercase text-[#F5F1EB]/80">Social</h3>
						<ul className="mt-5 space-y-3 font-serif text-base italic text-[#F5F1EB]/75">
							<li>
								<a
									href="https://www.instagram.com/"
									target="_blank"
									rel="noreferrer"
									className="hover:text-[#F5F1EB]"
								>
									Instagram
								</a>
							</li>
							<li>
								<a
									href="https://www.tiktok.com/"
									target="_blank"
									rel="noreferrer"
									className="hover:text-[#F5F1EB]"
								>
									TikTok
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="flex flex-col items-center gap-3 border-t border-[#F5F1EB]/12 py-8 sm:flex-row sm:justify-between">
					<p className="text-[11px] yns-letter-spacing-mid uppercase text-[#F5F1EB]/55">
						&copy; {year} Your Next Store
					</p>
					<p className="text-[11px] yns-letter-spacing-mid uppercase text-[#F5F1EB]/55">
						Made with care · cruelty free · vegan
					</p>
					{/* Official marks on a light chip: they keep their own colours on the dark footer. */}
					<PaymentMethods className="rounded-sm bg-[#F5F1EB] px-2 py-1" />
				</div>
			</div>
		</footer>
	);
}
