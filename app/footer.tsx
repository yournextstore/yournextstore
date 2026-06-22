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
			<Link href="/blog" className="text-sm text-[#FAF2E6]/70 transition-colors hover:text-[#E8A22A]">
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
			<Link href="/contact" className="text-sm text-[#FAF2E6]/70 transition-colors hover:text-[#E8A22A]">
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
			<h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FAF2E6]">Collections</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-[#FAF2E6]/70 transition-colors hover:text-[#E8A22A]"
						>
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
			<h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FAF2E6]">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-[#FAF2E6]/70 transition-colors hover:text-[#E8A22A]"
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

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="relative overflow-hidden bg-[#8C1F2A] text-[#FAF2E6]">
			{/* Top scallop edge */}
			<svg
				aria-hidden="true"
				viewBox="0 0 1200 36"
				preserveAspectRatio="none"
				className="block h-6 w-full text-[#F6ECDC]"
			>
				<title>scalloped divider</title>
				<path
					d="M0 36 V18 Q30 0 60 18 T120 18 T180 18 T240 18 T300 18 T360 18 T420 18 T480 18 T540 18 T600 18 T660 18 T720 18 T780 18 T840 18 T900 18 T960 18 T1020 18 T1080 18 T1140 18 T1200 18 V36 Z"
					fill="currentColor"
				/>
			</svg>

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid gap-10 py-14 sm:grid-cols-2 sm:py-16 lg:grid-cols-5">
					{/* Brand */}
					<div className="lg:col-span-2">
						<div className="flex items-center gap-3">
							<span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF2E6] text-[#8C1F2A]">
								<span className="font-display text-base font-black">YNS</span>
							</span>
							<span className="font-display text-2xl font-black uppercase tracking-tight">
								Your Next Store
							</span>
						</div>
						<p className="mt-5 max-w-sm text-sm leading-relaxed text-[#FAF2E6]/75">
							Hand-roasted, family-made wholesome snacks. Real ingredients, organic oats, and a whole lot of
							love — packed in our little Hudson Valley kitchen.
						</p>
						<form className="mt-6 flex max-w-sm gap-2">
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								className="h-11 flex-1 rounded-full border border-[#FAF2E6]/25 bg-[#FAF2E6]/5 px-4 text-sm text-[#FAF2E6] placeholder:text-[#FAF2E6]/45 outline-none focus:border-[#FAF2E6]/60"
							/>
							<button
								type="submit"
								className="h-11 shrink-0 rounded-full bg-[#E8A22A] px-5 text-[12px] font-bold uppercase tracking-[0.18em] text-[#2A2A2A] transition-colors hover:bg-[#FAF2E6]"
							>
								Join
							</button>
						</form>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FAF2E6]">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-[#FAF2E6]/70 transition-colors hover:text-[#E8A22A]"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-[#FAF2E6]/70 transition-colors hover:text-[#E8A22A]"
								>
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
							<li>
								<Link
									href="/products"
									className="text-sm text-[#FAF2E6]/70 transition-colors hover:text-[#E8A22A]"
								>
									Shop all
								</Link>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="flex flex-col items-start justify-between gap-3 border-t border-[#FAF2E6]/15 py-6 sm:flex-row sm:items-center">
					<p className="text-xs text-[#FAF2E6]/60">© {year} Your Next Store. Baked with love.</p>
					<div className="flex flex-col items-start gap-3 sm:items-end">
						<p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FAF2E6]/45">
							Organic · Gluten-free · Family-roasted
						</p>
						<PaymentMethods />
					</div>
				</div>
			</div>
		</footer>
	);
}
