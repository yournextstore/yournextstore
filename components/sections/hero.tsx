import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative bg-background border-b border-border">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				{/* Breadcrumb */}
				<div className="pt-8 sm:pt-10">
					<nav
						aria-label="Breadcrumb"
						className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-muted-foreground"
					>
						<YnsLink href="/" className="hover:text-foreground transition-colors">
							Women
						</YnsLink>
						<span aria-hidden>—</span>
						<YnsLink href="/products" className="hover:text-foreground transition-colors">
							Clothes
						</YnsLink>
						<span aria-hidden>—</span>
						<span className="text-foreground">Tops</span>
					</nav>
				</div>

				{/* Category headline */}
				<div className="pt-6 sm:pt-8 pb-6 flex items-end gap-3 sm:gap-4">
					<h1 className="font-display text-5xl sm:text-7xl lg:text-[88px] leading-[0.95] tracking-[-0.01em] text-foreground uppercase">
						Women&rsquo;s Tops
					</h1>
					<span className="font-display text-base sm:text-lg text-muted-foreground mb-3 sm:mb-5">
						<sup>139</sup>
					</span>
				</div>

				{/* Filter chip bar */}
				<div className="pb-6 sm:pb-8 flex flex-wrap items-center justify-between gap-3">
					<div className="flex flex-wrap items-center gap-2">
						<FilterChip label="Filters" active />
						<FilterChip label="Tops" closable />
						<FilterChip label="Size M" closable />
						<FilterChip label="$300 – $720" closable />
					</div>
					<button
						type="button"
						className="inline-flex items-center gap-2 h-9 px-4 rounded-full border border-foreground/80 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-foreground hover:text-background transition-colors"
					>
						Sort by
						<span aria-hidden className="text-base leading-none">
							+
						</span>
					</button>
				</div>
			</div>
		</section>
	);
}

function FilterChip({
	label,
	active = false,
	closable = false,
}: {
	label: string;
	active?: boolean;
	closable?: boolean;
}) {
	return (
		<button
			type="button"
			className={`group inline-flex items-center gap-2 h-9 px-4 rounded-full border text-[11px] tracking-[0.2em] uppercase font-medium transition-colors ${
				active
					? "bg-foreground text-background border-foreground"
					: "bg-background text-foreground border-border hover:border-foreground/80"
			}`}
		>
			{label}
			{active && !closable && (
				<span
					aria-hidden
					className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-background text-foreground text-[10px]"
				>
					+
				</span>
			)}
			{closable && (
				<span
					aria-hidden
					className="ml-1 inline-flex h-4 w-4 items-center justify-center text-foreground/60 group-hover:text-foreground"
				>
					×
				</span>
			)}
		</button>
	);
}
