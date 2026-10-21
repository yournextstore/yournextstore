import { ArrowRight, Clock, Heart, Leaf, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { getStoreSeo } from "@/lib/commerce";
import { editorial } from "@/lib/editorial";
import { JsonLdScript } from "@/lib/json-ld";
import { getStoreIdentity } from "@/lib/theme";
import { YNSMedia } from "@/lib/yns-media";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `Learn about ${storeName} — our story, our values, and the people behind the products.`;

	return {
		title: "About Us",
		description,
		alternates: { canonical: "/about" },
		openGraph: {
			type: "website",
			title: "About Us",
			description,
			url: "/about",
		},
	};
}

const values = [
	{
		icon: Sparkles,
		title: "Quality Craftsmanship",
		body: "Every piece is chosen for its materials and its finish, and for the attention to detail you notice the first time you wear it.",
	},
	{
		icon: Clock,
		title: "Timeless Design",
		body: "We look for pieces that transcend fleeting trends: classic shapes with modern refinements, meant to be worn season after season.",
	},
	{
		icon: Leaf,
		title: "Considered Choices",
		body: "Fewer, better things. We keep our range small so each piece earns its place in the collection, and in your wardrobe.",
	},
	{
		icon: Heart,
		title: "Personal Service",
		body: "Behind every order is a real person. Questions about sizing, care or gifting are always welcome.",
	},
];

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const identity = await getStoreIdentity();
	const hero = editorial.aboutHero;
	const story = editorial.aboutStory;

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${identity.name}`,
		description: identity.description ?? "Our story, our values, and the care behind every piece we make.",
	};

	return (
		<div>
			<JsonLdScript data={aboutJsonLd} />

			<header className="relative flex h-[60svh] min-h-[420px] items-center justify-center overflow-hidden bg-ink">
				<YNSMedia src={hero.src} alt="" fill priority sizes="100vw" className="object-cover" />
				<div className="absolute inset-0 bg-black/40" />
				<div className="shell relative z-10 text-center text-on-ink">
					<h1 className="text-5xl leading-tight md:text-6xl lg:text-7xl">About {identity.name}</h1>
					<p className="mt-4 text-lg text-on-ink/90 md:text-xl">
						Where timeless design meets conscious craftsmanship
					</p>
				</div>
			</header>

			<section className="py-20 md:py-28">
				<div className="shell max-w-4xl text-center">
					<h2 className="text-4xl md:text-5xl">Our Mission</h2>
					<p className="mt-8 text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
						{identity.description ??
							"We believe fashion should be timeless, not temporary. Our mission is to offer pieces that transcend seasons and trends, designed with care and made to last. Every piece is a statement of quality, finished with meticulous attention to detail."}
					</p>
				</div>
			</section>

			<section className="bg-sand py-16 md:py-24">
				<div className="shell grid items-center gap-10 md:grid-cols-2 md:gap-16">
					<div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary md:mx-8">
						<YNSMedia
							src={story.src}
							alt={story.alt}
							fill
							sizes="(min-width: 768px) 45vw, 100vw"
							className="object-cover"
						/>
					</div>
					<div className="max-w-xl">
						<h2 className="text-4xl md:text-5xl">Our Story</h2>
						<p className="mt-6 text-base leading-7 text-muted-foreground md:text-lg/8">
							{identity.name} began with a simple belief: that the things we wear every day can be both
							beautiful and lasting. We started with a small collection of essential pieces, each designed to
							work seamlessly together and to stand the test of time.
						</p>
						<p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg/8">
							Today we continue that vision, choosing pieces that honour craftsmanship and contemporary design
							alike. From our studio to your wardrobe, every piece tells a story of quality and care.
						</p>
						<Link
							href="/products"
							className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#1c1917]"
						>
							Discover the collection <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
						</Link>
					</div>
				</div>
			</section>

			<section className="py-20 md:py-28">
				<div className="shell max-w-5xl">
					<h2 className="text-center text-4xl md:text-5xl">What Drives Us</h2>
					<ul className="mt-14 grid gap-12 md:grid-cols-2 md:gap-x-16">
						{values.map(({ icon: Icon, title, body }) => (
							<li key={title}>
								<span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
									<Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
								</span>
								<h3 className="mt-5 text-2xl md:text-3xl">{title}</h3>
								<p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg/8">{body}</p>
							</li>
						))}
					</ul>
					{identity.contactEnabled && (
						<p className="mt-16 text-center text-muted-foreground">
							Questions?{" "}
							<Link href="/contact" className="text-foreground underline underline-offset-4">
								Get in touch
							</Link>
						</p>
					)}
				</div>
			</section>
		</div>
	);
}
