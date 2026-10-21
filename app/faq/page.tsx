import type { Metadata } from "next";
import { type FAQCategory, faqCategories } from "@/app/faq/faq-data";
import { FaqAccordion } from "@/components/faq-accordion";
import { BreadcrumbBar, ListingTitle } from "@/components/listing";
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
		<nav aria-label="FAQ topics" className="flex flex-wrap justify-center gap-2">
			{categories.map((category) => (
				<a
					key={category.id}
					href={`#${category.id}`}
					className="inline-flex h-10 items-center rounded-full border border-border px-5 text-sm/6 uppercase transition-colors hover:bg-secondary"
				>
					{category.title}
				</a>
			))}
		</nav>
	);
}

function FAQSection({ category }: { category: FAQCategory }) {
	return (
		<section id={category.id} className="grid scroll-mt-32 gap-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
			<h2 className="text-[2rem] leading-none font-medium">{category.title}</h2>
			<FaqAccordion items={category.questions} defaultOpen={null} className="border-y border-border" />
		</section>
	);
}

export default function FAQPage() {
	return (
		<div>
			<JsonLdScript data={buildFaqJsonLd(faqCategories)} />
			<BreadcrumbBar items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
			<ListingTitle
				lead="Questions"
				title="& Answers"
				subtitle="Orders, payments, shipping and more, answered"
			/>
			<div className="shell">
				<CategoryNav categories={faqCategories} />
				<div className="mx-auto mt-16 max-w-5xl space-y-16">
					{faqCategories.map((category) => (
						<FAQSection key={category.id} category={category} />
					))}
				</div>
				<div className="mx-auto mt-24 max-w-xl text-center">
					<h2 className="text-[2rem] leading-none font-medium sm:text-4xl">
						Still have <em>questions</em>?
					</h2>
					<p className="mt-4 text-sm/6 text-muted-foreground">
						We are here to help. Reach out and we will get back to you as soon as possible.
					</p>
				</div>
			</div>
		</div>
	);
}
