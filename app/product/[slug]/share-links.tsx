"use client";

import { CheckIcon, LinkIcon } from "lucide-react";
import { useState } from "react";

const CHIP =
	"flex h-7 min-w-7 items-center justify-center rounded-md border border-border bg-background px-1.5 text-xs font-bold text-soft-text transition-colors hover:bg-ink hover:text-background";

/** The original's small square share buttons: Facebook, X, LinkedIn and copy-link. */
export function ShareLinks({ url, title }: { url: string; title: string }) {
	const [copied, setCopied] = useState(false);
	const encoded = encodeURIComponent(url);
	const links = [
		{
			label: "Share on Facebook",
			short: "f",
			href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
		},
		{
			label: "Share on X",
			short: "X",
			href: `https://x.com/intent/post?url=${encoded}&text=${encodeURIComponent(title)}`,
		},
		{
			label: "Share on LinkedIn",
			short: "in",
			href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
		},
	];

	return (
		<ul className="flex items-center gap-2">
			{links.map((link) => (
				<li key={link.label}>
					<a
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={link.label}
						className={CHIP}
					>
						{link.short}
					</a>
				</li>
			))}
			<li className="flex items-center gap-2">
				<button
					type="button"
					aria-label="Copy link"
					className={CHIP}
					onClick={() => {
						navigator.clipboard
							.writeText(url)
							.then(() => setCopied(true))
							.catch(() => setCopied(false));
					}}
				>
					{copied ? (
						<CheckIcon aria-hidden className="size-3.5" strokeWidth={2.5} />
					) : (
						<LinkIcon aria-hidden className="size-3.5" strokeWidth={2.5} />
					)}
				</button>
				<span aria-live="polite" className="text-xs text-body-text">
					{copied ? "Link copied" : ""}
				</span>
			</li>
		</ul>
	);
}
