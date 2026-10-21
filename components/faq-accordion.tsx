"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

/** The original's FAQ list: uppercase questions, a plus that turns into a minus, hairline rules. */
export function FaqAccordion({
	items,
	defaultOpen = 0,
	className,
}: {
	items: { question: string; answer: string }[];
	defaultOpen?: number | null;
	className?: string;
}) {
	return (
		<AccordionPrimitive.Root
			type="single"
			collapsible
			defaultValue={defaultOpen === null ? undefined : `item-${defaultOpen}`}
			className={cn("divide-y divide-border", className)}
		>
			{items.map((item, index) => (
				<AccordionPrimitive.Item key={item.question} value={`item-${index}`} className="py-1">
					<AccordionPrimitive.Header className="flex">
						<AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between gap-6 py-4 text-left text-sm/6 uppercase outline-none focus-visible:underline">
							{item.question}
							<span aria-hidden="true" className="relative h-3 w-3 shrink-0">
								<span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-muted-foreground" />
								<span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-muted-foreground transition-transform duration-200 group-data-[state=open]:scale-y-0" />
							</span>
						</AccordionPrimitive.Trigger>
					</AccordionPrimitive.Header>
					<AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
						<p className="max-w-md pb-5 text-sm/6 text-muted-foreground">{item.answer}</p>
					</AccordionPrimitive.Content>
				</AccordionPrimitive.Item>
			))}
		</AccordionPrimitive.Root>
	);
}
