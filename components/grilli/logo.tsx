import { cn } from "@/lib/utils";

/** The original's lockup: a gold mark, the name in Forum and a spaced gold line under it. */
export function Logo({ name, className }: { name: string; className?: string }) {
	return (
		<span className={cn("inline-flex items-center gap-2.5", className)}>
			<svg viewBox="0 0 40 40" className="size-9 shrink-0 text-gold xs:size-10" aria-hidden="true">
				<circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
				<path d="M20 8 32 20 20 32 8 20Z" fill="currentColor" />
				<path d="M20 14 26 20 20 26 14 20Z" fill="none" stroke="#161718" strokeWidth="1.6" />
			</svg>
			<span className="flex flex-col leading-none">
				<span className="font-display text-[1.75rem] leading-none text-white xs:text-[2rem]">{name}</span>
				<span className="mt-1 text-[0.625rem] font-medium uppercase tracking-[0.42em] text-gold">
					Online Store
				</span>
			</span>
		</span>
	);
}
