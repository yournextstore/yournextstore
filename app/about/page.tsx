import { CircleHelpIcon, PackageIcon, RotateCcwIcon, SparklesIcon } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { getCategoryCounts, getStoreIdentity } from "@/lib/swag";
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
	const [identity, counts] = await Promise.all([getStoreIdentity(), getCategoryCounts()]);
	return {
		storeName: identity.name,
		storeDescription: identity.description,
		contactFormEnabled: identity.contactEnabled,
		// Whole rows of three (largest categories first), so the grid never ends on a lone tile.
		categories:
			counts.categories.length >= 3
				? counts.categories.slice(0, counts.categories.length >= 6 ? 6 : 3)
				: counts.categories,
		total: counts.total,
	};
}

const NOTES = [
	{
		icon: PackageIcon,
		title: "Shipping",
		body: "Shipping options and costs for your address are shown at checkout, before you pay, so there are no surprises at the end.",
	},
	{
		icon: RotateCcwIcon,
		title: "Returns",
		body: "Changed your mind? Our return policy, linked at the foot of every page, sets out how returns work for your order.",
	},
	{
		icon: SparklesIcon,
		title: "Care",
		body: "Fabric weight, print method and wash care are on every product page. Wash prints cold and inside out and they keep their colour.",
	},
] as const;

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, storeDescription, contactFormEnabled, categories, total } = await getStoreInfo();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	return (
		<div className="bg-swag-paper">
			<JsonLdScript data={aboutJsonLd} />

			{/* Information hero: green halftone field, label panel, headline and a mono statement. */}
			<section className="halftone grid min-h-[70svh] grid-cols-1 bg-swag-green p-3 [--dot:rgb(0_0_0/0.3)] sm:grid-cols-3">
				<div className="flex items-center justify-center bg-swag-green py-10 text-t14 uppercase sm:my-10 sm:h-[38%]">
					Information
				</div>
				<div className="flex flex-col justify-between gap-10 sm:col-span-2 sm:pl-3">
					<h1 className="bg-swag-green font-sans text-t30 sm:text-t56">
						How {storeName} does small things, properly
					</h1>
					<p className="self-end bg-swag-green p-2 text-t14 leading-[1.5] uppercase sm:w-1/2">
						{storeDescription ??
							"Studio merch in loud, flat colour: heavyweight tees, caps, totes, pins and prints, made in small runs and sold here directly."}
					</p>
				</div>
			</section>

			{/* Store notes: plain grey band with one large paragraph. */}
			<section className="bg-swag-gray px-3 py-4">
				<h2 className="text-t14 uppercase">Store notes</h2>
				<p className="mt-20 font-sans text-t24 leading-[1.2] sm:mt-28 sm:text-t30">
					{storeName} is a small shop with {total > 0 ? `${total} pieces` : "a short list of pieces"} and no
					filler. Browse the{" "}
					<Link href="/products" className="underline underline-offset-4 hover:text-swag-blue">
						catalogue
					</Link>
					, read the{" "}
					<Link href="/faq" className="underline underline-offset-4 hover:text-swag-blue">
						answers to common questions
					</Link>
					, or{" "}
					{contactFormEnabled ? (
						<Link href="/contact" className="underline underline-offset-4 hover:text-swag-blue">
							write to us
						</Link>
					) : (
						"write to us"
					)}{" "}
					— a person reads every message.
				</p>
			</section>

			{/* Hatched panel of information cards. */}
			<section className="hatched grid grid-cols-1 gap-3 bg-swag-paper p-3 sm:grid-cols-3">
				<div className="hidden sm:block" />
				<ul className="flex flex-col gap-3">
					{[...NOTES, { icon: CircleHelpIcon, title: "Questions", body: "" }].map((note) => (
						<li key={note.title} className="bg-swag-gray p-3 text-t14 leading-[1.5] uppercase">
							<note.icon className="h-5 w-5" aria-hidden />
							<h3 className="sr-only">{note.title}</h3>
							<p className="mt-8">
								{note.body || (
									<>
										Still wondering about something? Our{" "}
										<Link href="/faq" className="underline hover:text-swag-blue">
											FAQ
										</Link>{" "}
										covers sizing, payment and delivery
										{contactFormEnabled ? (
											<>
												, and the{" "}
												<Link href="/contact" className="underline hover:text-swag-blue">
													contact form
												</Link>{" "}
												reaches us directly
											</>
										) : null}
										.
									</>
								)}
							</p>
						</li>
					))}
				</ul>
				<div className="hidden bg-swag-paper/60 sm:block" />
			</section>

			{/* Black band: the original's logo wall, here the store's own departments. */}
			{categories.length > 0 && (
				<section className="bg-swag-graphite pb-3">
					<h2 className="bg-black py-8 text-center text-t14 text-white uppercase">Shop by department</h2>
					<ul
						className={cn(
							"grid grid-cols-1 gap-3 px-3 pt-3",
							categories.length === 2 ? "sm:grid-cols-2" : categories.length > 2 && "sm:grid-cols-3",
						)}
					>
						{categories.map((category) => (
							<li key={category.slug}>
								<Link
									href={`/category/${category.slug}`}
									className="flex aspect-[3/2] items-center justify-center bg-black px-4 text-center font-sans text-t30 text-white hover:text-swag-yellow"
								>
									{category.name}
								</Link>
							</li>
						))}
					</ul>
				</section>
			)}

			{/* Orange call-out with the outlined pill button. */}
			<section className="grid min-h-[40svh] grid-cols-1 bg-swag-orange sm:grid-cols-3">
				<div className="flex flex-col justify-between gap-16 p-3">
					<div className="text-t14 uppercase">
						<h2>Visit the catalogue</h2>
						<p className="mt-3">
							Everything in the shop, in one place: sort it, filter it, find your next favourite.
						</p>
					</div>
					<Link
						href="/products"
						className="self-start rounded-full border border-black px-3 py-1 text-t14 uppercase hover:bg-black hover:text-swag-orange"
					>
						Browse the catalogue
					</Link>
				</div>
				<div className="hidden bg-[#e04b00] sm:block" />
				<div className="hidden bg-[#e04b00] sm:block" />
			</section>
		</div>
	);
}
