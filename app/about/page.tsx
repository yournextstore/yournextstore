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

	const values = [
		["Made to last", "Steel, iron and wood that get better with use, not worse."],
		["Chosen by cooks", "Every tool here has done its time on a busy stove before it is listed."],
		["Sold plainly", "Honest descriptions, fair prices, and real people when you write."],
	] as const;

	return (
		<div className="pb-12 md:pb-20">
			<JsonLdScript data={aboutJsonLd} />

			<div className="pt-6 pb-8 md:pt-12 lg:pt-16">
				<h1 className="font-serif text-3xl italic md:text-5xl">About:</h1>
				<p className="max-w-4xl pt-3 text-lg md:text-xl md:leading-snug lg:text-2xl">
					{storeName} is a small shop of kitchen tools: knives, boards, pans and spoons, picked by people who
					cook every day.
					{storeDescription ? ` ${storeDescription}` : ""}
				</p>
			</div>

			<div className="relative mb-8 aspect-[4/3] w-full overflow-hidden rounded-lg bg-secondary transition-all duration-300 hover:rounded-none md:mb-12 md:aspect-[21/9]">
				<Image
					src="/images/pexels/about-still-life.jpg"
					alt="A walnut board with a chef's knife, a cast iron skillet, a crock of wooden spoons and lemons on a marble counter"
					fill
					sizes="(max-width: 1536px) 100vw, 1440px"
					className="object-cover"
				/>
			</div>

			<div className="grid gap-10 border-t border-ink pt-6 md:grid-cols-2 md:gap-x-10 md:pt-8">
				<section>
					<h2 className="font-serif text-2xl italic md:text-3xl">Our story</h2>
					<div className="space-y-4 pt-4 md:leading-relaxed lg:text-lg lg:leading-loose">
						<p>
							We started with a simple idea: one good knife beats a block of bad ones. Every tool here earns
							its place by being sharp, solid and pleasant to use night after night.
						</p>
						<p>
							We work with smiths, woodworkers and foundries who care about steel, grain and weight as much as
							we do, and we would rather carry a short list we cook with than a long one we do not.
						</p>
					</div>
				</section>

				<section>
					<h2 className="font-serif text-2xl italic md:text-3xl">What we stand for</h2>
					<dl className="pt-4">
						{values.map(([title, body]) => (
							<div key={title} className="border-b border-ink py-3 md:py-4">
								<dt className="text-lg md:text-xl">{title}</dt>
								<dd className="pt-1 text-muted-foreground">{body}</dd>
							</div>
						))}
					</dl>
				</section>
			</div>

			<p className="flex flex-wrap items-center gap-3 pt-10 text-lg md:pt-16 md:text-xl">
				<span className="font-serif italic">Have a look around:</span>
				<Link
					href="/products"
					className="rounded bg-white-rock px-1.5 py-0.5 transition hover:rounded-none md:px-2"
				>
					Shop
				</Link>
				{contactFormEnabled && (
					<Link
						href="/contact"
						className="rounded bg-white-rock px-1.5 py-0.5 transition hover:rounded-none md:px-2"
					>
						Contact
					</Link>
				)}
			</p>
		</div>
	);
}
