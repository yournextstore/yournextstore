import { CircleHelp, Lock, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FeatureBanner } from "@/components/home/feature-banner";
import { HomeTabs } from "@/components/home/home-tabs";
import { SlideShow } from "@/components/home/slideshow";
import { ProductGrid } from "@/components/sections/product-grid";
import { Button } from "@/components/ui/button";
import { EDITORIAL, getCatalog, getFreeShipping } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

function HomePageLayout({
	heading,
	subheading,
	children,
}: {
	heading: string;
	subheading: string;
	children: React.ReactNode;
}) {
	return (
		<>
			<div className="mb-12 flex flex-col items-center justify-center gap-2 pt-2 text-center">
				<h1 className="text-4xl font-extrabold tracking-tight text-balance lg:text-5xl">{heading}</h1>
				<p className="text-3xl font-semibold tracking-tight text-balance text-muted-foreground">
					{subheading}
				</p>
			</div>
			{children}
		</>
	);
}

export default async function Home() {
	const [catalog, freeShipping] = await Promise.all([getCatalog(), getFreeShipping()]);
	const featured = catalog.collections[0];
	const firstCollection = catalog.collections[0];
	// Collections first, then departments, so the tab grid fills its row even with one collection.
	const browse = [
		...catalog.collections.map((c) => ({ ...c, href: `/collection/${c.slug}` })),
		...catalog.categories.map((c) => ({ ...c, href: `/category/${c.slug}` })),
	];
	// Whole rows only on the four-up grid: a lone card in a second row looks unfinished.
	const browseFit = browse.slice(0, browse.length > 4 ? Math.min(8, browse.length - (browse.length % 4)) : 4);

	const slides = [
		{
			kicker: "Welcome",
			title: "Everyday essentials, all in one place",
			text: `${catalog.productCount} products to explore`,
			href: "/products",
			cta: "Shop Now",
		},
		...catalog.collections.slice(0, 1).map((c) => ({
			kicker: "Featured collection",
			title: `Discover ${c.name}`,
			text: c.description,
			href: `/collection/${c.slug}`,
			cta: "Shop Now",
		})),
		...catalog.categories.slice(0, 2).map((c) => ({
			kicker: "Shop by department",
			title: `Browse ${c.name}`,
			text: c.description,
			href: `/category/${c.slug}`,
			cta: "Shop Now",
		})),
	].slice(0, EDITORIAL.hero.length);

	const shop = (
		<HomePageLayout
			heading="Online shopping made easy."
			subheading={
				catalog.collections.length > 1
					? `Shop ${catalog.productCount} products across ${catalog.collections.length} collections.`
					: `Shop ${catalog.productCount} products in one place.`
			}
		>
			<ProductGrid limit={8} />
			{featured && (
				<div className="mt-12 flex w-full flex-col items-center justify-center gap-2 rounded-md bg-banner p-12 text-center text-banner-foreground">
					<p className="text-sm font-medium uppercase tracking-wide">Featured collection</p>
					<h2 className="text-3xl font-bold">{featured.name}</h2>
					<p>{featured.description}</p>
					<Button
						variant="secondary"
						className="mt-6"
						nativeButton={false}
						render={<Link href={`/collection/${featured.slug}`} />}
					>
						Explore collection
					</Button>
				</div>
			)}
			<div className="mt-12 flex flex-col gap-4 md:grid md:grid-cols-3">
				<FeatureBanner
					heading={freeShipping ? "Free Shipping" : "Delivery"}
					text={
						freeShipping
							? `Free shipping on orders over ${freeShipping}`
							: "Delivery options and costs are shown at checkout."
					}
					icon={<Truck aria-hidden size={32} />}
				/>
				<FeatureBanner
					heading="Secure Checkout"
					text="Pay safely with the methods offered at checkout."
					icon={<Lock aria-hidden size={32} />}
				/>
				<FeatureBanner
					heading="Help Centre"
					text="Answers to common questions in our FAQ."
					icon={<CircleHelp aria-hidden size={32} />}
				/>
			</div>
		</HomePageLayout>
	);

	const collections = (
		<HomePageLayout heading="Browse the store." subheading="Collections and departments, in one place.">
			<ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{browseFit.map((c) => (
					<li key={c.href}>
						<Link href={c.href} className="group block overflow-hidden rounded-md border border-border">
							<span className="relative block h-36 w-full bg-secondary">
								{c.image && (
									<YNSMedia
										src={c.image}
										alt=""
										fill
										sizes="(max-width: 640px) 100vw, 25vw"
										className="object-cover"
									/>
								)}
							</span>
							<span className="block p-4">
								<span className="block font-semibold group-hover:underline">{c.name}</span>
								<span className="line-clamp-1 text-sm text-muted-foreground">{c.description}</span>
							</span>
						</Link>
					</li>
				))}
			</ul>
			{firstCollection && (
				<div className="mt-12 grid place-content-center">
					<Button nativeButton={false} render={<Link href="/products" />}>
						View All Products
					</Button>
				</div>
			)}
		</HomePageLayout>
	);

	return (
		<div>
			<SlideShow images={EDITORIAL.hero.slice(0, slides.length)} slides={slides} />
			<div className="mx-auto max-w-[1400px] p-6">
				<HomeTabs
					tabs={[
						{ label: "For Shoppers", content: shop },
						{ label: "Collections", content: collections },
					]}
				/>
			</div>
		</div>
	);
}
