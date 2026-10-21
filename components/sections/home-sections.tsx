import { ArrowRight, Coffee, Flame, Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Carousel } from "@/components/carousel";
import { PillLink } from "@/components/pill-link";
import { ProductCard } from "@/components/product-card";
import { PhotoHero } from "@/components/sections/hero";
import { getFeaturedRail, getStoryImages } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/** A product photograph in the slot the original filled with a packshot of its coffee bag. */
function StoryPhoto({
	image,
	className,
}: {
	image?: { src: string; alt: string; slug: string };
	className?: string;
}) {
	if (!image) return null;
	return (
		<Link href={`/product/${image.slug}`} className={className} aria-label={image.alt}>
			<span className="relative block aspect-[420/520] overflow-hidden rounded-3xl bg-muted shadow-[0_24px_48px_-16px_rgb(15_23_42/0.35)]">
				<YNSMedia
					src={image.src}
					alt=""
					fill
					sizes="(max-width: 768px) 20rem, 26rem"
					className="object-cover"
				/>
			</span>
		</Link>
	);
}

/** "Building Community / one cup at a time" with a photo lapping over the hero, then the wide shop banner. */
export async function CommunitySection() {
	const [image] = await getStoryImages(1);

	return (
		<>
			<div className="page-container relative flex flex-col-reverse items-center px-14 pt-0 pb-14 xl:px-[5.375rem] md:pt-1 lg:flex-row lg:pt-24">
				<StoryPhoto
					image={image}
					className="mt-12 block w-64 md:absolute md:-top-60 md:left-4 md:mt-0 md:w-72 lg:left-20 lg:w-[22rem] xl:w-[26.25rem]"
				/>
				<div className="flex flex-col justify-center max-md:items-center md:w-full">
					<div className="flex w-full text-center md:text-left">
						<h2 className="mx-auto mt-12 font-script text-display-lg sm:text-display-xl md:ml-[34%] lg:mr-auto lg:ml-[37%] lg:text-display-2xl xl:ml-[32%] xl:text-display-3xl">
							Building Community
						</h2>
					</div>
					<p className="mt-6 font-display text-display-lg max-sm:text-center lg:mt-8 lg:text-display-xl xl:mt-10 xl:text-display-2xl">
						one cup at a time
					</p>
				</div>
			</div>
			<div className="page-container pb-14 max-sm:px-14">
				<div className="relative h-[37rem] overflow-hidden rounded-3xl">
					<Image
						src="/images/pexels/wardrobe-wall.jpg"
						alt="A bright café with wooden tables and tall steel-framed windows"
						fill
						sizes="(max-width: 1536px) 100vw, 1536px"
						className="object-cover"
					/>
				</div>
			</div>
		</>
	);
}

const benefits = [
	{
		title: "Traceable Beans",
		description:
			"Every coffee is listed with its country, region and process, so you know where the beans in your cup were grown.",
		Icon: Leaf,
	},
	{
		title: "Roasted in Small Batches",
		description:
			"We roast each origin in small batches and adjust the profile to bring out what makes it different.",
		Icon: Flame,
	},
	{
		title: "Ground to Order",
		description:
			"Choose whole bean or a grind for filter or espresso, in a 250 g bag or a 1 kg bag for the office.",
		Icon: Coffee,
	},
];

/** The original's ListItems: an Italiana title over a hairline, three icon columns. */
export function BenefitsSection() {
	return (
		<section className="page-container px-14 pb-14 lg:px-16 xl:px-[5.375rem]">
			<h2 className="font-display text-xl">About our products</h2>
			<div className="mt-1 mb-8 w-full border-t border-ink" />
			<div className="flex flex-col gap-10 md:flex-row md:gap-6 lg:gap-16">
				{benefits.map((benefit) => (
					<div key={benefit.title} className="flex flex-1 flex-col gap-5 text-sm">
						<span className="grid size-15 place-items-center rounded-full bg-tan text-white">
							<benefit.Icon aria-hidden="true" className="size-8" strokeWidth={1.5} />
						</span>
						<h3 className="font-bold">{benefit.title}</h3>
						<p>{benefit.description}</p>
					</div>
				))}
			</div>
		</section>
	);
}

/** The original's "Our Blends": the store's first collection as a carousel with a "View all" link. */
export async function ProductRailSection() {
	const { title, href, products } = await getFeaturedRail();
	if (products.length === 0) return null;

	return (
		<section className="page-container pt-14 pb-[6.25rem] lg:pt-16">
			<div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
				<h2 className="font-display text-display-md">{title}</h2>
				<Link
					href={href}
					className="inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline"
				>
					View all
					<span className="sr-only"> {title}</span>
					<ArrowRight className="size-4" aria-hidden="true" />
				</Link>
			</div>
			<Carousel label={title}>
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3.75rem)/4)]"
						sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
					/>
				))}
			</Carousel>
		</section>
	);
}

const steps = [
	{
		title: "Choose your coffee",
		description: "Pick a single origin, a blend or a discovery box, then choose your grind and bag size.",
	},
	{
		title: "Check out",
		description:
			"Pay securely in a few steps. Shipping options and costs for your address are shown at checkout, before you pay.",
	},
	{
		title: "enjoy :)",
		description:
			"You’ve chosen your coffee and how you want it ground—all that’s left to do is put the kettle on.",
	},
];

