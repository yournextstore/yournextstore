import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { SectionRow } from "@/components/home/section-row";
import { getShopSections, getStoreIdentity, sectionRowSize } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `Learn about ${storeName}: how we choose, make and send every piece.`;

	return {
		title: "Our story",
		description,
		alternates: { canonical: "/about" },
		openGraph: { type: "website", title: "Our story", description, url: "/about" },
	};
}

// Editorial photographs bundled with the theme (Pexels, free licence; credits in NOTICE.md).
const PHOTOS = [
	{
		src: "/images/pexels/tote-street.jpg",
		alt: "An olive canvas messenger bag worn over a grey hoodie on a city street",
	},
	{
		src: "/images/pexels/concrete-pose.jpg",
		alt: "A tan duck canvas chore coat and brown carpenter pants against pale concrete",
	},
	{
		src: "/images/pexels/summer-tote.jpg",
		alt: "A white boxy tee, grey fleece shorts and white sneakers on a concrete stoop",
	},
];

const PRINCIPLES = [
	{
		title: "Fewer, better pieces",
		text: "We keep a short range and make each piece count: materials that last, made to be worn often.",
	},
	{
		title: "Made with care",
		text: "Every piece is chosen on purpose, photographed plainly and described honestly.",
	},
	{
		title: "Easy to reach",
		text: "Questions about a piece or an order are always welcome.",
	},
];

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const [identity, sections] = await Promise.all([getStoreIdentity(), getShopSections()]);
	const rowSize = sectionRowSize(sections);

	return (
		<div className="flex flex-col gap-16 pt-2 lg:gap-24 lg:pt-10">
			<JsonLdScript
				data={{
					"@context": "https://schema.org",
					"@type": "AboutPage",
					name: `About ${identity.storeName}`,
					description: identity.storeDescription ?? "Our story, and how we choose every piece.",
				}}
			/>

			<header className="flex flex-col gap-6 border-b border-line pb-8">
				<h1 className="font-display text-[min(120px,30vw)] leading-[0.8] lg:text-[min(240px,17vw)]">
					Our story
				</h1>
				<p className="max-w-[60ch] text-lg leading-relaxed lg:text-xl">
					{identity.storeDescription ??
						`${identity.storeName} is a small shop with a short list of pieces we love. We choose every one ourselves and describe it the way we would want to read about it.`}
				</p>
			</header>

			<div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3 lg:gap-4">
				{PHOTOS.map((photo, index) => (
					<div
						key={photo.src}
						className={`relative aspect-[2/3] overflow-hidden rounded-photo-lg bg-photo ${index === 2 ? "max-lg:hidden" : ""}`}
					>
						<Image
							src={photo.src}
							alt={photo.alt}
							fill
							priority={index === 0}
							sizes="(max-width: 1023px) 50vw, 33vw"
							className="object-cover"
						/>
					</div>
				))}
			</div>

			<section className="flex flex-col gap-8">
				<h2 className="font-display text-[48px] leading-[0.9] lg:text-[min(120px,8.3vw)] lg:leading-[0.85]">
					How we work
				</h2>
				<ol className="grid gap-8 border-t border-line pt-8 md:grid-cols-3 md:gap-6">
					{PRINCIPLES.map((principle, index) => (
						<li key={principle.title} className="flex flex-col gap-3">
							<span className="font-display text-[56px] leading-none opacity-60 tabular-nums">
								{String(index + 1).padStart(2, "0")}
							</span>
							<h3 className="text-[15px] font-semibold">{principle.title}</h3>
							<p className="max-w-[45ch] leading-relaxed text-muted-foreground">{principle.text}</p>
						</li>
					))}
				</ol>
				<div className="flex flex-wrap gap-2">
					<Link
						href="/products"
						className="press flex h-14 items-center rounded-full bg-foreground px-[26px] font-semibold text-background transition-colors hover:bg-ink-hover"
					>
						See what&apos;s new
					</Link>
					{identity.contactFormEnabled ? (
						<Link
							href="/contact"
							className="press flex h-14 items-center rounded-full border border-foreground px-[26px] font-medium"
						>
							Write to us
						</Link>
					) : null}
				</div>
			</section>

			{sections.length > 0 ? (
				<nav aria-label="Browse sections" className="-mx-4 flex flex-col border-t border-line lg:-mx-8">
					{sections.map((section) => (
						<SectionRow
							key={section.slug}
							href={section.href}
							label={section.name}
							count={section.count}
							size={rowSize}
						/>
					))}
				</nav>
			) : null}
		</div>
	);
}
