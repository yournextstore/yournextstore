import { ArrowRight, HeartHandshake, Leaf, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Breadcrumbs } from "@/components/listing";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { aboutPhoto } from "@/lib/editorial";
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

const values = [
	{
		icon: ShieldCheck,
		title: "Quality first",
		text: "Durable, well-made products we are proud to stand behind.",
	},
	{ icon: Leaf, title: "Nothing extra", text: "Honest materials and simple packaging, no filler." },
	{
		icon: HeartHandshake,
		title: "Honest service",
		text: "Real people, ready to help before and after your order.",
	},
];

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

	return (
		<div className="store-width static-page">
			<JsonLdScript data={aboutJsonLd} />
			<Breadcrumbs items={[["Home", "/"], ["About us"]]} />
			<h1>About us</h1>
			<div className="media about-photo">
				<YNSMedia
					src={aboutPhoto}
					alt=""
					fill
					priority
					sizes="(max-width: 760px) 100vw, 820px"
					className="object-cover"
				/>
			</div>
			<div className="prose-copy">
				{storeDescription && <p className="static-lead">{storeDescription}</p>}
				<p>
					{storeName} is a small shop with a short, considered list. Each product is photographed and
					described plainly, so you know what you are getting before it reaches you.
				</p>
				<p>
					Browse without creating an account. When you are ready, checkout takes a minute, and your order
					history is waiting in your account whenever you need it.
				</p>
			</div>
			<section className="about-values" aria-labelledby="values-heading">
				<h2 id="values-heading">What we stand for</h2>
				<div className="trust-row about-trust">
					{values.map(({ icon: Icon, title, text }) => (
						<div className="trust-item" key={title}>
							<span className="icon-tile" aria-hidden>
								<Icon size={18} strokeWidth={1.7} aria-hidden />
							</span>
							<div>
								<h3>{title}</h3>
								<p>{text}</p>
							</div>
						</div>
					))}
				</div>
			</section>
			<div className="about-cta">
				<Link href="/products" className="button primary lg">
					Shop products <ArrowRight size={18} aria-hidden />
				</Link>
				{contactFormEnabled && (
					<Link href="/contact" className="button lg">
						Contact us
					</Link>
				)}
			</div>
		</div>
	);
}
