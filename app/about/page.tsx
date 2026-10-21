import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { commerce, getStoreSeo, meGetCached } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { cn } from "@/lib/utils";

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
	const [me, collections] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;
	const firstCollection =
		collections.data.find(
			(collection) =>
				collection.active &&
				(collection.productCollections.length > 0 || (collection.metafieldRules?.length ?? 0) > 0),
		) ?? null;
	return {
		storeName: me?.store.name || "our store",
		storeDescription: me?.store.settings?.storeDescription || null,
		contactFormEnabled: tools?.contactForm ?? false,
		collection: firstCollection ? { name: firstCollection.name, slug: firstCollection.slug } : null,
	};
}

/** The original's illustration frame: a soft-shadowed window with three dots in its title bar. */
function Framed({ image, bar }: { image: string; bar: string }) {
	return (
		<div className="mx-auto w-full max-w-[33rem] overflow-hidden rounded-[6px] bg-white shadow-[0_4px_16px_rgb(0_0_0/0.12)]">
			<div className={cn("flex h-7 items-center gap-1 px-3", bar)} aria-hidden="true">
				<span className="size-1.5 rounded-full bg-current" />
				<span className="size-1.5 rounded-full bg-current" />
				<span className="size-1.5 rounded-full bg-current" />
			</div>
			<div className="relative aspect-[3/2]">
				<Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 33rem" className="object-cover" />
			</div>
		</div>
	);
}

function Row({
	image,
	bar,
	imageFirst = false,
	children,
}: {
	image: string;
	bar: string;
	imageFirst?: boolean;
	children: React.ReactNode;
}) {
	return (
		<div className="grid items-center gap-y-6 pb-8 sm:pb-32 lg:grid-cols-2">
			<div className={cn("flex flex-col justify-center py-12 sm:px-12", imageFirst && "lg:order-2")}>
				{children}
			</div>
			<div className={cn("hidden px-4 sm:block", imageFirst && "lg:order-1")}>
				<Framed image={image} bar={bar} />
			</div>
		</div>
	);
}

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, storeDescription, contactFormEnabled, collection } = await getStoreInfo();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	return (
		<div className="mx-auto max-w-[1600px] px-6 pt-4 sm:px-12">
			<JsonLdScript data={aboutJsonLd} />

			<div className="mt-12 grid items-center gap-y-6 pb-8 sm:pt-12 sm:pb-32 lg:grid-cols-2">
				<div className="flex flex-col justify-center py-12 sm:px-12">
					<h1 className="mb-6 text-[2rem] leading-tight font-medium">About {storeName}</h1>
					<p className="mb-6 text-subheader font-medium">
						{storeDescription ??
							`${storeName} began with a simple idea: looking after your skin should feel simple and calm. We keep the range short, formulate each product with care and list what is in it plainly. Take a look around, and if anything raises a question, we are happy to help.`}
					</p>
					<div className="mt-3 flex flex-wrap gap-4">
						<Link href="/products" className="bg-brand px-6 py-3 text-white">
							Shop products
						</Link>
						<Link href="/faq" className="border border-brand bg-white px-6 py-3 text-brand">
							Questions and answers
						</Link>
					</div>
				</div>
				<div className="hidden px-4 sm:block">
					<Framed image="/images/pexels/about-bag-sandals.jpg" bar="bg-[#d9e6f2] text-[#5f7d99]" />
				</div>
			</div>

			<Row image="/images/pexels/about-leather-tote.jpg" bar="bg-[#213d36] text-white" imageFirst>
				<h2 className="mb-6 text-[2rem] leading-tight font-medium">Made for every day</h2>
				<p className="mb-6 text-subheader font-medium">
					Cleansers, serums and creams with short ingredient lists, made to be used morning and night.
				</p>
				<div className="mt-3">
					<Link href="/products" className="inline-block bg-[#1f7a67] px-6 py-3 text-white">
						Explore products
					</Link>
				</div>
			</Row>

			<Row image="/images/pexels/about-sandals-purse.jpg" bar="bg-[#283341] text-white">
				<h2 className="mb-6 text-[2rem] leading-tight font-medium">
					{collection ? collection.name : "Our collections"}
				</h2>
				<p className="mb-6 text-subheader font-medium">
					Products grouped to work well together. Start with one, or build a whole routine.
				</p>
				<div className="mt-3">
					<Link
						href={collection ? `/collection/${collection.slug}` : "/products"}
						className="inline-block bg-[#283341] px-6 py-3 text-white"
					>
						See the collection
					</Link>
				</div>
			</Row>

			<Row image="/images/pexels/explore-totes.jpg" bar="bg-[#254e81] text-white" imageFirst>
				<h2 className="mb-6 text-[2rem] leading-tight font-medium">Here to help</h2>
				<p className="mb-6 text-subheader font-medium">
					Not sure where to begin, or wondering how an order works? Our answers to the most common questions
					are a click away.
				</p>
				<div className="mt-3">
					<Link
						href={contactFormEnabled ? "/contact" : "/faq"}
						className="inline-block bg-[#254e81] px-6 py-3 text-white"
					>
						{contactFormEnabled ? "Contact us" : "Read the FAQ"}
					</Link>
				</div>
			</Row>
		</div>
	);
}
