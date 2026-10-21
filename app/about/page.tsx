import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { ButtonLink, SectionHead, Stage, TextLink } from "@/components/deckle";
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

	const steps = [
		{
			title: "Choose a piece",
			text: "Every piece is shown on its own sheet, photographed as it is, with its price and what it comes in.",
		},
		{
			title: "Check out your way",
			text: "Pay through a secure checkout as a guest, or with an account that keeps your orders together.",
		},
		{
			title: "It comes to you",
			text: "Your order is packed and sent on its way, with a confirmation by email.",
		},
	];

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<section aria-labelledby="about-title" className="band">
				<div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
					<div className="grid justify-items-start gap-6">
						<h1 id="about-title" className="text-title-1 text-balance lg:text-title-display">
							About {storeName}
						</h1>
						<p className="max-w-[46ch] text-lg text-muted-foreground">
							{storeDescription ??
								`${storeName} is a small shop of things worth keeping: chosen one by one, shown the way they are made and priced plainly.`}
						</p>
						<div className="flex flex-wrap items-center gap-6">
							<ButtonLink href="/products" icon={<ArrowRight aria-hidden="true" className="size-4" />}>
								Browse the shop
							</ButtonLink>
							<TextLink href="/collections">See the collections</TextLink>
						</div>
					</div>
					<Stage
						src="/images/pexels/about-frames.jpg"
						alt="Empty picture frames and a vase of dried eucalyptus on a white table"
						priority
					/>
				</div>
			</section>

			<section aria-labelledby="how-title" className="band bg-band">
				<SectionHead id="how-title" title="How the shop works" />
				<ol className="grid gap-8 lg:grid-cols-3 lg:gap-12">
					{steps.map((step, index) => (
						<li key={step.title} className="grid content-start gap-3 border-t-2 border-strong pt-4">
							<span aria-hidden="true" className="text-numeral text-copper-ink">
								{String(index + 1).padStart(2, "0")}
							</span>
							<h3 className="text-title-3">{step.title}</h3>
							<p className="text-muted-foreground">{step.text}</p>
						</li>
					))}
				</ol>
			</section>

			<section aria-labelledby="more-title" className="band">
				<div className="grid justify-items-start gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
					<div>
						<h2 id="more-title" className="text-title-2 text-balance">
							Something we have not answered?
						</h2>
						<p className="mt-3 max-w-[56ch] text-muted-foreground">
							The questions people ask most are answered in one place, and we read every message.
						</p>
					</div>
					<div className="flex flex-wrap gap-6">
						<TextLink href="/faq" arrow>
							Read the FAQ
						</TextLink>
						{contactFormEnabled && (
							<TextLink href="/contact" arrow>
								Write to us
							</TextLink>
						)}
					</div>
				</div>
			</section>
		</>
	);
}
