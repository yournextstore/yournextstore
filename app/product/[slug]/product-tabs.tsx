"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import type { ReactNode } from "react";
import { MinusIcon, PlusIcon } from "@/components/icons";

export type ProductTab = { label: string; content: ReactNode };

/** The original's product accordion: one open at a time, a plus that turns into a minus. */
export function ProductTabs({ tabs }: { tabs: ProductTab[] }) {
	return (
		<div className="w-full">
			{/* Base UI renders each trigger inside an h3; this keeps the outline h1 → h2 → h3. */}
			<h2 className="sr-only">Product information</h2>
			<AccordionPrimitive.Root className="flex w-full flex-col">
				{tabs.map((tab) => (
					<AccordionPrimitive.Item key={tab.label} value={tab.label}>
						<AccordionPrimitive.Header className="m-0">
							<AccordionPrimitive.Trigger className="group flex w-full items-center justify-between py-2 text-left text-lead">
								{tab.label}
								<span className="flex size-12 shrink-0 items-center justify-center">
									<PlusIcon className="size-5 group-aria-expanded:hidden" />
									<MinusIcon className="hidden size-5 group-aria-expanded:block" />
								</span>
							</AccordionPrimitive.Trigger>
						</AccordionPrimitive.Header>
						<AccordionPrimitive.Panel className="h-(--accordion-panel-height) overflow-hidden text-copy text-muted-foreground transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
							<div className="pb-6">{tab.content}</div>
						</AccordionPrimitive.Panel>
					</AccordionPrimitive.Item>
				))}
			</AccordionPrimitive.Root>
		</div>
	);
}
