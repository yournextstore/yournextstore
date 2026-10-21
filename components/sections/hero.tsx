import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { picturedFirst } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { displayName } from "@/lib/display";
import { YNSMedia } from "@/lib/yns-media";
import { HeroCarousel } from "./hero-carousel";

const ctaClass =
	"inline-flex items-center bg-accent px-8 py-4 text-sm font-medium uppercase tracking-widest text-accent-foreground transition-colors hover:bg-accent/90";

async function getSpotlight() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 24 }).catch(() => ({ data: [] }));
	const withImages = picturedFirst(data).filter((product) => (product.images ?? []).length > 0);
	return withImages.slice(0, 3).map((product) => ({
		slug: product.slug,
		name: displayName(product.name),
		image: product.images?.[0] ?? "",
	}));
}

function SlideCopy({
	title,
	subtitle,
	cta,
	href,
	heading,
}: {
	title: string;
	subtitle: string;
	cta: string;
	href: string;
	heading: "h1" | "p";
}) {
	const Heading = heading;
	return (
		<div className="relative z-10 flex h-full items-center">
			<div className="wrapper">
				<div className="max-w-xl">
					<Heading className="mb-4 font-display text-4xl font-bold leading-tight text-hero-ink sm:text-5xl lg:text-6xl">
						{title}
					</Heading>
					<p className="mb-8 text-lg font-light leading-relaxed text-hero-ink/85">{subtitle}</p>
					<Link href={href} className={ctaClass}>
						{cta}
						<ArrowRight aria-hidden="true" className="ml-2 size-4" />
					</Link>
				</div>
			</div>
		</div>
	);
}

const scrim =
	"absolute inset-0 bg-linear-to-r from-[hsl(160_27%_8%/0.75)] via-[hsl(160_27%_8%/0.35)] to-transparent";

export async function Hero() {
	const spotlight = await getSpotlight();

	const slides = [
		<div key="art" className="h-full">
			<Image
				src="/images/pexels/tv-hero-olive.jpg"
				alt=""
				fill
				priority
				sizes="100vw"
				className="object-cover object-[70%_50%]"
			/>
			<div className={scrim} />
			<SlideCopy
				heading="h1"
				title="Discover the Art of Tea"
				subtitle="Loose-leaf green, black, oolong and herbal teas from named gardens, and the teaware to brew them well."
				cta="Shop Collection"
				href="/products"
			/>
		</div>,
		...(spotlight.length > 0
			? [
					<div key="ritual" className="h-full bg-[hsl(160_27%_14%)]">
						<div className="absolute inset-y-0 right-0 hidden w-[58%] grid-cols-3 gap-3 py-10 pr-11 md:grid">
							{spotlight.map((item) => (
								<div key={item.slug} className="relative overflow-hidden rounded-md">
									<YNSMedia src={item.image} alt="" fill sizes="20vw" className="object-cover" />
								</div>
							))}
						</div>
						{spotlight[0] && (
							<div className="absolute inset-0 md:hidden">
								<YNSMedia src={spotlight[0].image} alt="" fill sizes="100vw" className="object-cover" />
							</div>
						)}
						<div className={`${scrim} md:hidden`} />
						<SlideCopy
							heading="p"
							title="The Ritual of the Pot"
							subtitle="A few favourites from the tea shelf, each one worth a slow morning."
							cta="Explore Now"
							href="/products"
						/>
					</div>,
				]
			: []),
		<div key="bloom" className="h-full">
			<Image
				src="/images/pexels/tv-hero-armchairs.jpg"
				alt=""
				fill
				sizes="100vw"
				className="object-cover object-[60%_50%]"
			/>
			<div className={scrim} />
			<SlideCopy
				heading="p"
				title="Brewed Slowly"
				subtitle="Teapots, cups and caddies for a few calm minutes over a good pot of tea."
				cta="Shop All"
				href="/products"
			/>
		</div>,
	];
	const labels = [
		"Discover the Art of Tea",
		...(spotlight.length > 0 ? ["The Ritual of the Pot"] : []),
		"Brewed Slowly",
	];

	return <HeroCarousel slides={slides} labels={labels} />;
}
