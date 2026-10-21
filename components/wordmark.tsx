/** Text stand-in for the original's heavy logotype with its little sky-blue triangle. */
export function Wordmark({ name, className = "" }: { name: string; className?: string }) {
	return (
		<span className={`inline-flex items-center gap-1.5 ${className}`}>
			<span className="truncate text-[1.6rem] leading-none font-extrabold tracking-[-0.04em] text-black">
				{name}
			</span>
			<svg aria-hidden viewBox="0 0 10 9" className="h-2.5 w-2.5 shrink-0 fill-sky-dot">
				<path d="M5 0 10 9H0z" />
			</svg>
		</span>
	);
}
