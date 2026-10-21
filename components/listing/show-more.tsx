"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ShowMore({ paragraphs }: { paragraphs: string[] }) {
	const [open, setOpen] = useState(false);
	const long = paragraphs.join(" ").length > 220 || paragraphs.length > 1;

	return (
		<>
			<div
				className={cn(
					"relative mt-2 flex flex-col gap-4 text-muted-foreground",
					long && !open && "max-h-[100px] overflow-hidden",
				)}
			>
				{long && !open && (
					<div className="pointer-events-none absolute bottom-0 h-[70px] w-full bg-linear-to-b from-transparent to-background/80" />
				)}
				{paragraphs.map((p) => (
					<p key={p} className="leading-7">
						{p}
					</p>
				))}
			</div>
			{long && (
				<Button variant="secondary" onClick={() => setOpen((v) => !v)} className={cn(open && "mt-4")}>
					{open ? "Show less" : "Show more"}
				</Button>
			)}
		</>
	);
}
