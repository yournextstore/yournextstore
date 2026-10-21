import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { HOUSE_PLATES } from "@/lib/editorial";
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

	const plates = HOUSE_PLATES;
	const principles: [string, string][] = [
		["Provenance", "Every piece is traced to the hands that made it before it enters the register."],
		["Description", "Photographed in daylight, measured and described plainly, flaws included."],
		["Care", "Chosen with care and kept in the register until it finds its owner."],
		["Clarity", "Prices, availability and details are shown plainly on every record."],
	];

	return (
		<div className="mx-auto max-w-[1100px] px-4 sm:px-6">
			<JsonLdScript data={aboutJsonLd} />
			<nav aria-label="Breadcrumb" className="eti flex gap-x-2.5 pt-10 text-faint">
				<Link href="/" className="transition hover:text-acc">
					The archive
				</Link>
				<span aria-hidden>/</span>
				<span aria-current="page" className="text-ink">
					The house
				</span>
			</nav>
			<section className="flex flex-wrap items-start gap-x-14 gap-y-9 pb-16 pt-8">
				<div className="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
					<span className="eti tracking-[0.18em] text-acc">The house</span>
					<h1 className="font-sf text-[clamp(30px,4.4vw,46px)] leading-[1.1] tracking-[-0.01em]">
						About {storeName}
					</h1>
					<p className="max-w-[54ch] text-[14.5px] leading-[1.75] text-soft">
						{storeDescription ??
							"We keep a small register of pieces we would want to own ourselves. Each one is chosen, photographed and described before it is offered."}
					</p>
					<p className="max-w-[54ch] text-[14.5px] leading-[1.75] text-soft">
						The archive is deliberately unhurried: no seasons, no countdowns, no series production. A piece
						stays in the register until it finds its owner.
					</p>
					<div className="mt-2 flex flex-col">
						{principles.map(([label, text]) => (
							<div key={label} className="flex flex-wrap gap-x-[18px] gap-y-1 border-t border-line py-3">
								<h2 className="eti w-[140px] flex-none text-faint">{label}</h2>
								<p className="min-w-0 flex-[1_1_220px] text-[13.5px] leading-[1.6] text-ink">{text}</p>
							</div>
						))}
					</div>
					<div className="flex flex-wrap gap-3 border-t border-rule pt-5">
						<Link href="/products" className="btn-keeper px-[22px] py-[13px]">
							Browse the archive
						</Link>
						{contactFormEnabled && (
							<Link href="/contact" className="link-rule self-center text-acc">
								Write to us
							</Link>
						)}
					</div>
				</div>
				{plates.length > 0 ? (
					<div className="grid min-w-0 flex-[1_1_380px] grid-cols-2 gap-3">
						{plates.map((shot, index) => (
							<div
								key={shot.src}
								className={`hatch relative flex aspect-[2/3] items-end overflow-hidden border border-line p-2.5 shadow-[0_14px_28px_-18px_oklch(0.22_0.006_0/0.45)] ${index === 1 ? "mt-10" : ""}`}
							>
								<Image
									src={shot.src}
									alt={shot.alt}
									fill
									priority={index === 0}
									fetchPriority={index === 0 ? "high" : undefined}
									sizes="(max-width: 768px) 50vw, 260px"
									className="object-cover"
								/>
								<span className="plate-label relative">plate {String(index + 8).padStart(2, "0")}</span>
							</div>
						))}
					</div>
				) : null}
			</section>
		</div>
	);
}
