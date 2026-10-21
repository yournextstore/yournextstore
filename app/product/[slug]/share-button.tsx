"use client";

import { toast } from "sonner";

/** Web Share sheet where the browser has one, a copied link everywhere else. */
export function ShareButton({ title }: { title: string }) {
	const onShare = async () => {
		const url = window.location.href;
		if (navigator.share) {
			await navigator.share({ title, url }).catch(() => undefined);
			return;
		}
		await navigator.clipboard.writeText(url).then(
			() => toast.success("Link copied"),
			() => toast.error("Could not copy the link"),
		);
	};

	return (
		<button
			type="button"
			onClick={onShare}
			className="mt-6 inline-flex w-fit items-center gap-2 py-1 text-xs uppercase tracking-widest text-faint transition-colors hover:text-foreground"
		>
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<circle cx="18" cy="5" r="3" />
				<circle cx="6" cy="12" r="3" />
				<circle cx="18" cy="19" r="3" />
				<line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
				<line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
			</svg>
			Share
		</button>
	);
}
