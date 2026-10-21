import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { BrandName } from "@/components/wordmark";
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

const STEPS = [
	{
		title: "Browse the range",
		body: "Start from All Products or open a collection from the Shop menu. Every product page lists its options and current price.",
	},
	{
		title: "Add to cart",
		body: "Pick an option and quantity, then press Add to cart. The cart opens on the right so you can keep shopping or check out.",
	},
	{
		title: "Check out securely",
		body: "Checkout runs on an encrypted payment page. Delivery options and their costs are shown there before you pay.",
	},
	{
		title: "Follow your order",
		body: "You get an email confirmation for your order, and your account lists every order you place with us.",
	},
] as const;

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, storeDescription, contactFormEnabled } = await getStoreInfo();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: storeDescription ?? `Learn about ${storeName} and how to shop with us.`,
	};

	return (
		<div className="mx-auto max-w-[56rem] px-6 py-12 sm:py-16">
			<JsonLdScript data={aboutJsonLd} />
			<h1 className="text-[2.25rem] text-ink">
				About <BrandName name={storeName} />
			</h1>

			<div className="mt-12 space-y-14 text-[0.9375rem] leading-relaxed text-[#1f2933]">
				<section>
					<h2 className="mb-5 text-2xl text-ink uppercase">Who we are</h2>
					<p>
						{storeDescription ??
							`${storeName} is an independent online shop with a short, focused range. We would rather offer a few products we know well than a catalogue nobody can find their way around.`}
					</p>
				</section>
				<section>
					<h2 className="mb-5 text-2xl text-ink uppercase">How we choose</h2>
					<p>
						Every product earns its place in the range. We keep the line-up small, describe each item plainly
						on its own page and show the price up front, so choosing is quick and there are no surprises at
						checkout.
					</p>
				</section>
				<section>
					<h2 className="mb-5 text-2xl text-ink uppercase">Our promise</h2>
					<p>
						Clear information, secure payments and a confirmation for every order. If something is not right,{" "}
						{contactFormEnabled ? (
							<>
								<Link href="/contact" className="text-main underline underline-offset-4">
									get in touch
								</Link>{" "}
								and we will help.
							</>
						) : (
							"reply to your order email and we will help."
						)}
					</p>
				</section>

				<section aria-labelledby="how-to-shop">
					<h2 id="how-to-shop" className="mb-3 text-2xl text-ink uppercase">
						How to shop
					</h2>
					<p className="mb-5 text-sm">Four steps from browsing to your order confirmation.</p>
					<div className="rounded-2xl border border-border bg-card px-6 py-2 sm:px-8">
						{STEPS.map((step, index) => (
							<details
								key={step.title}
								className="group border-b border-border last:border-b-0"
								open={index === 0}
							>
								<summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg text-[#0f2f5c] uppercase group-open:text-[#3355cc] [&::-webkit-details-marker]:hidden">
									<span>
										{index + 1}. {step.title}
									</span>
									<Plus
										className="h-5 w-5 shrink-0 transition-transform group-open:rotate-45"
										strokeWidth={1.5}
										aria-hidden="true"
									/>
								</summary>
								<p className="pb-5 text-[0.9375rem]">{step.body}</p>
							</details>
						))}
					</div>
				</section>
			</div>

			<div className="mt-14">
				<Link
					href="/products"
					className="inline-flex h-14 items-center justify-center rounded-full bg-main px-10 text-base font-bold tracking-wider text-page uppercase transition hover:scale-105 hover:bg-main-hover"
				>
					Shop now
				</Link>
			</div>
		</div>
	);
}
