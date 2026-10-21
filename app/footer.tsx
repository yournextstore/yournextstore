import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { Separator } from "@/components/separator";
import { getNavGroups, getStoreInfo } from "@/lib/catalog";

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

type Column = { label: string; links: { label: string; href: string }[] };

async function getColumns(): Promise<Column[]> {
	"use cache";
	cacheLife("hours");
	const [info, groups] = await Promise.all([getStoreInfo(), getNavGroups()]);
	const columns: Column[] = [
		{
			label: "Shop",
			links: [
				{ label: "All products", href: "/products" },
				...groups
					.flatMap((group) => group.entries.slice(0, 3))
					.map((e) => ({ label: e.label, href: e.href })),
			],
		},
		{
			label: "Resources",
			links: [
				...(info.blog ? [{ label: "Blog", href: "/blog" }] : []),
				{ label: "About", href: "/about" },
				...(info.contact ? [{ label: "Contact", href: "/contact" }] : []),
				{ label: "FAQ", href: "/faq" },
			],
		},
		{ label: "Legal", links: info.legalPages },
	];
	return columns.filter((column) => column.links.length > 0);
}

export async function Footer() {
	const [year, info, columns] = await Promise.all([getCopyrightYear(), getStoreInfo(), getColumns()]);

	return (
		<footer className="w-full">
			<Separator className="my-12" />
			<div className="flex justify-between gap-8 page-x">
				<div className="mb-6 hidden md:mb-0 md:block">
					<p className="whitespace-nowrap text-sm font-semibold uppercase">{info.storeName}</p>
					<p className="mt-2 text-sm text-muted-foreground">
						© {year} {info.storeName}. All rights reserved.
					</p>
				</div>
				<div className="grid w-full grid-cols-2 gap-8 text-end sm:w-auto sm:grid-cols-3 sm:gap-x-16 sm:gap-y-6">
					{columns.map((column) => (
						<div key={column.label}>
							<h2 className="mb-3 text-sm uppercase">{column.label}</h2>
							<ul className="block space-y-1">
								{column.links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											className="text-sm text-muted-foreground transition duration-300 hover:text-foreground"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
			<p className="mt-8 text-center text-sm text-muted-foreground page-x md:hidden">
				© {year} {info.storeName}. All rights reserved.
			</p>
			<Separator className="mt-8 mb-6" />
			<div className="mb-6 flex flex-col items-center gap-4 page-x">
				{info.socialLinks.length > 0 && (
					<ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
						{info.socialLinks.map((social) => (
							<li key={social.href}>
								<a
									href={social.href}
									target="_blank"
									rel="noreferrer"
									className="transition-colors hover:text-foreground"
								>
									{social.label}
								</a>
							</li>
						))}
					</ul>
				)}
				<PaymentMethods />
			</div>
		</footer>
	);
}
