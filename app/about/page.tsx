import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { ArrowLink } from "@/components/section-header";
import { getStoreSeo } from "@/lib/commerce";
import { EDITORIAL, getStoreIdentity } from "@/lib/theme";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `Learn about ${storeName}: our story, our values and the pieces we choose.`;

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

const values = [
	{
		title: "Honest materials",
		body: "Solid oak and ash, washed linen, wool and stone, chosen for how they feel and age, not just how they photograph.",
	},
	{
		title: "Timeless shapes",
		body: "Low, soft forms and pale, warm colours that sit as easily in a city flat as in a house by the sea.",
	},
	{
		title: "Real use",
		body: "Every piece is made to be sat on, eaten at and slept in every day, not kept for best.",
	},
];

/** The original has no about page: this one extends its language (hero, split panels, ruled columns). */
export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const identity = await getStoreIdentity();

	return (
		<>
			<section className="relative flex h-[60svh] min-h-[26rem] items-end overflow-hidden bg-ink md:h-[70svh] md:max-h-[44rem]">
				<Image src={EDITORIAL.band[2]} alt="" fill priority sizes="100vw" className="object-cover" />
				<div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-black/10" />
				<div className="shell relative pb-14 text-white md:pb-20">
					<h1 className="text-h1 uppercase">About us</h1>
					<p className="mt-4 max-w-xl text-base text-white/90">
						{identity.description ??
							`${identity.name} makes calm, light furniture for the rooms you live in.`}
					</p>
				</div>
			</section>

			<section className="grid bg-band md:min-h-[38rem] md:grid-cols-2">
				<div className="flex flex-col items-center justify-center px-5 py-16 text-center md:px-10">
					<h2 className="max-w-md text-h3 uppercase">Made to be lived with</h2>
					<p className="mt-5 max-w-md text-[15px] leading-relaxed">
						We started {identity.name} with a simple idea: the sofa you sink into and the table you eat at
						every day should be good enough to keep. So we make fewer of them, look closely at the wood and
						the weave, and keep the shapes simple enough to settle into any room.
					</p>
					<ArrowLink href="/products" className="mt-6">
						Explore the collection
					</ArrowLink>
				</div>
				<div className="relative aspect-[4/3] md:aspect-auto">
					<Image
						src={EDITORIAL.tiles[1]}
						alt=""
						fill
						sizes="(min-width: 768px) 50vw, 100vw"
						className="object-cover"
					/>
				</div>
			</section>

			<section className="py-16 md:py-24">
				<div className="shell">
					<h2 className="text-h3 uppercase">What we care about</h2>
					<ul className="mt-10 grid divide-y divide-input rounded-md border border-input md:grid-cols-3 md:divide-x md:divide-y-0">
						{values.map((value, i) => (
							<li key={value.title} className="px-6 py-10 md:px-10 md:py-14">
								<p className="font-serif text-sm text-muted-foreground">0{i + 1}</p>
								<h3 className="mt-4 text-2xl uppercase">{value.title}</h3>
								<p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{value.body}</p>
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="bg-muted py-16 md:py-20">
				<div className="shell flex flex-col items-center text-center">
					<h2 className="text-h4 uppercase">Make yourself at home</h2>
					<p className="mt-3 max-w-md text-[15px]">
						Questions about a piece or an order? We are happy to help.
					</p>
					<div className="mt-8 flex flex-wrap justify-center gap-3">
						<Link
							href="/products"
							className="inline-flex h-12 items-center rounded-xs bg-primary px-8 text-[13px] font-medium tracking-[0.02em] text-primary-foreground uppercase transition-colors hover:bg-[#6d6966]"
						>
							Shop all
						</Link>
						<Link
							href={identity.contactEnabled ? "/contact" : "/faq"}
							className="inline-flex h-12 items-center rounded-xs border border-input bg-white px-8 text-[13px] font-medium tracking-[0.02em] uppercase transition-colors hover:bg-accent"
						>
							{identity.contactEnabled ? "Contact us" : "Read the FAQ"}
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
