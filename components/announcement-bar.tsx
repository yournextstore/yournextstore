"use client";

import { XIcon } from "lucide-react";
import { useState } from "react";

/** The original's dismissible top strip; here it carries the store's own free-shipping threshold. */
export function AnnouncementBar({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(true);
	if (!open) return null;
	return (
		<div className="relative bg-background px-10 py-2.5 text-center text-sm text-body-text shadow-[0_1px_8px_rgba(0,0,0,0.06)] md:py-4 md:text-base">
			<p>{children}</p>
			<button
				type="button"
				onClick={() => setOpen(false)}
				aria-label="Dismiss announcement"
				className="absolute top-1/2 right-3 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-light text-ink transition-opacity hover:opacity-70 md:right-6"
			>
				<XIcon className="size-3" strokeWidth={2.5} />
			</button>
		</div>
	);
}
