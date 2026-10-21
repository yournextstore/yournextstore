import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import {
	DropBand,
	Poster,
	SectionHead,
	StampBadge,
	StatsBand,
	StoryBand,
	Watermark,
} from "@/components/sections/home";
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

const VALUES = [
	{
		label: "Small runs",
		title: "Made in short batches.",
		copy: "Short runs mean less waste and fewer things sitting in a warehouse. When it's gone, it's gone.",
	},
	{
		label: "Honest pictures",
		title: "Shown as it is.",
		copy: "Every piece is photographed plainly, so what arrives is what you saw. No filters on the goods.",
	},
	{
		label: "Plain prices",
		title: "No surprises.",
		copy: "The price on the card is the price at the till, with the sums done before you get there.",
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
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	return (
		<div>
			<JsonLdScript data={aboutJsonLd} />
			<section className="relative overflow-hidden">
				<Watermark className="-left-[2vw] top-1.5">The story</Watermark>
				<div className="shell relative z-[1] grid items-center gap-12 pb-[clamp(56px,9vh,110px)] pt-[clamp(40px,8vh,90px)] md:grid-cols-[1.1fr_0.9fr]">
					<div className="min-w-0">
						<p className="kicker mb-4">[ The story ]</p>
						<h1 className="display text-[clamp(3.6rem,10vw,8rem)] leading-[0.88]">
							Small runs.
							<br />
							<em>No</em> hype.
						</h1>
						<p className="mt-6 max-w-[48ch] text-[clamp(1rem,1.3vw,1.14rem)] text-dim">
							{storeDescription ??
								`${storeName} is a small shop with a short list. We put things out when they're ready, in runs small enough to care about, and leave the noise to everyone else.`}
						</p>
						<div className="mt-8 flex flex-wrap gap-3.5">
							<Link href="/products" className="btn">
								See the goods
							</Link>
							<Link href={contactFormEnabled ? "/contact" : "/faq"} className="btn btn-ghost">
								{contactFormEnabled ? "Write to us" : "Read the questions"} <span aria-hidden="true">→</span>
							</Link>
						</div>
					</div>
					<Poster
						className="mx-auto w-full max-w-[400px]"
						tilt="rotate-[1.4deg]"
						caption={["Fig. 02 — on a quiet day", "as it is"]}
					>
						<div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-muted">
							{/* Bundled editorial photograph (Pexels, free licence; credit in NOTICE.md). */}
							<Image
								src="/images/pexels/surf-rack.jpg"
								alt="Surfboards resting on a wooden rack by the sea"
								fill
								sizes="(max-width: 768px) 90vw, 400px"
								className="faded object-cover"
								priority
							/>
						</div>
						<StampBadge
							name={storeName}
							className="absolute -left-4 -top-8 w-[100px] -rotate-6 md:-left-12 md:w-[140px]"
						/>
					</Poster>
				</div>
			</section>

			<section
				aria-labelledby="values-title"
				className="border-y border-line bg-foam py-[clamp(72px,11vh,130px)]"
			>
				<div className="shell">
					<SectionHead
						kicker="What we keep to"
						title={<span id="values-title">Three rules. Zero&nbsp;exceptions.</span>}
					/>
					<ol className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-tile border border-line bg-line md:grid-cols-3">
						{VALUES.map((value, index) => (
							<li
								key={value.title}
								className="flex min-h-[200px] flex-col gap-2 bg-foam p-[clamp(18px,2.4vw,28px)]"
							>
								<span className="label-mono text-[0.66rem] tracking-[0.2em] text-denim-deep">
									{String(index + 1).padStart(2, "0")} — {value.label}
								</span>
								<h3 className="display mt-1 text-[clamp(1.9rem,3vw,2.5rem)]">{value.title}</h3>
								<p className="mt-auto text-[0.92rem] text-faint">{value.copy}</p>
							</li>
						))}
					</ol>
				</div>
			</section>

			<StoryBand cta={false} />
			<DropBand />
			<StatsBand />
		</div>
	);
}