/** The original's "Subscribe & Save" band: the hero photograph again, three sand cards with ruled titles. */
export function StepsSection() {
	return (
		<PhotoHero
			className="min-h-[45.875rem] pt-9 pb-10"
			action={{ href: "/products", label: "Start shopping" }}
		>
			<div className="space-y-9">
				<p className="font-display text-xl uppercase md:text-display-sm">How it works</p>
				<h2 className="font-display text-display-md text-balance lg:text-display-xl">
					Three simple steps to&nbsp;your&nbsp;next&nbsp;cup
				</h2>
				<ol className="flex flex-col gap-6 text-left md:flex-row lg:gap-16 lg:px-16">
					{steps.map((step) => (
						<li
							key={step.title}
							className="flex flex-1 flex-col gap-5 rounded-3xl bg-sand p-10 text-sm text-ink"
						>
							<div className="flex items-center gap-2">
								<h3 className="font-bold">{step.title}</h3>
								<div aria-hidden="true" className="flex-1 border-t border-black" />
							</div>
							<p>{step.description}</p>
						</li>
					))}
				</ol>
			</div>
		</PhotoHero>
	);
}

/** "The Art of Roasting" heading with a lapping photo, then the photo-and-prose side by side. */
export async function ChoosingSection({ storeName }: { storeName: string }) {
	const images = await getStoryImages(2);
	const image = images[1] ?? images[0];

	return (
		<>
			<div className="page-container relative flex min-h-[17.25rem] flex-col-reverse items-center gap-8 p-6 md:items-start lg:min-h-[22.125rem] lg:px-24 lg:pt-24 xl:pt-16">
				<StoryPhoto
					image={image}
					className="block w-60 md:absolute md:-top-24 md:right-0 md:w-72 lg:right-20 lg:w-[22rem] xl:w-[26.25rem]"
				/>
				<h2 className="font-display text-display-md max-md:text-center sm:text-5xl md:mr-[18rem] lg:mr-[24.5rem] lg:text-display-lg xl:text-display-xl">
					<span className="whitespace-nowrap">The Art of Roasting</span>
					<br />
					<span className="mt-6 mb-4 inline-block font-script text-[175%] whitespace-nowrap sm:mt-2 sm:-mb-4">
						by Hand
					</span>
					<br />
					<span className="whitespace-nowrap">Crafted with Care</span>
				</h2>
			</div>
			<div className="page-container grid gap-10 p-14 md:grid-cols-2 md:gap-16 md:pt-12 lg:px-24">
				<div className="relative h-[25.625rem] overflow-hidden rounded-3xl">
					<Image
						src="/images/pexels/sneakers-bench.jpg"
						alt="Freshly roasted coffee beans turning in the cooling tray of a drum roaster"
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-cover"
					/>
				</div>
				<div className="flex flex-col justify-center gap-5 text-sm">
					<p>
						At {storeName}, roasting is the part we take most seriously. We would rather keep a short list of
						coffees we believe in than a long one we don&rsquo;t.
					</p>
					<p>
						We cup every lot before it goes on the list, then roast it in small batches, watching colour,
						aroma and time until the sweetness and acidity sit in balance. If a roast doesn&rsquo;t taste
						right on the cupping table, it doesn&rsquo;t make the cut.
					</p>
					<p>
						The result is a short list of coffees, each with a clear character, that you will reach for again
						and again.
					</p>
				</div>
			</div>
		</>
	);
}

function GridTile({ image }: { image?: string }) {
	return (
		<div className="relative min-h-[8.5rem] flex-1 overflow-hidden bg-tan">
			{image && (
				<Image src={image} alt="" fill sizes="(max-width: 768px) 100vw, 18.5rem" className="object-cover" />
			)}
		</div>
	);
}

/** The original's GridCTA: an olive panel between two columns of photo and tan tiles. */
export function CommunityGridSection({ storeName }: { storeName: string }) {
	return (
		<section className="page-container flex min-h-[38.125rem] w-full flex-col gap-5 p-14 md:flex-row md:pt-28 lg:px-24 lg:pt-24">
			<div className="flex min-h-[17.875rem] flex-1 flex-col gap-5 md:max-w-[18.5rem]">
				<GridTile />
				<GridTile image="/images/pexels/flat-lay.jpg" />
			</div>
			<div className="@container flex flex-1 flex-col items-center justify-center gap-8 bg-olive p-5 py-10 text-center text-white">
				<p className="font-display text-xl uppercase">Find your community</p>
				<h2 className="max-w-full font-wordmark text-[clamp(1.25rem,10cqi,4.5rem)] leading-none break-words uppercase">
					{storeName}
				</h2>
				<p className="text-xl">Brew, Share &amp; Stay in Touch</p>
				<PillLink href="#newsletter">Join our newsletter</PillLink>
			</div>
			<div className="flex min-h-[17.875rem] flex-1 flex-col gap-5 md:max-w-[18.5rem]">
				<GridTile image="/images/pexels/bag-bench.jpg" />
				<GridTile />
			</div>
		</section>
	);
}
