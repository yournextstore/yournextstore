import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/app/contact/contact-form";
import { PageShell } from "@/components/bento/page-shell";
import { getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { isStoreToolEnabled } from "@/lib/store-tools";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName } = await getStoreSeo();
	const description = `Get in touch with the ${storeName} team. Questions about orders, products, or anything else — we're here to help.`;

	return {
		title: "Contact Us",
		description,
		alternates: { canonical: "/contact" },
		openGraph: {
			type: "website",
			title: "Contact Us",
			description,
			url: "/contact",
		},
	};
}

const contactJsonLd = {
	"@context": "https://schema.org",
	"@type": "ContactPage",
	name: "Contact Us",
	description: "Get in touch with our team. Questions about orders, products, or anything else.",
};

export default async function ContactPage() {
	"use cache";
	cacheLife("minutes");

	if (!(await isStoreToolEnabled("contactForm"))) {
		notFound();
	}

	return (
		<PageShell
			eyebrow="Contact"
			title="Talk to a person."
			intro="Have a question or just want to say hello? Send us a message and we'll get back to you as soon as we can."
		>
			<JsonLdScript data={contactJsonLd} />
			<ContactForm />
			<p className="mt-10 text-sm text-[#a3a3a3]">
				Looking for a quick answer? Check our{" "}
				<Link href="/faq" className="font-medium text-amber underline-offset-4 hover:underline">
					frequently asked questions
				</Link>
				.
			</p>
		</PageShell>
	);
}
