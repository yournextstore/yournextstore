import { cacheLife } from "next/cache";
import Link from "next/link";
import { BrandMark } from "@/components/field/brand-mark";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";
import { GRID_REFS, hasMembers } from "@/lib/field";

async function FooterBlogLink() {
	"use cache";
	cacheLife("hours");

	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.blog) {
		return null;
	}

	return (
		<li>
			<Link
				href="/blog"
				className="font-field block py-1.5 text-[0.82rem] tracking-[0.06em] text-dim uppercase transition-colors hover:text-signal"
			>
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
			<Link
				href="/contact"
				className="font-field block py-1.5 text-[0.82rem] tracking-[0.06em] text-dim uppercase transition-colors hover:text-signal"
			>
				Contact Us
			</Link>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const browse = await commerce.collectionBrowse({ limit: 10 });
	const collections = { data: browse.data.filter(hasMembers).slice(0, 5) };

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h2 className="font-field mb-3 text-[0.72rem] font-bold tracking-[0.14em] text-faint">COLLECTIONS</h2>
			<ul>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="font-field block py-1.5 text-[0.82rem] tracking-[0.06em] text-dim uppercase transition-colors hover:text-signal"
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
			<h2 className="font-field mb-3 text-[0.72rem] font-bold tracking-[0.14em] text-faint">LEGAL</h2>
			<ul>
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="font-field block py-1.5 text-[0.82rem] tracking-[0.06em] text-dim uppercase transition-colors hover:text-signal"
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

async function getFooterStore() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return {
		name: me?.store.name || "Field Supply",
		description: me?.store.settings?.storeDescription || null,
	};
}

export async function Footer() {
	const [year, store] = await Promise.all([getCopyrightYear(), getFooterStore()]);

	return (
		<footer className="section-x border-t border-line pt-[clamp(56px,8vh,88px)] pb-10">
			<div className="frame grid gap-10 border-b border-line-2 pb-10 md:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))]">
				<div>
					<Link href="/" className="inline-flex items-center gap-2.5" aria-label={`${store.name} home`}>
						<BrandMark className="text-signal" size={18} />
						<span className="font-display text-[1.32rem] tracking-[0.04em] text-ink">{store.name}</span>
					</Link>
					<p className="font-field mt-4 mb-3.5 flex flex-wrap gap-3 text-[0.72rem] font-bold tracking-[0.14em] text-signal uppercase">
						<span className="grid-ref" aria-hidden="true">
							[ {GRID_REFS[5]} ]
						</span>
						Field notes
					</p>
					<p className="max-w-[38ch] text-[0.94rem] text-dim">
						{store.description ?? "Shelter and kit for the far side of the map."}
					</p>
				</div>

				<div>
					<h2 className="font-field mb-3 text-[0.72rem] font-bold tracking-[0.14em] text-faint">SHOP</h2>
					<ul>
						<li>
							<Link
								href="/products"
								className="font-field block py-1.5 text-[0.82rem] tracking-[0.06em] text-dim uppercase transition-colors hover:text-signal"
							>
								All products
							</Link>
						</li>
						<li>
							<Link
								href="/search"
								className="font-field block py-1.5 text-[0.82rem] tracking-[0.06em] text-dim uppercase transition-colors hover:text-signal"
							>
								Search
							</Link>
						</li>
						<li>
							<Link
								href="/about"
								className="font-field block py-1.5 text-[0.82rem] tracking-[0.06em] text-dim uppercase transition-colors hover:text-signal"
							>
								About
							</Link>
						</li>
						<li>
							<Link
								href="/faq"
								className="font-field block py-1.5 text-[0.82rem] tracking-[0.06em] text-dim uppercase transition-colors hover:text-signal"
							>
								FAQ
							</Link>
						</li>
						<FooterContactLink />
						<FooterBlogLink />
					</ul>
				</div>

				<FooterCollections />
				<FooterLegalPages />
			</div>

			<div className="frame mt-[26px] flex flex-wrap items-center justify-between gap-[18px]">
				<div className="font-field flex flex-wrap items-center gap-2.5 text-[0.72rem] tracking-[0.08em] uppercase">
					<span className="rounded-[2px] border border-signal px-2.5 py-1 font-bold text-signal">
						Open spec
					</span>
					<span className="rounded-[2px] border border-line px-2.5 py-1 text-faint">
						&copy; {year} {store.name}
					</span>
				</div>
				<PaymentMethods />
			</div>
		</footer>
	);
}
