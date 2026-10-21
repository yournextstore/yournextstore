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

type Figure = { src: string; caption: string };

// Editorial photographs (generated, listed in NOTICE.md) that break up the long read.
const FIGURES_TOP: Figure[] = [
	{ src: "/images/pexels/summer-flatlay.jpg", caption: "Set for breakfast" },
	{ src: "/images/pexels/beach-bag.jpg", caption: "A sofa corner in pastels" },
];
const FIGURES_BOTTOM: Figure[] = [
	{ src: "/images/pexels/hydrangea-light.jpg", caption: "Colour where you least expect it" },
	{ src: "/images/pexels/sunlit-desk.jpg", caption: "Terrazzo pots and bud vases on the shelf" },
];

function Prose({ children }: { children: React.ReactNode }) {
	return <div className="mx-auto max-w-[40rem] space-y-4 px-4 leading-paragraph md:px-0">{children}</div>;
}

/** Two photographs side by side with small captions, as the original breaks up its long read. */
function Figures({ items }: { items: Figure[] }) {
	return (
		<div className="my-16 grid grid-cols-1 gap-5 px-4 md:my-24 md:grid-cols-2 md:gap-[5vw] md:px-8">
			{items.map((item, index) => (
				<figure key={item.src} className={index % 2 === 1 ? "md:mt-[5vw]" : undefined}>
					<div className="relative aspect-[4/3] overflow-hidden rounded-md bg-lightgray">
						<Image
							src={item.src}
							alt=""
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover"
						/>
					</div>
					<figcaption className="mt-3 text-ui-sm text-darkgray">{item.caption}</figcaption>
				</figure>
			))}
		</div>
	);
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

	return (
		<div className="mb-32">
			<JsonLdScript data={aboutJsonLd} />
			<h1 className="mx-auto max-w-[60rem] px-4 pt-6 pb-8 text-center text-ui-3xl md:px-8 md:pt-9 md:text-ui-4xl">
				About {storeName}
			</h1>

			<Prose>
				<p>
					<strong className="font-bold">{storeName}</strong>{" "}
					{storeDescription
						? storeDescription
						: "is a small shop for cheerful homewares: tableware, vases, candles and soft things in bold pastels."}
				</p>
				<p>
					We would rather sell you one thing you keep for years than five you replace next season. So we
					choose carefully, keep the range small, and tell you plainly what you are buying.
				</p>
				<p>
					<Link href="/products" className="font-bold underline hover:no-underline">
						Browse everything we stock
					</Link>{" "}
					or read on for how we work.
				</p>
			</Prose>

			<Figures items={FIGURES_TOP} />

			<Prose>
				<h2 className="pt-4 text-ui-xl font-bold md:text-ui-2xl">How we choose</h2>
				<p>Everything we sell has to be useful and has to make you smile when you see it on the shelf.</p>
				<p>
					We favour durable materials, honest construction and designs that will not date, and we keep our
					range small so each item gets the attention it deserves.
				</p>
			</Prose>

			<Figures items={FIGURES_BOTTOM} />

			<Prose>
				<h2 className="pt-4 text-ui-xl font-bold md:text-ui-2xl">Questions?</h2>
				<p>
					If you would like to know more about a piece before you buy it, or need a hand with an order, we are
					happy to help.
				</p>
				<div className="flex flex-wrap gap-3 pt-4">
					<Link
						href="/products"
						className="flex h-10 items-center rounded-full bg-offblack px-4 text-ui-sm font-bold text-white duration-200 hover:opacity-80"
					>
						Shop all products
					</Link>
					{contactFormEnabled && (
						<Link
							href="/contact"
							className="flex h-10 items-center rounded-full border border-offblack px-4 text-ui-sm font-bold duration-200 hover:opacity-50"
						>
							Contact us
						</Link>
					)}
				</div>
			</Prose>
		</div>
	);
}
