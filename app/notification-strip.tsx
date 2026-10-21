"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/** The original's dismissible sky strip above the header, with a pill link inside the line. */
export function NotificationStrip({ label, href, text }: { label: string; href: string; text: string }) {
	const [open, setOpen] = useState(true);
	if (!open) return null;
	return (
		<div className="bg-white pb-1">
			<div className="relative flex items-center justify-center gap-3 bg-sky/80 px-4 py-2 sm:py-4 sm:pr-12 md:px-8">
				<p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-ink md:text-base">
					<span>{text}</span>
					<Link
						href={href}
						className="inline-block whitespace-nowrap rounded-lg bg-sky px-2 py-2 text-xs font-semibold text-ink transition-colors hover:bg-sky-deep md:text-sm"
					>
						{label}
					</Link>
				</p>
				<button
					type="button"
					onClick={() => setOpen(false)}
					aria-label="Dismiss announcement"
					className="shrink-0 text-ink/80 transition-colors hover:text-ink sm:absolute sm:right-3 xl:right-4"
				>
					<X className="size-5 md:size-6" strokeWidth={2} aria-hidden />
				</button>
			</div>
		</div>
	);
}
