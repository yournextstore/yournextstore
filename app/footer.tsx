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
			<Link
				href="/blog"
				className="font-mono text-[11px] uppercase tracking-[0.22em] text-honey/70 hover:text-honey transition-colors"
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
				className="font-mono text-[11px] uppercase tracking-[0.22em] text-honey/70 hover:text-honey transition-colors"
			>
				Contact Us
			</Link>
		</li>
	);
}

const linkClass =
	"font-mono text-[11px] uppercase tracking-[0.22em] text-honey/70 hover:text-honey transition-colors";
const headingClass = "font-mono mb-5 text-[10px] uppercase tracking-[0.32em] text-honey/55";

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ active: true, limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className={headingClass}>Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link href={`/collection/${collection.slug}`} className={linkClass}>
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
			<h3 className={headingClass}>Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link href={`/legal${page.href}`} className={linkClass}>
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
		<footer className="bg-mahogany relative isolate overflow-hidden text-honey">
			<div className="mx-auto max-w-[1400px] px-6 sm:px-10">
				<div className="grid grid-cols-2 gap-10 py-20 sm:grid-cols-4 lg:grid-cols-5">
					<div className="col-span-2 lg:col-span-2">
						<Link
							href="/"
							className="font-display block text-3xl font-medium uppercase leading-none tracking-tight text-honey sm:text-4xl"
							style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
						>
							Your Next Store
						</Link>
						<p className="font-mono mt-5 max-w-xs text-xs leading-relaxed text-honey/65">
							Small-batch ghee &amp; cultured butter, slow simmered, hand jarred — for the home cook, the
							host, the label-reader.
						</p>
						<div className="mt-8 flex gap-3">
							{["IG", "TT", "PT", "YT"].map((s) => (
								<span
									key={s}
									className="font-mono inline-flex h-9 w-9 items-center justify-center border border-honey/30 text-[10px] uppercase tracking-[0.2em] text-honey/70 transition-colors hover:bg-honey hover:text-mahogany"
								>
									{s}
								</span>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className={headingClass}>Support</h3>
						<ul className="space-y-3">
							<li>
								<Link href="/about" className={linkClass}>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className={linkClass}>
									FAQ
								</Link>
							</li>
							<li>
								<Link href="/products" className={linkClass}>
									Wholesale
								</Link>
							</li>
							<li>
								<Link href="/products" className={linkClass}>
									Find us
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="relative">
					<div
						aria-hidden
						className="font-display pointer-events-none -mb-4 select-none whitespace-nowrap text-[clamp(4rem,15vw,11rem)] font-medium leading-none tracking-tight text-honey/[0.07] sm:-mb-8"
						style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
					>
						Your Next Store.
					</div>
				</div>

				<div className="flex flex-col items-start justify-between gap-2 border-t border-honey/15 py-6 sm:flex-row sm:items-center">
					<p className="font-mono text-[10px] uppercase tracking-[0.25em] text-honey/55">
						© {year} Your Next Store — small batch, big flavor.
					</p>
					<p className="font-mono text-[10px] uppercase tracking-[0.25em] text-honey/55">Vermont, USA</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
