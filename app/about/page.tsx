import { HeartHandshakeIcon, type LucideIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { faqCategories } from "@/app/faq/faq-data";
import { PageHeader } from "@/components/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getStoreInfo } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { ABOUT_IMAGES } from "@/lib/editorial";
import { JsonLdScript } from "@/lib/json-ld";
import { YNSMedia } from "@/lib/yns-media";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `Learn about ${storeName} — who we are and how we choose what we sell.`;

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

const FAQ_PICKS = [
	"How do I place an order?",
	"What payment methods do you accept?",
	"Is my payment information secure?",
	"How do I apply a discount code?",
	"Can I add special instructions to my order?",
];

const reasons: { title: string; text: string; Icon: LucideIcon }[] = [
	{
		title: "Carefully Chosen",
		text: "Every piece in the shop is picked for how it looks, how it feels and how long it lasts.",
		Icon: SparklesIcon,
	},
	{
		title: "Secure Checkout",
		text: "Payments run through a PCI-compliant provider; your card details never touch our servers.",
		Icon: ShieldCheckIcon,
	},
	{
		title: "Honest Details",
		text: "Clear descriptions and real photos, so what arrives is what you expected.",
		Icon: HeartHandshakeIcon,
	},
];

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const info = await getStoreInfo();
	const images = ABOUT_IMAGES;
	const { storeName, storeDescription } = info;
	const pick = (i: number) => (images.length > 0 ? images[i % images.length] : undefined);
	const questions = faqCategories
		.flatMap((category) => category.questions)
		.filter((q) => FAQ_PICKS.includes(q.question));

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: storeDescription ?? `Learn about ${storeName}.`,
	};

	const photo = (src: string | undefined) =>
		src ? (
			<div className="relative aspect-[536/449] overflow-hidden rounded-lg bg-light">
				<YNSMedia
					src={src}
					alt=""
					fill
					sizes="(max-width: 1024px) 100vw, 536px"
					className="object-cover grayscale"
				/>
			</div>
		) : null;

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<PageHeader title="About Us" crumbs={[{ label: "About" }]} />

			<section className="section">
				<div className="shell">
					<div className="grid items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
						{photo(pick(0))}
						<div>
							<h2 className="cp-h2 mb-4 md:mb-6">Our Company</h2>
							<div className="space-y-6 text-sm leading-7 md:text-base">
								<p>
									Welcome to <strong className="text-ink">{storeName}</strong>
									{storeDescription
										? `. ${storeDescription}`
										: ", where good design meets everyday use. We put together a small, considered range of products for the way you live, each one chosen because we would happily use it ourselves."}
								</p>
								<p>
									We would rather offer fewer things done well than a catalogue of everything. Browse the
									collection, take your time, and find the piece that fits your day, only at{" "}
									<strong className="text-ink">{storeName}</strong>.
								</p>
							</div>
						</div>
					</div>

					<div className="mt-14 grid items-center gap-8 lg:mt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
						<div className="order-2 lg:order-none">
							<h2 className="cp-h2 mb-4 md:mb-6">Who We Are?</h2>
							<div className="space-y-6 text-sm leading-7 md:text-base">
								<p>
									At <strong className="text-ink">{storeName}</strong> we look for products with a clear
									purpose and a quiet, lasting design. We describe it honestly and keep the range small enough
									to know every item well.
								</p>
								<p>
									Questions before or after an order are welcome: we would rather help you choose the right
									piece than sell you the wrong one. Welcome to{" "}
									<strong className="text-ink">{storeName}</strong>.
								</p>
							</div>
						</div>
						{photo(pick(1))}
					</div>
				</div>
			</section>

			<section>
				<div className="shell">
					<div className="rounded-md bg-light px-6 py-14 md:px-10">
						<h2 className="cp-h2 mb-10 text-center md:mb-14">Reasons to shop with us</h2>
						<div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-3 md:gap-8">
							{reasons.map(({ title, text, Icon }) => (
								<div key={title} className="text-center">
									<Icon aria-hidden className="mx-auto mb-4 size-11 text-ink" strokeWidth={1.75} />
									<h3 className="cp-h4 mb-4">{title}</h3>
									<p className="mx-auto max-w-64 text-sm leading-6">{text}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="section">
				<div className="shell">
					<div className="rounded-md bg-light px-6 py-14 md:px-12 lg:px-24">
						<div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6">
							<div>
								<h2 className="cp-h2 mb-6 md:mb-8">Frequently Asked Questions</h2>
								<p className="mb-6 leading-7 md:mb-8">
									Short answers to the questions we hear most. Anything else is in the full FAQ.
								</p>
								<Link href={info.contact ? "/contact" : "/faq"} className="cp-btn px-8 py-3">
									{info.contact ? "Contact Us" : "Read the FAQ"}
								</Link>
							</div>
							<Accordion type="single" collapsible defaultValue="faq-0">
								{questions.map((q, i) => (
									<AccordionItem key={q.question} value={`faq-${i}`} className="border-b border-border">
										<AccordionTrigger className="py-3 text-base font-normal text-soft-text hover:no-underline data-[state=open]:font-medium data-[state=open]:text-ink">
											{q.question}
										</AccordionTrigger>
										<AccordionContent className="pb-3 text-base leading-7 text-body-text">
											{q.answer}
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
