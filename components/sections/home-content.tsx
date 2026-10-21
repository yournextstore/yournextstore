import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { faqCategories } from "@/app/faq/faq-data";

const features = [
	"Notebooks, pens, ink, paper and desk things, organised by category so you can find them fast",
	"A simple path from browsing to checkout: category → product → cart → order",
	"Clear prices on every product, with any discount shown before you pay",
	"Secure checkout with the payment methods you already use",
	"An order confirmation by email as soon as you buy, and updates after that",
	"Built to load quickly and read well on any phone, tablet or desktop",
];

/** The original's content block: a left-aligned heading over a quiet bulleted list. */
export function FeatureList() {
	return (
		<section className="mx-auto max-w-5xl px-4 py-12 sm:px-8">
			<h2 className="text-xl tracking-tight sm:text-2xl">Everything for the writing desk, in one place</h2>
			<ul className="mt-6 list-disc space-y-1 ps-5 text-sm leading-7 text-neutral-600 marker:text-neutral-300 dark:text-neutral-400 dark:marker:text-neutral-600">
				{features.map((feature) => (
					<li key={feature}>{feature}</li>
				))}
			</ul>
		</section>
	);
}

/** Call-to-action block: a soft grey rounded panel with centred copy. */
export function HelpCallout() {
	return (
		<div className="mx-auto max-w-[82rem] px-4 md:px-12">
			<section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-(--surface) px-4 py-5 text-center sm:rounded-3xl sm:px-6 md:px-10">
				<h2 className="text-lg tracking-tight sm:text-xl">Looking for something specific?</h2>
				<p className="mx-auto mt-4 max-w-3xl text-sm text-neutral-700 dark:text-neutral-300">
					Use the search at the top of the page, browse the{" "}
					<Link href="/products" className="underline underline-offset-2">
						full shop
					</Link>{" "}
					or read the{" "}
					<Link href="/faq" className="underline underline-offset-2">
						questions we hear most
					</Link>
					.
				</p>
			</section>
		</div>
	);
}

/** FAQ block: bordered disclosure rows with a round plus/minus badge. */
export function HomeFaq() {
	const items = faqCategories.flatMap((category) => category.questions.slice(0, 2)).slice(0, 8);

	return (
		<section aria-labelledby="home-faq" className="mx-auto max-w-xl px-4 py-12 sm:max-w-2xl">
			<h2 id="home-faq" className="mb-6 text-xl tracking-tight sm:text-2xl">
				Frequently asked questions
			</h2>
			<div className="flex flex-col gap-2 text-start">
				{items.map((item) => (
					<details key={item.question} className="faq-item group">
						<summary className="faq-summary">
							<span className="faq-icon">
								<Plus className="size-4 group-open:hidden" aria-hidden="true" />
								<Minus className="hidden size-4 group-open:block" aria-hidden="true" />
							</span>
							<span className="faq-question min-w-0 break-words">{item.question}</span>
						</summary>
						<div className="faq-body break-words">{item.answer}</div>
					</details>
				))}
			</div>
			<p className="mt-6 text-center">
				<Link href="/faq" className="btn-rose">
					See all questions
				</Link>
			</p>
		</section>
	);
}
