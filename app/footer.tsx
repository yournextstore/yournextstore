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
			<YnsLink prefetch={"eager"} href="/blog" className="hover:text-[#F5F1EB]">
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
			<YnsLink prefetch={"eager"} href="/contact" className="hover:text-[#F5F1EB]">
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
		return (
			<div>
				<h3 className="text-[11px] yns-letter-spacing-mid uppercase text-[#F5F1EB]/80">Shop</h3>
				<ul className="mt-5 space-y-3 font-serif text-base italic text-[#F5F1EB]/75">
					<li>
						<YnsLink prefetch="eager" href="/products" className="hover:text-[#F5F1EB]">
							All Products
						</YnsLink>
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
					<YnsLink prefetch="eager" href="/products" className="hover:text-[#F5F1EB]">
						All Products
					</YnsLink>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch="eager"
							href={`/collection/${collection.slug}`}
							className="hover:text-[#F5F1EB]"
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
			<h3 className="text-[11px] yns-letter-spacing-mid uppercase text-[#F5F1EB]/80">Legal</h3>
			<ul className="mt-5 space-y-3 font-serif text-base italic text-[#F5F1EB]/75">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink prefetch="eager" href={`/legal${page.href}`} className="hover:text-[#F5F1EB]">
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
		<footer className="yns-footer-wash text-[#F5F1EB]">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-12 pt-20 pb-12 sm:grid-cols-2 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<YnsLink
							prefetch="eager"
							href="/"
							className="font-serif text-2xl yns-letter-spacing-mid text-[#F5F1EB]"
						>
							YOUR&nbsp;&nbsp;NEXT&nbsp;&nbsp;STORE
						</YnsLink>
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
								<YnsLink prefetch="eager" href="/about" className="hover:text-[#F5F1EB]">
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink prefetch="eager" href="/faq" className="hover:text-[#F5F1EB]">
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink prefetch="eager" href="/search" className="hover:text-[#F5F1EB]">
									Search
								</YnsLink>
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
						&copy; {new Date().getFullYear()} Your Next Store
					</p>
					<p className="text-[11px] yns-letter-spacing-mid uppercase text-[#F5F1EB]/55">
						Made with care · cruelty free · vegan
					</p>
				</div>
			</div>
		</footer>
	);
}
