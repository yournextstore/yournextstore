import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { StoreLogo } from "@/components/store-logo";
import { commerce, meGetCached } from "@/lib/commerce";

const linkClass = "inline-block py-1.5 text-sm text-foreground transition-colors hover:text-muted-foreground";
const sentenceCase = (label: string) => label.charAt(0).toUpperCase() + label.slice(1);

async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, categories, collections, legal] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.categoriesBrowse({ active: true, limit: 20 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 5 }).catch(() => ({ data: [] })),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;

	return {
		storeName: me?.store.name || "Your Next Store",
		description: me?.store.settings?.storeDescription || null,
		currency: me?.store.currency ?? null,
		blog: tools?.blog ?? false,
		contact: tools?.contactForm ?? false,
		products: [
			...categories.data
				.filter((category) => category.active && !category.parentId)
				.slice(0, 6)
				.map((category) => ({ href: `/category/${category.slug}`, label: sentenceCase(category.name) })),
			...collections.data.map((collection) => ({
				href: `/collection/${collection.slug}`,
				label: sentenceCase(collection.name),
			})),
		],
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		// `new Date()` is an unstable value: caching pins it to the entry so the footer stays in the shell.
		year: new Date().getFullYear(),
	};
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
	if (links.length === 0) return null;
	return (
		<div>
			<h2 className="text-sm text-muted-foreground">{title}</h2>
			<ul className="mt-4 grid gap-1.5 md:mt-6">
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href} className={linkClass}>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export async function Footer() {
	const data = await getFooterData();

	const shop = [
		{ href: "/products", label: "All products" },
		{ href: "/search", label: "Search" },
		...(data.blog ? [{ href: "/blog", label: "Journal" }] : []),
	];
	const help = [
		{ href: "/about", label: "About us" },
		{ href: "/faq", label: "FAQ" },
		...(data.contact ? [{ href: "/contact", label: "Contact" }] : []),
		...data.legal,
	];

	return (
		<footer className="bg-muted">
			<div className="shell pt-12 pb-6 md:pt-14">
				<div className="grid gap-10 text-center md:grid-cols-4 md:gap-8 md:text-left">
					<div className="flex flex-col items-center gap-4 md:items-start md:gap-6">
						<StoreLogo name={data.storeName} />
						<p className="max-w-xs text-sm">
							{data.description ?? `Thanks for stopping by ${data.storeName}. New pieces land here first.`}
						</p>
					</div>
					<div className="grid grid-cols-2 gap-8 text-left md:col-span-3 md:grid-cols-3">
						<FooterColumn title="Our products" links={data.products.length > 0 ? data.products : shop} />
						<FooterColumn title="Shop" links={data.products.length > 0 ? shop : []} />
						<div className="col-span-2 md:col-span-1">
							<FooterColumn title="Help" links={help} />
						</div>
					</div>
				</div>

				<div className="mt-10 flex flex-col items-center gap-4 border-t border-ring/60 pt-6 text-sm text-muted-foreground md:mt-12 md:flex-row md:justify-between">
					<p>
						&copy; {data.storeName} {data.year}
					</p>
					<PaymentMethods />
					{data.currency && <p>All prices in {data.currency}</p>}
				</div>
			</div>
		</footer>
	);
}
