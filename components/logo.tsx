/** The original's logo is a rounded-square outline beside a word; the word is the store's name. */
export function Logo({ name, inverse = false }: { name: string; inverse?: boolean }) {
	return (
		<span className={`flex min-w-0 items-center gap-[6px] ${inverse ? "text-white" : "text-ink"}`}>
			<span aria-hidden className="size-8 shrink-0 rounded-[6px] border-2 border-current" />
			<span className="truncate text-[22px] leading-none tracking-[-0.01em]">{name}</span>
		</span>
	);
}
