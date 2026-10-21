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
		<div className="shell">
			<JsonLdScript data={aboutJsonLd} />
			<article className="prose prose-lg dark:prose-invert mx-auto max-w-none px-0 pt-6 pb-16 text-foreground md:px-4">
				<h1 className="text-center text-4xl font-semibold tracking-tight">About us</h1>
				<p>
					Welcome to {storeName}
					{storeDescription ? ` — ${storeDescription}` : ""}. Every piece in our collection is chosen to be
					worn often and kept for years, and every order is packed by hand before it leaves us.
				</p>
				<h2>What we stand for</h2>
				<p>
					Quality first: durable, well-made products we are proud to stand behind. Thoughtful design:
					considered details that make everyday moments better. Honest service: real people, ready to help
					before and after your order.
				</p>
				<p>
					<Link href="/products">Browse the full range</Link>
					{contactFormEnabled ? (
						<>
							{" "}
							or <Link href="/contact">get in touch</Link> — we would love to hear from you.
						</>
					) : (
						"."
					)}
				</p>
			</article>
		</div>
	);
}
