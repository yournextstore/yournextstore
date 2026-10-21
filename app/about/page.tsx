import type { Metadata } from "next";
import { cacheLife } from "next/cache";
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
		{
			title: "Listening first",
			copy: "We tune every pair for how it sounds over a whole album, not only for how it looks on a shelf.",
		},
		{
			title: "Fewer, better",
			copy: "A short range of headphones and accessories we use ourselves.",
		},
		{
			title: "Honest answers",
			copy: "Ask about fit, sound or compatibility before you order, and get a straight answer.",
		},
	];

	return (
		<div>
			<JsonLdScript data={aboutJsonLd} />

			<section data-hero className="relative isolate overflow-hidden">
				<div aria-hidden="true" className="stage-backdrop pointer-events-none absolute inset-0" />
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 [background:var(--brand-radial)]"
				/>
				<div className="relative mx-auto max-w-[900px] px-6 pb-28 pt-36 text-center md:px-12 md:pb-36 md:pt-48">
					<p className="text-kicker font-medium uppercase tracking-[0.45em] text-warm">About {storeName}</p>
					<h1 className="animate-rise mt-10 font-display text-manifesto font-light tracking-[-0.02em] text-ink">
						We believe the best things are the ones you <span className="title-gilt">feel</span> before you
						notice them.
					</h1>
					{storeDescription && (
						<p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-ink-soft">
							{storeDescription}
						</p>
					)}
				</div>
			</section>

			<section className="border-t border-hairline py-24 md:py-36">
				<div className="container-stage grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] lg:gap-x-12">
					<div>
						<p className="kicker">Our story</p>
						<h2 className="mt-6 font-display text-4xl font-light tracking-[-0.02em] text-ink md:text-5xl">
							Restraint, made audible.
						</h2>
					</div>
					<div className="max-w-2xl space-y-6 text-[15px] leading-[1.85] text-ink-soft md:text-lg md:leading-[1.75]">
						<p>
							{storeName} started with a simple frustration: headphones that looked beautiful in a catalogue
							and tired after a month of real use. Too much is tuned for the first impression, not for the
							hundredth listen.
						</p>
						<p>
							So we keep a small range of headphones, earphones and the things around them that do one thing
							well: let you hear more of the music, for longer. Every pair is lived with before it joins the
							shop.
						</p>
						<ul className="space-y-3 border-l border-hairline-strong pl-6 text-sm text-muted-foreground">
							<li className="text-foreground">Clear, even sound over boosted bass</li>
							<li>Materials that wear in, not out</li>
							<li>Replaceable cushions and cables, so a pair keeps going</li>
						</ul>
					</div>
				</div>
			</section>

			<section className="border-t border-hairline bg-band py-24 md:py-32">
				<div className="container-wide">
					<p className="kicker">What we stand for</p>
					<div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
						{values.map((value) => (
							<div key={value.title} className="reveal">
								<h3 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground">
									{value.title}
								</h3>
								<p className="mt-4 text-sm leading-[1.8] text-muted-foreground md:text-[15px]">
									{value.copy}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="border-t border-hairline py-24 md:py-32">
				<div className="mx-auto max-w-2xl px-6 text-center">
					<h2 className="font-display text-4xl font-light tracking-[-0.02em] text-ink md:text-5xl">
						Find the pair for how you listen.
					</h2>
					<div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
						<Link href="/products" className="btn-premium btn-md">
							Shop the collection
						</Link>
						{contactFormEnabled && (
							<Link href="/contact" className="btn-ghost-line btn-md">
								Contact us
							</Link>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
