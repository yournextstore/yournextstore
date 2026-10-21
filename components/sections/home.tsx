import { ArrowUpRight, Gem, Leaf, Ruler, ShieldCheck, Sparkles } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { faqCategories } from "@/app/faq/faq-data";
import { FaqAccordion } from "@/components/faq-accordion";
import { NewsletterForm } from "@/components/newsletter-form";
import { ProductCard } from "@/components/product-card";
import { Rail } from "@/components/rail";
import { commerce } from "@/lib/commerce";
import { formatDate } from "@/lib/dates";
import { EDITORIAL, type EditorialPhoto } from "@/lib/editorial";
import { getStoreIdentity, picturedFirst } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

const outlinePill =
	"inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-6 text-sm text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.12)] transition-colors hover:bg-secondary";

/* ---------------------------------------------------------------- Hero */

/** An editorial photo filling its (relatively positioned) frame. */
function Photo({
	photo,
	sizes,
	priority = false,
}: {
	photo: EditorialPhoto;
	sizes: string;
	priority?: boolean;
}) {
	return (
		<Image src={photo.src} alt={photo.alt} fill priority={priority} sizes={sizes} className="object-cover" />
	);
}

export function Hero() {
	const image = EDITORIAL.hero;

	return (
		<section className="relative isolate overflow-hidden bg-[#3b3632]">
			{image && (
				<div aria-hidden="true" className="absolute inset-0 -z-10">
					<Image src={image.src} alt="" fill sizes="96px" className="scale-125 object-cover blur-2xl" />
					<div className="absolute inset-0 bg-black/55" />
				</div>
			)}
			<div className="shell grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-16">
				<div className="order-first text-center text-white lg:order-last lg:text-left">
					<h1 className="text-[2.5rem] leading-none font-medium sm:text-5xl lg:text-6xl">
						<span className="text-hollow block">Island coffee,</span>
						<span className="mt-1 block">roasted with care</span>
					</h1>
					<p className="mx-auto mt-4 max-w-md text-base/7 text-white/90 lg:mx-0 lg:text-sm/6">
						Single-origin beans from Sumatra, Java, Sulawesi, Bali and Flores, with the gear to brew them at
						home.
					</p>
					<Link
						href="/products"
						className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-7 text-sm text-primary-foreground transition-colors hover:bg-black"
					>
						Shop Now
					</Link>
				</div>
				{image && (
					<div className="relative aspect-[16/9] overflow-hidden rounded-lg shadow-[0_20px_40px_-20px_rgb(0_0_0/0.6)]">
						<Photo photo={image} priority sizes="(max-width: 1024px) 100vw, 608px" />
					</div>
				)}
			</div>
		</section>
	);
}

/* ------------------------------------------------- Feature (CTAFeature) */

