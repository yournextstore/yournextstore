import { cacheLife } from "next/cache";
import Link from "next/link";
import type { NavLink } from "@/app/navbar";
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
			<Link href="/blog" className="text-muted-foreground hover:underline underline-offset-4">
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
			<Link href="/contact" className="text-muted-foreground hover:underline underline-offset-4">
				Contact Us
			</Link>
		</li>
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
			<h2 className={FOOTER_HEADING}>Legal</h2>
			<ul className="space-y-4">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-muted-foreground hover:underline underline-offset-4"
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

async function getStoreDescription() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return (
		me?.store.settings?.storeDescription ||
		"Everyday tech accessories, chosen with care: picked for how they look, how they work and how long they last."
	);
}

const FOOTER_HEADING = "mb-4 font-semibold text-[#374151] uppercase";

export async function Footer({ storeName, links }: { storeName: string; links: NavLink[] }) {
	const [year, description] = await Promise.all([getCopyrightYear(), getStoreDescription()]);

	return (
		<footer className="bg-band text-muted-foreground">
			<div className="grid grid-cols-1 gap-8 px-6 py-10 text-center md:grid-cols-2 md:text-left lg:grid-cols-4">
				<div>
					<h2 className={FOOTER_HEADING}>{storeName}</h2>
					<p className="mx-auto max-w-xs md:mx-0">{description}</p>
				</div>
				<div>
					<h2 className={FOOTER_HEADING}>Shop</h2>
					<ul className="space-y-4">
						{links
							.filter((link) => link.href !== "/blog")
							.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className="text-muted-foreground hover:underline underline-offset-4">
										{link.href === "/products" ? "All products" : link.label}
									</Link>
								</li>
							))}
					</ul>
				</div>
				<div>
					<h2 className={FOOTER_HEADING}>About</h2>
					<ul className="space-y-4">
						<li>
							<Link href="/about" className="text-muted-foreground hover:underline underline-offset-4">
								About us
							</Link>
						</li>
						<FooterBlogLink />
						<li>
							<Link href="/faq" className="text-muted-foreground hover:underline underline-offset-4">
								FAQ
							</Link>
						</li>
						<FooterContactLink />
					</ul>
				</div>
				<FooterLegalPages />
			</div>
			<div className="flex flex-col items-center gap-4 bg-band-deep p-6 text-center sm:flex-row sm:justify-center sm:gap-8">
				<p>
					&copy; {year}, {storeName}
				</p>
				<PaymentMethods />
			</div>
		</footer>
	);
}
