import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { EDITORIAL } from "@/lib/catalog";
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
			storeName: me.store.settings?.storeName || me.store.name || "our store",
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
		description: storeDescription ?? "A shop and magazine for colourful, everyday things.",
	};

	const photos = EDITORIAL.about;

	return (
		<div className="frame pt-6 lg:pt-10">
			<JsonLdScript data={aboutJsonLd} />

			<div className="max-w-[600px]">
				<h1 className="text-[28px] leading-tight font-semibold sm:text-[32px]">About</h1>
				<p className="mt-3 text-base leading-[1.9] text-muted-foreground sm:text-lg">
					{storeDescription ??
						`${storeName} is a shop and a magazine in one: everyday pieces, and the stories of the days they become part of.`}{" "}
					Browse the{" "}
					<Link href="/products" className="font-bold text-foreground underline underline-offset-4">
						whole shop
					</Link>{" "}
					or read on.
				</p>
			</div>

			<div className="mt-10 max-w-[900px]">
				<h2 className="text-xl font-bold text-foreground">Everyday design</h2>
				<p className="mt-3 text-base leading-[1.9] text-muted-foreground sm:text-lg">
					We pick every piece for how it is used, not only how it looks: honest materials, simple forms and
					things you actually want to reach for. Then we add some colour, because every day should feel like
					the people living it.
				</p>
				<ul className="mt-3 list-disc space-y-1 pl-5 text-base leading-[1.9] text-muted-foreground sm:text-lg">
					<li>Design</li>
					<li>Colour</li>
					<li>Comfort</li>
				</ul>
			</div>

			<div className="mt-14 grid grid-cols-2 gap-2 lg:mt-20">
				{photos.map((photo, index) => (
					<div
						key={index}
						className={
							index === 0 || index === 3
								? "relative col-span-2 aspect-[3/2] overflow-hidden border border-border bg-secondary"
								: "relative aspect-[3/4] overflow-hidden border border-border bg-secondary"
						}
					>
						{photo && (
							<YNSMedia
								src={photo}
								alt=""
								fill
								priority={index === 0}
								sizes={
									index === 0 || index === 3
										? "(max-width: 1264px) 100vw, 1232px"
										: "(max-width: 1264px) 50vw, 616px"
								}
								className="object-cover"
							/>
						)}
					</div>
				))}
			</div>

			<div className="mt-16 flex flex-col gap-3 sm:flex-row">
				<Link
					href="/products"
					className="inline-flex h-12 items-center justify-center rounded-xs bg-peach px-8 text-base font-bold text-foreground transition-colors hover:bg-pink"
				>
					Visit the shop
				</Link>
				{contactFormEnabled && (
					<Link
						href="/contact"
						className="inline-flex h-12 items-center justify-center rounded-xs border-2 border-foreground px-8 text-base font-bold text-foreground hover:bg-secondary"
					>
						Get in touch
					</Link>
				)}
			</div>
		</div>
	);
}
