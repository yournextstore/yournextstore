import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

// One cached read for every link the footer shows: the platform pages that exist for this
// store (contact, blog, legal) sit beside the catalogue and About.
async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [me, legal] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;
	const links: FooterLink[] = [
		{ href: "/products", label: "All products" },
		{ href: "/about", label: "About us" },
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact us" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];
	return {
		storeName: me?.store.name || "Your Next Store",
		description: me?.store.settings?.storeDescription || null,
		links,
		year: new Date().getFullYear(),
	};
}

/** The original's peach card, overlapping whatever closes the page by its rounded corners. */
export async function Footer() {
	const { storeName, description, links, year } = await getFooterData();

	return (
		<footer className="relative z-10 -mt-5">
			<div className="relative overflow-hidden rounded-xl bg-peach px-4 py-8 md:px-8 md:py-10">
				<div className="flex flex-col justify-between md:flex-row">
					<div className="pb-4">
						<Link href="/" className="text-ui-lg font-bold tracking-[0.18em] uppercase">
							{storeName}
						</Link>
						{description && <p className="mt-4 max-w-xs leading-paragraph text-[#5e5e5e]">{description}</p>}
					</div>
					<ul className="my-16 w-full max-w-[22rem] columns-2 gap-x-8 self-start text-ui-md font-bold md:my-0 md:max-w-[27rem]">
						{links.map((link) => (
							<li key={link.href} className="mb-6 break-inside-avoid">
								<Link href={link.href} className="link-underline">
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div className="flex flex-col gap-4 text-ui-sm text-[#5e5e5e] sm:flex-row sm:items-end sm:justify-between">
					<p>
						&copy; {year} {storeName}. All rights reserved.
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
