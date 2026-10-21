import type { Metadata } from "next";
import { type FAQCategory, faqCategories } from "@/app/faq/faq-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName } = await getStoreSeo();
	const description = `Frequently asked questions about orders, payments, shipping, and returns at ${storeName}.`;

	return {
		title: "FAQ",
		description,
		alternates: { canonical: "/faq" },
		openGraph: {
			type: "website",
			title: "Frequently Asked Questions",
			description,
			url: "/faq",
		},
	};
}

function buildFaqJsonLd(categories: FAQCategory[]): Record<string, unknown> {
	const mainEntity = categories.flatMap((category) =>
		category.questions.map((q) => ({
			"@type": "Question",
			name: q.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: q.answer,
			},
		})),
	);

	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity,
	};
}

function CategoryNav({ categories }: { categories: FAQCategory[] }) {
	return (
		<nav aria-label="FAQ topics" className="flex flex-wrap gap-2">
			{categories.map((category) => (
				<a key={category.id} href={`#${category.id}`} className="hull-btn">
					{category.title}
				</a>
			))}
		</nav>
	);
}

/** The original's accordion group: a ruled list with 18px semibold toggles. */
function FAQSection({ category }: { category: FAQCategory }) {
	return (
		<section id={category.id} className="mb-12 scroll-mt-40 last:mb-0">
			<h2 className="mb-4 text-h4">{category.title}</h2>
			<Accordion className="border-b border-border">
				{category.questions.map((item, index) => (
					<AccordionItem
						key={`${category.id}-${index}`}
						value={`${category.id}-${index}`}
						className="border-t border-b-0 border-border"
					>
						<AccordionTrigger className="rounded-none py-4 text-[1.125rem] leading-[1.35] font-semibold hover:no-underline">
							{item.question}
						</AccordionTrigger>
						<AccordionContent>
							<p className="max-w-2xl pb-8 text-body">{item.answer}</p>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
}

export default function FAQPage() {
	return (
		<div>
			<JsonLdScript data={buildFaqJsonLd(faqCategories)} />
			<section className="grid gap-4 border-b border-border px-4 py-12 md:grid-cols-2 md:gap-8 md:p-8 md:py-16 lg:py-20">
				<h1 className="text-h1">Questions &amp; Answers</h1>
				<p className="max-w-xl text-h5 leading-[1.6] md:text-h4">
					Orders, payments, shipping and returns — the short answers.
				</p>
			</section>
			<div className="border-b border-border px-4 py-6 md:px-8">
				<CategoryNav categories={faqCategories} />
			</div>
			<div className="px-4 py-12 md:p-8 md:py-16 lg:py-20">
				<div className="mx-auto max-w-3xl">
					{faqCategories.map((category) => (
						<FAQSection key={category.id} category={category} />
					))}
				</div>
			</div>
		</div>
	);
}
