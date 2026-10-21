import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
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
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<div data-hero>
				<Image
					src="/images/interiors/about-workshop.jpg"
					width={1920}
					height={1280}
					alt="An oak chair frame on a workbench among oak boards, hand planes and wood shavings"
					priority
					sizes="100vw"
					className="h-auto w-full md:h-screen md:object-cover"
				/>
			</div>
			<div className="pt-8 pb-26 md:pt-26 md:pb-36">
				<div className="layout">
					<h1 className="col-span-full text-title-md max-lg:mb-6 md:text-title-2xl lg:col-span-6">
						At {storeName}, we believe a home should feel calm, warm and easy to live in.
					</h1>
					<div className="col-span-full md:text-title-md lg:col-start-8 lg:col-end-13 lg:mt-18">
						<p className="mb-5 lg:mb-9">
							{storeDescription ??
								`Welcome to ${storeName}. We make sofas, chairs, tables and lamps that are comfortable to live with and quiet to look at.`}
						</p>
						<p>
							Every piece starts with its materials: solid oak, wool, linen, leather and stone, shaped into
							simple forms that strike the right balance between comfort and proportion.
						</p>
					</div>
					<div className="col-span-full">
						<Image
							src="/images/interiors/about-materials.jpg"
							width={1920}
							height={1280}
							alt="Swatches of grey wool, oat linen, moss velvet and bouclé beside a piece of travertine on an oak table"
							sizes="(max-width: 1400px) 100vw, 1368px"
							className="mt-26 mb-8 h-auto w-full lg:mt-36 lg:mb-26"
						/>
					</div>
					<h2 className="col-span-full mb-6 text-title-md md:text-title-2xl lg:col-span-7 lg:mb-10">
						We are here to help you find pieces that make a room feel like yours.
					</h2>
					<div className="col-span-full mb-16 lg:col-start-1 lg:col-end-6 lg:mb-26">
						<p className="mb-5 md:mb-9">
							At the heart of {storeName} is a simple idea: own fewer pieces, and choose them well. Everything
							we make is meant to be sat on, eaten at and read beside every day.
						</p>
						<p>
							From the depth of a sofa seat to the height of a lamp, each piece is drawn for how it looks and
							how it is used. Fabrics are chosen for their hand, wood for its grain, stone for its quiet
							pattern.
						</p>
					</div>
					<div className="col-start-2 col-end-12 lg:col-start-1 lg:col-end-7">
						<Image
							src="/images/interiors/about-reading-corner.jpg"
							width={1280}
							height={1920}
							alt="An oak lounge chair with grey wool cushions beside a tall paper floor lamp and a stack of books"
							sizes="(max-width: 1024px) 85vw, 45vw"
							className="mb-16 h-auto w-full lg:mb-46"
						/>
					</div>
					<div className="col-span-full lg:col-start-8 lg:col-end-13">
						<p className="mb-6 lg:mb-20 xl:mb-36">
							Our design philosophy is about pieces that are both beautiful and practical. Inspired by
							Scandinavian simplicity and mid-century classics, the range mixes pale oak with warmer walnut,
							leather and terracotta, so it suits more than one kind of room.
						</p>
						<p className="max-lg:mb-26 md:text-title-md">
							We believe great furniture is the kind you stop noticing, because it simply belongs.
						</p>
					</div>
				</div>
				<Image
					src="/images/interiors/about-loveseat.jpg"
					width={1920}
					height={1280}
					alt="An ivory bouclé loveseat under a curtained window beside a ceramic table lamp"
					sizes="100vw"
					className="mb-8 h-auto w-full lg:mb-26"
				/>
				<div className="layout">
					<h2 className="col-span-full text-title-md max-lg:mb-6 md:text-title-2xl lg:col-span-6">
						Our customers are at the center of everything we do!
					</h2>
					<div className="col-span-full md:text-title-md lg:col-start-8 lg:col-end-13 lg:mt-18">
						<p className="mb-5 lg:mb-9">
							Your happiness is our top priority, and we are here to help you find the right piece. Whether
							you have a question about materials, sizes or how a piece fits your room, we are happy to help.
						</p>
						<div className="flex flex-wrap gap-x-8 gap-y-4">
							<Link href="/products" className="link-underline">
								Explore our products
							</Link>
							{contactFormEnabled && (
								<Link href="/contact" className="link-underline">
									Get in touch
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