export function Feature() {
	const left = EDITORIAL.featureLeft;
	const right = EDITORIAL.featureRight;

	return (
		<section className="shell mt-24 sm:mt-28 lg:mt-40">
			<div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-6 xl:gap-2.5">
				{left && (
					<div className="relative aspect-[495/530] overflow-hidden rounded-lg lg:w-1/3 lg:shrink-0">
						<Photo photo={left} sizes="(max-width: 1024px) 100vw, 400px" />
					</div>
				)}
				<div className="flex flex-col gap-8 sm:flex-row lg:flex-1 lg:gap-6 xl:gap-2.5">
					<div className="flex sm:flex-1 sm:justify-center sm:self-end xl:flex-[2]">
						<div className="max-w-sm">
							<p className="text-sm/6">
								Each coffee comes from one island and one region, roasted in small batches to show what makes
								it different.
							</p>
							<Link href="/products" className={cn(outlinePill, "mt-4")}>
								Explore All Products
							</Link>
						</div>
					</div>
					<div className="sm:flex-1">
						<h2 className="mb-10 max-w-[400px] text-[2.5rem] leading-none font-medium sm:text-5xl">
							From the Islands to Your Cup
						</h2>
						{right && (
							<div className="relative aspect-[325/335] overflow-hidden rounded-lg">
								<Photo photo={right} sizes="(max-width: 640px) 100vw, 330px" />
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------- Showcase (GridShowcase) */

export async function Showcase() {
	"use cache";
	cacheLife("minutes");

	const identity = await getStoreIdentity();
	const leftImage = EDITORIAL.showcaseLeft;
	const center = EDITORIAL.showcaseCenter;
	const rightTop = EDITORIAL.showcaseRight;

	return (
		<section className="shell mt-24 sm:mt-28 lg:mt-40">
			<div className="grid grid-cols-12 overflow-hidden rounded-lg">
				<div className="col-span-12 flex flex-col justify-between bg-orange text-orange-foreground sm:col-span-6 xl:col-span-4">
					<div className="max-w-md p-6 pb-0 lg:p-10 lg:pb-0">
						<h2 className="text-3xl leading-tight font-medium sm:text-4xl xl:text-5xl/none">
							Slow Mornings, Good Coffee
						</h2>
					</div>
					{leftImage && (
						<div className="relative mt-6 aspect-[643/494] lg:mt-10">
							<Photo photo={leftImage} sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 410px" />
						</div>
					)}
					<div className="max-w-md p-6 lg:p-10">
						<p className="text-sm/6 uppercase">For those who take time over the first cup</p>
					</div>
				</div>

				{center && (
					<div className="relative col-span-12 aspect-square sm:col-span-6 sm:aspect-auto xl:col-span-4">
						<Photo photo={center} sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 410px" />
					</div>
				)}

				<div className="col-span-12 grid grid-cols-2 bg-background xl:col-span-4 xl:block">
					{rightTop && (
						<div className="relative col-span-2 aspect-[640/599] sm:col-span-1">
							<Photo photo={rightTop} sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 410px" />
						</div>
					)}
					<div className="col-span-2 max-w-xl px-6 pt-10 pb-7 sm:col-span-1 lg:px-10">
						<h2 className="text-[2rem] leading-none font-medium sm:text-4xl xl:text-[2.5rem]">
							Five islands, one roastery
						</h2>
						<p className="mt-7 text-sm/6 uppercase">Discover everything at {identity.name}</p>
						<Link href="/products" className={cn(outlinePill, "mt-7 h-9 px-4")}>
							Shop Now
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------ Products rail */

export async function ProductsRail() {
	"use cache";
	cacheLife("minutes");

	const { data } = await commerce.productBrowse({ active: true, limit: 16 });
	const products = picturedFirst(data).slice(0, 8);
	if (products.length === 0) return null;

	return (
		<section className="shell mt-24 sm:mt-28 lg:mt-40">
			<Rail
				label="products"
				heading={
					<h2 className="text-[2rem] leading-none font-medium sm:text-4xl xl:text-[2.5rem]">
						Explore <em>Our Shop</em>
					</h2>
				}
				description="Single origins, drip bags, brewing gear and cups."
			>
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</Rail>
		</section>
	);
}

/* ----------------------------------------------------- FAQ block */

const homeQuestions = faqCategories.flatMap((category) => category.questions).slice(0, 6);

export function FaqBlock() {
	const image = EDITORIAL.faq;

	return (
		<section className="shell mt-24 sm:mt-28 lg:mt-40">
			<div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-24">
				{image && (
					<div className="relative aspect-[592/740] overflow-hidden rounded-lg">
						<Photo photo={image} sizes="(max-width: 1024px) 100vw, 592px" />
					</div>
				)}
				<div className="lg:max-w-md">
					<h2 className="text-[2rem] leading-none font-medium sm:text-4xl xl:text-[2.5rem]">
						Good to know before your first order.
					</h2>
					<FaqAccordion items={homeQuestions} className="mt-10" />
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------- Benefits */

const benefits = [
	{
		icon: Gem,
		title: "Single origins",
		body: "Every coffee comes from one Indonesian island and one growing region.",
	},
	{
		icon: Leaf,
		title: "Small batches",
		body: "Roasted in small batches to bring out each origin's character.",
	},
	{
		icon: Ruler,
		title: "Clear details",
		body: "Region, process, roast and tasting notes on every bag.",
	},
	{
		icon: Sparkles,
		title: "Brew your way",
		body: "Whole bean or ground for filter or espresso, plus drip bags for anywhere.",
	},
	{
		icon: ShieldCheck,
		title: "Secure checkout",
		body: "Pay safely with the methods you already use.",
	},
];

export function Benefits() {
	return (
		<section className="shell mt-24 sm:mt-28 lg:mt-40">
			<h2 className="sr-only">Why shop with us</h2>
			<ul className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
				{benefits.map((benefit, index) => (
					<li key={benefit.title} className="flex flex-col bg-background p-6 sm:p-8 lg:p-6 xl:p-8">
						<span className="text-sm/6 text-muted-foreground">({index + 1})</span>
						<h3 className="mt-2 text-sm/6">{benefit.title}</h3>
						<benefit.icon aria-hidden="true" className="mt-10 h-7 w-7" strokeWidth={1.25} />
						<p className="mt-6 text-sm/6 text-muted-foreground">{benefit.body}</p>
					</li>
				))}
			</ul>
		</section>
	);
}

/* ------------------------------------------------- Newsletter band */

export async function NewsletterBand() {
	"use cache";
	cacheLife("hours");

	const { data: legal } = await commerce.legalPageBrowse().catch(() => ({ data: [] }));
	const privacy = legal.find((page) => /privacy|prywat/i.test(`${page.href} ${page.label}`));

	return (
		<section className="shell mt-24 sm:mt-28 lg:mt-40">
			<div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-24">
				<h2 className="max-w-xl text-[2rem] leading-[1.05] font-medium sm:text-4xl xl:text-5xl/[1]">
					New harvests and <em>roasting notes</em>? Sign up for our newsletter.
				</h2>
				<div className="lg:max-w-md lg:justify-self-center lg:pt-2">
					<NewsletterForm
						label="Subscribe to our newsletter"
						note={
							<p className="text-sm/6">
								We care about your data.
								{privacy ? (
									<>
										{" "}
										Read our{" "}
										<Link href={`/legal${privacy.href}`} className="underline underline-offset-2">
											privacy policy
										</Link>
										.
									</>
								) : null}
							</p>
						}
					/>
				</div>
			</div>
		</section>
	);
}

/* --------------------------------------------------------- Journal */

export async function Insights() {
	"use cache";
	cacheLife("minutes");

	const identity = await getStoreIdentity();
	if (!identity.blogEnabled) return null;
	const { data: posts } = await commerce.postBrowse({ active: true, limit: 8 }).catch(() => ({ data: [] }));
	if (posts.length === 0) return null;

	return (
		<section className="shell mt-24 sm:mt-28 lg:mt-40">
			<Rail
				label="articles"
				heading={
					<h2 className="text-[2rem] leading-none font-medium sm:text-4xl xl:text-[2.5rem]">
						From the <em>Journal</em>
					</h2>
				}
				action={
					<Link href="/blog" className={cn(outlinePill, "w-fit border-foreground uppercase shadow-none")}>
						View all
					</Link>
				}
				description="Brewing guides, origin stories and news from the roastery."
			>
				{posts.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
			</Rail>
		</section>
	);
}

export function PostCard({
	post,
}: {
	post: {
		slug: string;
		title: string;
		image: string | null;
		tag: string | null;
		publishedAt: string | null;
		createdAt: string;
	};
}) {
	const date = post.publishedAt ?? post.createdAt;
	return (
		<article className="group relative">
			<div className="relative aspect-square overflow-hidden rounded-lg bg-tile">
				{post.image && (
					<YNSMedia
						src={post.image}
						alt=""
						fill
						sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				)}
				{post.tag && (
					<span className="absolute top-3 left-3 rounded-full bg-background px-3 py-1 text-xs uppercase">
						{post.tag}
					</span>
				)}
				<span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-background">
					<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
				</span>
			</div>
			<h3 className="mt-4 text-base/6 text-foreground">
				<Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
					{post.title}
				</Link>
			</h3>
			<time dateTime={date} className="mt-2 block text-sm/6 text-muted-foreground">
				{formatDate(date)}
			</time>
		</article>
	);
}
