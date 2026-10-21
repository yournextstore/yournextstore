/** Two quiet trust lines under the buy row, brand icons as in the original. */
export function TrustBadges() {
	return (
		<div className="flex flex-col gap-1.5 text-[13px] text-muted-foreground">
			<p className="flex items-center gap-2">
				<svg
					aria-hidden
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="shrink-0 text-brand"
				>
					<rect x="1" y="5" width="14" height="12" rx="1" />
					<path d="M15 9h4l3 3v5h-7z" />
					<circle cx="6" cy="19" r="1.6" />
					<circle cx="18" cy="19" r="1.6" />
				</svg>
				Delivery options shown at checkout
			</p>
			<p className="flex items-center gap-2">
				<svg
					aria-hidden
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="shrink-0 text-brand"
				>
					<path d="M9 14 4 9l5-5" />
					<path d="M4 9h10a6 6 0 0 1 0 12h-3" />
				</svg>
				Return terms in our store policies
			</p>
		</div>
	);
}
