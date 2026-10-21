import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { BigText, FloatPhoto } from "@/components/sections/home";
import { getShowcaseProducts, pick } from "@/lib/catalog";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { cn } from "@/lib/utils";
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

async function getStoreInfo() {
	try {
		const me = await meGetCached();
		return {
			storeName: me.store.name || "our store",
			storeDescription: me.store.settings?.storeDescription || null,
			contactFormEnabled: me.store.settings?.enabledTools?.contactForm ?? false,
		};
	} catch {
		return { storeName: "our store", storeDescription: null, contactFormEnabled: false };
	}
}

// The original's three alternating claims, retold for any small shop. Photos: Pexels (see NOTICE.md).
const VALUES = [
	{
		title: "A short list of flavours",
		copy: "We keep the range small on purpose: a handful of flavours, each one we would happily drink every day.",
		ground: "bg-blush",
		image: {
			src: "/images/pexels/pastel-bags.jpg",
			alt: "A row of colourful soda cans on pink and mint backdrops",
		},
	},
	{
		title: "Real fruit, less sugar",
		copy: "Fruit juice, a little cane sugar and plant fibre: the sodas you grew up with, made for an ordinary Tuesday.",
		ground: "bg-lilac",
		image: {
			src: "/images/pexels/summer-hat.jpg",
			alt: "A glass of pink soda and a lime-green can with citrus on a yellow and teal backdrop",
		},
	},
	{
		title: "Naturally fizzy",
		copy: "A cold can should make the day a little better. That is the whole idea, and it is why we keep the prices plain.",
		ground: "bg-lime",
		image: {
			src: "/images/pexels/pink-sunglasses.jpg",
			alt: "A hand holding an orange soda can against pink",
		},
	},
] as const;

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const [{ storeName, storeDescription, contactFormEnabled }, showcase] = await Promise.all([
		getStoreInfo(),
		getShowcaseProducts(),
	]);
	const images = showcase.map((p) => p.image);
	const hero = pick(images, 1);

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	return (
		<div>
			<JsonLdScript data={aboutJsonLd} />
			<section className="-mt-20 overflow-hidden md:-mt-24">
				<div className="shell grid items-center gap-10 pb-[clamp(56px,9vh,110px)] pt-28 md:grid-cols-[1.1fr_0.9fr] md:pt-36">
					<div className="min-w-0">
						<h1 className="display text-[clamp(4rem,11vw,9rem)] text-flame">
							<span className="block">Our</span>
							<span className="block">story</span>
						</h1>
						<p className="mt-8 text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-none text-ink">
							Hello from {storeName}
						</p>
						<p className="mt-4 max-w-[48ch] text-lede text-ink">
							{storeDescription ??
								`${storeName} is a small shop with a short list of good things, each one chosen to brighten an ordinary day.`}
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<Link href="/products" className="btn">
								Shop now
							</Link>
							<Link href={contactFormEnabled ? "/contact" : "/faq"} className="btn btn-ghost">
								{contactFormEnabled ? "Say hello" : "Read the FAQ"}
							</Link>
						</div>
					</div>
					{hero && (
						<FloatPhoto
							src={hero}
							tilt={-12}
							priority
							sizes="(max-width: 768px) 80vw, 40vw"
							className="mx-auto w-full max-w-[460px]"
						/>
					)}
				</div>
			</section>

			{VALUES.map((value, i) => {
				const { image } = value;
				return (
					<section key={value.title} className={value.ground}>
						<div className="shell grid min-h-[min(80svh,40rem)] items-center gap-6 py-16 md:grid-cols-2 md:gap-12">
							<div className={cn("min-w-0 md:p-4", i % 2 === 1 && "md:col-start-2 md:row-start-1")}>
								<h2 className="text-[clamp(2.6rem,5vw,3.75rem)] font-bold leading-[1.02] text-ink">
									{value.title}
								</h2>
								<p className="mt-4 max-w-lg text-[1.25rem] text-ink">{value.copy}</p>
							</div>
							{/* A photo card tilted and bobbing like the floating products, on the same panel colour. */}
							<div
								className={cn(
									"relative mx-auto aspect-square w-[88%] max-w-[26rem]",
									i % 2 === 1 && "md:col-start-1 md:row-start-1",
								)}
								style={{
									["--tilt" as never]: `${i % 2 === 0 ? 6 : -6}deg`,
									["--bob-delay" as never]: `${i * 0.7}s`,
								}}
							>
								<div className="bob absolute inset-0 overflow-hidden rounded-[2rem] shadow-[0_40px_60px_-30px_rgb(0_0_0/0.45)]">
									<YNSMedia
										src={image.src}
										alt={image.alt}
										fill
										sizes="(max-width: 768px) 80vw, 26rem"
										className="object-cover"
									/>
								</div>
							</div>
						</div>
					</section>
				);
			})}

			<BigText />
		</div>
	);
}
