import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";
import { hasMembers } from "@/lib/editorial";

const linkClass =
	"rounded-lg px-[0.6rem] py-[0.35rem] text-[0.84rem] text-dim transition-colors hover:bg-line-2 hover:text-ink";

type FooterLink = { href: string; label: string };

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [me, collections, legal] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.collectionBrowse({ limit: 20 }).catch(() => ({ data: [] })),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;
	const shop: FooterLink[] = [
		{ href: "/products", label: "Shop" },
		{ href: "/#patch", label: "Patch it" },
		{ href: "/#specs", label: "Specs" },
		{ href: "/#systems", label: "Systems" },
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Blog" }] : []),
	];
	return {
		name: me?.store.name || "Your Next Store",
		year: new Date().getFullYear(),
		shop,
		collections: collections.data
			.filter(hasMembers)
			.slice(0, 5)
			.map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	};
}

export async function Footer() {
	const { name, year, shop, collections, legal } = await getFooterData();

	return (
		<footer className="section-x relative z-[1] border-t border-line pt-12 pb-[2.4rem]">
			<div className="frame flex flex-wrap items-center justify-between gap-4 pb-[1.4rem]">
				<Link href="/" className="font-display text-[1.35rem] text-ink">
					{name}
				</Link>
				<nav aria-label="Footer" className="-mx-[0.6rem] flex flex-wrap gap-[0.3rem]">
					{shop.map((link) => (
						<Link key={link.href} href={link.href} className={linkClass}>
							{link.label}
						</Link>
					))}
				</nav>
			</div>
			{(collections.length > 0 || legal.length > 0) && (
				<div className="frame flex flex-wrap gap-x-10 gap-y-4 border-t border-line-2 py-[1.4rem]">
					{collections.length > 0 && <FooterGroup title="Collections" links={collections} />}
					{legal.length > 0 && <FooterGroup title="Legal" links={legal} />}
				</div>
			)}
			<div className="frame font-plate flex flex-wrap items-center justify-between gap-4 border-t border-line-2 pt-[1.4rem] text-[0.72rem] text-faint">
				<span>
					© {year} {name} — every patch is one of one.
				</span>
				<PaymentMethods />
			</div>
		</footer>
	);
}

function FooterGroup({ title, links }: { title: string; links: FooterLink[] }) {
	return (
		<div className="flex flex-wrap items-center gap-x-1 gap-y-1">
			<h2 className="plate-label mr-2">{title}</h2>
			{links.map((link) => (
				<Link key={link.href} href={link.href} className={linkClass}>
					{link.label}
				</Link>
			))}
		</div>
	);
}
