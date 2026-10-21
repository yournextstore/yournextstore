import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { PillLink } from "@/components/pill-link";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";

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

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, storeDescription, contactFormEnabled } = await getStoreInfo();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: storeDescription ?? "Learn about our story, our coffee and the people who roast it.",
	};

	const places = [
		{
			title: "The Roastery",
			image: "/images/pexels/boutique-room.jpg",
			alt: "Shelves of coffee bags and a drum roaster in a bright roastery with a wooden floor",
			lines: [
				"Where every batch is roasted.",
				"Browse every coffee by origin, blend and roast, with tasting notes on each page.",
			],
		},
		{
			title: "The Cupping Table",
			image: "/images/pexels/sneakers-suitcase.jpg",
			alt: "Cupping bowls of ground coffee and spoons on a wooden table in warm light",
			lines: ["Tasted before it is listed.", "Every lot is cupped before it earns a place on the list."],
		},
	];

	return (
		<div className="pb-16">
			<JsonLdScript data={aboutJsonLd} />

			<div className="mx-auto max-w-[96rem] sm:p-16">
				<section className="bg-olive p-6 py-16 text-center text-white sm:rounded-3xl sm:p-10 md:p-[5.5rem]">
					<p className="font-display text-xl uppercase">About us</p>
					<h1 className="mt-6 font-display text-display-lg md:text-display-xl">Our Story</h1>
					<p className="mx-auto mt-6 max-w-4xl text-lg md:text-xl">
						At {storeName}, we&rsquo;re more than a coffee roaster&mdash;we&rsquo;re a neighbourhood. Inspired
						by the corner café, a place where you are always welcome to stay for another cup, we bring that
						feeling to every bag we roast. <strong>Building community, one cup at a time.</strong>
					</p>
					<div className="mt-8 flex flex-wrap justify-center gap-4 lg:mt-10 lg:gap-6">
						<PillLink href="/products">Shop Our Coffees</PillLink>
						{contactFormEnabled ? (
							<PillLink href="/contact">Get in Touch</PillLink>
						) : (
							<PillLink href="#newsletter">Join the Community</PillLink>
						)}
					</div>
				</section>
			</div>

			<div className="page-container">
				<h2 className="mt-14 mb-14 font-display text-display-md max-sm:text-center sm:text-display-lg md:mt-6 md:mb-16 lg:text-display-xl">
					Find your style, find your{" "}
					<span className="inline-block font-script text-[150%] leading-none whitespace-nowrap">corner</span>
				</h2>

				<div className="flex flex-col gap-12 md:gap-8">
					{places.map((place) => (
						<section key={place.title} className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-16">
							<div className="relative h-72 overflow-hidden rounded-3xl md:col-span-2">
								<Image
									src={place.image}
									alt={place.alt}
									fill
									sizes="(max-width: 768px) 100vw, 66vw"
									className="object-cover"
								/>
							</div>
							<div className="flex flex-col gap-4 text-lg md:justify-center md:text-xl">
								<h3 className="text-2xl font-bold">{place.title}</h3>
								<div>
									{place.lines.map((line) => (
										<p key={line}>{line}</p>
									))}
								</div>
							</div>
						</section>
					))}
				</div>
			</div>
		</div>
	);
}
