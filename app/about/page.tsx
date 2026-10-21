import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { SpecBand } from "@/components/sections/home";
import { EDITORIAL, getCategories } from "@/lib/catalog";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { YNSMedia } from "@/lib/yns-media";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `Learn about ${storeName} — our story, our values, and the people behind the products.`;

	return {
		title: "About",
		description,
		alternates: { canonical: "/about" },
		openGraph: {
			type: "website",
			title: "About",
			description,
			url: "/about",
		},
	};
}

async function getStoreInfo() {
	try {
		const me = await meGetCached();
		return {
			storeName: me.store.settings?.storeName || me.store.name || "our store",
			storeDescription: me.store.settings?.storeDescription || null,
			contactFormEnabled: me.store.settings?.enabledTools?.contactForm ?? false,
		};
	} catch {
		return { storeName: "our store", storeDescription: null, contactFormEnabled: false };
	}
}

const principles = [
	{
		heading: "Solid timber, always",
		copy: "No veneer and no board: every piece is made from the solid wood it appears to be.",
	},
	{
		heading: "Joints, not hardware",
		copy: "Mortise and tenon, dovetail and wedge. Where the wood allows, we join it without screws or metal.",
	},
	{
		heading: "Made to be kept",
		copy: "Oiled and waxed finishes that can be renewed at home, so a piece can stay in use for decades.",
	},
];

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const [{ storeName, storeDescription, contactFormEnabled }, categories] = await Promise.all([
		getStoreInfo(),
		getCategories(),
	]);
	const wide = EDITORIAL.wide;
	const portrait = EDITORIAL.portrait;
	const groups = categories.filter((c) => c.count > 0).map((c) => c.name.toLowerCase());
	const groupList =
		groups.length > 1 ? `${groups.slice(0, -1).join(", ")} and ${groups.at(-1)}` : (groups[0] ?? "every day");

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: storeDescription ?? "A small workshop making solid wood furniture by hand.",
	};

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<section className="shell pb-12 pt-12 md:pb-16 md:pt-20">
				<h1 className="type-h1 hero-in max-w-[11ch]">A small workshop, run slowly</h1>
				<p className="type-lead hero-in mt-8 max-w-[58ch]" style={delay(120)}>
					{storeDescription ??
						`${storeName} is a small workshop making chairs, tables and storage by hand from solid oak, ash and walnut. A short catalogue, no rush.`}
				</p>
			</section>

			{wide && (
				<figure
					className="hero-in relative h-[50vh] overflow-hidden bg-surface md:h-[72vh]"
					style={delay(260)}
				>
					<YNSMedia
						src={wide.src}
						alt={wide.caption}
						fill
						priority
						sizes="100vw"
						className="parallax object-cover"
					/>
				</figure>
			)}

			<section className="shell mt-24 grid gap-8 md:mt-36 md:grid-cols-12">
				<div className="md:col-span-5" data-reveal>
					<h2 className="type-h2 max-w-[12ch]">We started at one bench</h2>
				</div>
				<div className="md:col-span-6 md:col-start-7" data-reveal style={delay(120)}>
					<p className="type-body">
						{storeName} began at a single workbench with one chair design. We still work the same way: a few
						pieces at a time, made for how they will be used rather than how they photograph.
					</p>
					<p className="type-body mt-5">
						The catalogue is intentionally small. We would rather know three timbers and a few joints well
						than offer a hundred designs we don't.
					</p>
				</div>
			</section>

			<section className="shell mt-24 md:mt-36">
				<div className="rule" data-reveal="line" />
				<h2 className="type-h2 mt-8 max-w-[16ch]" data-reveal>
					How we work
				</h2>
				<div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
					{principles.map((principle, index) => (
						<div
							key={principle.heading}
							className="border-t border-border pt-6"
							data-reveal
							style={delay(index * 110)}
						>
							<h3 className="type-h3">{principle.heading}</h3>
							<p className="type-body mt-4 text-[0.9375rem]">{principle.copy}</p>
						</div>
					))}
				</div>
			</section>

			<section className="shell mt-24 grid items-center gap-10 md:mt-36 md:grid-cols-12 md:gap-12">
				{portrait && (
					<div className="md:col-span-5">
						<div className="overflow-hidden bg-surface" data-reveal="mask">
							<div className="relative aspect-[3/4]">
								<YNSMedia
									src={portrait.src}
									alt={portrait.caption}
									fill
									sizes="(max-width: 768px) 100vw, 40vw"
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				)}
				<div className="md:col-span-6 md:col-start-7" data-reveal style={delay(140)}>
					<blockquote>
						<p className="type-h3 max-w-[26ch] text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.15]">
							“We would rather leave a gap in the catalogue than make a piece we would not live with
							ourselves.”
						</p>
						<footer className="label mt-6">How we choose</footer>
					</blockquote>
					<p className="type-body mt-8 max-w-[48ch] border-t border-border pt-6 text-[0.9375rem]">
						Pieces for {groupList}. {groups.length > 1 ? `${groups.length} categories.` : "One category."} No
						more.
					</p>
				</div>
			</section>

			<section className="mt-24 md:mt-36" aria-label="The shop at a glance">
				<SpecBand className="" />
			</section>

			<section className="shell mt-24 md:mt-36">
				<div className="grid items-end gap-8 md:grid-cols-12" data-reveal>
					<div className="md:col-span-7">
						<h2 className="type-h2 max-w-[16ch]">Visit the catalogue, or begin with a question</h2>
					</div>
					<div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
						<Link href="/products" className="btn btn-primary">
							See the catalogue
						</Link>
						<Link href={contactFormEnabled ? "/contact" : "/faq"} className="btn btn-outline">
							{contactFormEnabled ? "Write to us" : "Read the questions"}
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
