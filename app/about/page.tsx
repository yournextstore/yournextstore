import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/separator";
import { Badge } from "@/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getNavGroups, getStoreInfo } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `About ${storeName} and how ordering works.`;

	return {
		title: "About",
		description,
		alternates: { canonical: "/about" },
		openGraph: {
			type: "website",
			title: "About",
			description,
			url: "/about",
		},
	};
}

async function getAboutData() {
	"use cache";
	cacheLife("hours");
	const [info, groups, products] = await Promise.all([
		getStoreInfo(),
		getNavGroups(),
		commerce.productBrowse({ active: true, limit: 1 }).catch(() => null),
	]);
	return { ...info, groups, productCount: products?.meta.count ?? null };
}

const card = "rounded-lg border bg-card p-6 text-card-foreground shadow-sm";

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, storeDescription, contact, groups, productCount } = await getAboutData();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: storeDescription ?? `About ${storeName} and what you can find in the shop.`,
	};

	return (
		<div className="pt-4 page-x">
			<JsonLdScript data={aboutJsonLd} />
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/">Home</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>About</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Heading
				as="h1"
				title={`About ${storeName}`}
				description={storeDescription ?? "A little about the shop and how ordering works."}
			/>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
				<section className={card}>
					<h2 className="font-bold tracking-tight">The shop</h2>
					<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
						{productCount
							? `${storeName} currently lists ${productCount} ${productCount === 1 ? "product" : "products"}`
							: `${storeName} is getting its catalogue ready`}
						{groups.length > 0
							? `, grouped into ${groups
									.map(
										(group) =>
											`${group.entries.length} ${group.entries.length === 1 ? group.label.toLowerCase().replace(/ies$/, "y").replace(/s$/, "") : group.label.toLowerCase()}`,
									)
									.join(" and ")}.`
							: "."}
					</p>
					{groups.flatMap((group) => group.entries).length > 0 && (
						<ul className="mt-4 flex flex-wrap gap-2">
							{groups
								.flatMap((group) => group.entries)
								.map((entry) => (
									<li key={entry.href}>
										<Badge variant="outline" asChild>
											<Link href={entry.href}>{entry.label}</Link>
										</Badge>
									</li>
								))}
						</ul>
					)}
				</section>
				<section className={card}>
					<h2 className="font-bold tracking-tight">Ordering</h2>
					<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
						Add products to your cart and check out securely. Shipping options and the final total are shown
						at checkout before you pay, and your orders are kept in your account.
					</p>
				</section>
				<section className={card}>
					<h2 className="font-bold tracking-tight">Questions</h2>
					<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
						{contact
							? "Something we can help with? Send us a message, or look through the common questions first."
							: "Common questions about orders, payments and your account are answered in the FAQ."}
					</p>
				</section>
			</div>

			<Separator className="my-8" />
			<div className="flex flex-col gap-2 sm:flex-row">
				<Button asChild>
					<Link href="/products">Browse products</Link>
				</Button>
				<Button asChild variant="outline">
					<Link href={contact ? "/contact" : "/faq"}>{contact ? "Contact" : "Read the FAQ"}</Link>
				</Button>
			</div>
		</div>
	);
}
