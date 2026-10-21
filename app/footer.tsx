import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { getCatalogCategories, getStoreIdentity } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { wordmark } from "@/lib/display";

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	tiktok: "TikTok",
	x: "X",
	linkedin: "LinkedIn",
	youtube: "YouTube",
} as const;

type Column = { title: string; links: { href: string; label: string }[] };

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [identity, categories, legal, socials] = await Promise.all([
		getStoreIdentity(),
		getCatalogCategories(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const socialLinks = Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
		const href = socials?.socials[key as keyof typeof SOCIAL_LABELS];
		return href ? [{ href, label }] : [];
	});
	const columns: Column[] = [
		{
			title: "Client Service",
			links: [
				{ href: "/faq", label: "FAQ" },
				...(identity.contactFormEnabled ? [{ href: "/contact", label: "Contact" }] : []),
				{ href: "/search", label: "Search" },
			],
		},
		{
			title: "Our Brand",
			links: [
				{ href: "/about", label: "Our Story" },
				...(identity.blogEnabled ? [{ href: "/blog", label: "Journal" }] : []),
				{ href: "/products", label: "All Products" },
			],
		},
		{
			title: "Shop",
			links: categories.slice(0, 4).map((category) => ({
				href: `/category/${category.slug}`,
				label: category.name,
			})),
		},
	].filter((column) => column.links.length > 0);

	return {
		storeName: wordmark(identity.storeName),
		columns,
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		socialLinks,
		year: new Date().getFullYear(),
	};
}

export async function Footer() {
	const { storeName, columns, legal, socialLinks, year } = await getFooterData();

	return (
		<footer className="mt-24">
			{/* The original's taupe "Follow us on" band; without social profiles it points into the shop. */}
			<div className="mx-auto max-w-screen-2xl px-5 max-[400px]:px-3">
				<div className="flex flex-col items-center justify-center gap-3 bg-taupe px-4 py-9 text-center text-white">
					{socialLinks.length > 0 ? (
						<>
							<p className="text-base font-light">Follow us on:</p>
							<ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
								{socialLinks.map((social) => (
									<li key={social.label}>
										<a href={social.href} target="_blank" rel="noreferrer" className="hover:underline">
											{social.label}
										</a>
									</li>
								))}
							</ul>
						</>
					) : (
						<>
							<p className="text-base font-light">The full collection, in one place</p>
							<Link href="/products" className="text-sm underline underline-offset-4 hover:no-underline">
								Browse all products
							</Link>
						</>
					)}
				</div>
			</div>

			<div className="mx-auto max-w-screen-2xl border-b-8 border-taupe px-5 max-[400px]:px-3">
				<div className="mt-12 flex justify-center gap-24 text-center max-[800px]:flex-col max-[800px]:gap-10">
					{columns.map((column) => (
						<div key={column.title} className="flex flex-col gap-1">
							<h2 className="mb-1 text-2xl font-bold max-sm:text-xl">{column.title}</h2>
							{column.links.map((link) => (
								<Link key={link.href} href={link.href} className="text-lg hover:underline max-sm:text-base">
									{link.label}
								</Link>
							))}
						</div>
					))}
				</div>
				<div className="my-20 flex flex-col items-center gap-8">
					<PaymentMethods />
					<p className="max-w-full text-center text-6xl font-light [overflow-wrap:anywhere] max-sm:text-4xl">
						{storeName}
					</p>
					<p className="text-center text-base max-sm:text-sm">All rights reserved &copy;{year}</p>
					{legal.length > 0 && (
						<ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-base max-sm:text-sm">
							{legal.map((page) => (
								<li key={page.href}>
									<Link href={page.href} className="hover:underline">
										{page.label}
									</Link>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</footer>
	);
}
