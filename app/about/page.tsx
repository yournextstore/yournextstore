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

	return (
		<article className="shell">
			<JsonLdScript data={aboutJsonLd} />
			<div className="markdown-content mx-auto max-w-3xl text-foreground">
				<h1 className="mb-6 font-serif text-4xl tracking-tight">About</h1>
				{storeDescription && <p className="text-lg text-muted-foreground">{storeDescription}</p>}
				<p>
					{storeName} is a small shop for well-made everyday things. We keep the catalogue short on purpose,
					so every piece in it is one we would use ourselves.
				</p>
				<p>
					Everything here is chosen for how it fits into everyday life: the materials, the way it is put
					together, how it wears in after a year of use. If something does not hold up, it does not stay on
					the shelf.
				</p>

				<h2>Small by design</h2>
				<p>We focus on the essentials:</p>
				<ul>
					<li>A considered range rather than an endless one</li>
					<li>Honest descriptions and clear prices</li>
					<li>Materials and making that are worth keeping</li>
				</ul>

				<h2>Get in touch</h2>
				<p>
					Questions about a product? Read the <Link href="/faq">frequently asked questions</Link>
					{contactFormEnabled ? (
						<>
							{" "}
							or <Link href="/contact">send us a message</Link>
						</>
					) : null}
					. Or simply <Link href="/products">browse the shop</Link>.
				</p>
			</div>
		</article>
	);
}
