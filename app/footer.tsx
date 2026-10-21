import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";
import { hasMembers } from "@/lib/editorial";

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
				className="font-readout block py-[5px] text-[0.84rem] text-dim transition-colors hover:text-ink"
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
				className="font-readout block py-[5px] text-[0.84rem] text-dim transition-colors hover:text-ink"
			>
				Contact Us
			</Link>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const browsed = await commerce.collectionBrowse({ limit: 20 });
	const collections = { data: browsed.data.filter(hasMembers).slice(0, 5) };

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h2 className="font-readout mb-3.5 text-[0.68rem] tracking-[0.14em] text-faint uppercase">
				Collections
			</h2>
			<ul>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="font-readout block py-[5px] text-[0.84rem] text-dim transition-colors hover:text-ink"
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
			<h2 className="font-readout mb-3.5 text-[0.68rem] tracking-[0.14em] text-faint uppercase">Legal</h2>
			<ul>
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="font-readout block py-[5px] text-[0.84rem] text-dim transition-colors hover:text-ink"
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
		name: me?.store.name || "Your Next Store",
		description: me?.store.settings?.storeDescription || null,
	};
}

export async function Footer() {
	const [year, store] = await Promise.all([getCopyrightYear(), getFooterStore()]);

	return (
		<footer className="section-x border-t border-line pt-[clamp(48px,7vh,80px)] pb-10">
			<div className="frame grid gap-10 border-b border-line-2 pb-10 md:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))]">
				<div>
					<Link
						href="/"
						className="font-display text-[1.7rem] leading-none text-ink"
						aria-label={`${store.name} home`}
					>
						{store.name}
					</Link>
					<p className="mt-3.5 max-w-[32ch] text-[0.92rem] text-dim">
						{store.description ?? "Espresso equipment, measured to hold its line."}
					</p>
				</div>

				<div>
					<h2 className="font-readout mb-3.5 text-[0.68rem] tracking-[0.14em] text-faint uppercase">
						Explore
					</h2>
					<ul>
						<li>
							<Link
								href="/products"
								className="font-readout block py-[5px] text-[0.84rem] text-dim transition-colors hover:text-ink"
							>
								Shop all
							</Link>
						</li>
						<li>
							<Link
								href="/search"
								className="font-readout block py-[5px] text-[0.84rem] text-dim transition-colors hover:text-ink"
							>
								Search
							</Link>
						</li>
						<li>
							<Link
								href="/about"
								className="font-readout block py-[5px] text-[0.84rem] text-dim transition-colors hover:text-ink"
							>
								About
							</Link>
						</li>
						<li>
							<Link
								href="/faq"
								className="font-readout block py-[5px] text-[0.84rem] text-dim transition-colors hover:text-ink"
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
				<div className="font-readout flex flex-wrap items-center gap-2 text-[0.68rem] tracking-[0.1em]">
					<span className="rounded-[4px] border border-copper/40 px-2.5 py-[5px] text-copper">
						FRESH DAILY
					</span>
					<span className="rounded-[4px] border border-line bg-panel px-2.5 py-[5px] text-dim">
						&copy; {year} {store.name}
					</span>
				</div>
				<PaymentMethods />
			</div>
		</footer>
	);
}
