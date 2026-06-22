export function WhaleLogo({ className }: { className?: string }) {
	return (
		<div className={`flex flex-col items-center leading-none ${className ?? ""}`}>
			<svg viewBox="0 0 64 28" className="h-6 w-auto fill-[color:var(--color-yns-navy)]" aria-hidden="true">
				<title>Whale</title>
				<path d="M3 17c2-7 11-12 22-12 9 0 16 4 22 9 2 1 5 1 7 0 1 0 2 1 1 2-2 2-5 3-8 2-1 1-3 2-5 2-3 0-5-1-7-3-3 2-7 3-10 3-7 0-13-1-19-2-2 0-3-1-3-1zm38-7c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" />
			</svg>
			<span className="mt-1 text-[10px] font-medium tracking-[0.4em] text-[color:var(--color-yns-navy)]">
				YNS
			</span>
		</div>
	);
}
