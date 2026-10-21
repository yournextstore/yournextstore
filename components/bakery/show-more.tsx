"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { buttonClass } from "@/lib/ui";
import { cn } from "@/lib/utils";

/**
 * The original's "Show more" veil: the group renders collapsed (CSS hides the extra items through
 * `group-data-[show-more=false]`), a cream gradient fades the last row and a teal button opens it.
 */
export function ShowMoreGroup({
	children,
	className,
	label = "Show more",
}: {
	children: React.ReactNode;
	className?: string;
	label?: string;
}) {
	const [open, setOpen] = useState(false);

	return (
		<div data-show-more={open} className={cn("group relative", className)}>
			{children}
			{open ? null : (
				<div className="absolute -bottom-4 left-0 right-0 flex h-64 flex-col sm:-left-6 sm:-right-6 lg:-left-8 lg:-right-8 lg:h-80">
					<div className="flex-1 bg-linear-to-t from-background" />
					<div className="bg-background px-6 py-4 lg:px-0">
						<button
							type="button"
							onClick={() => setOpen(true)}
							className={buttonClass({ variant: "secondary", className: "mx-auto flex w-full lg:w-fit" })}
						>
							<span>{label}</span>
							<Plus aria-hidden="true" className="h-5 w-5" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
