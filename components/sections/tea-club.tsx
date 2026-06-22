import { YnsLink } from "../yns-link";

const BENEFITS = [
	{
		title: "Delivered monthly",
		body: "Two fresh blends and a seasonal limited edition, sent the first Tuesday of each month.",
		icon: (
			<svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-7 w-7">
				<title>calendar</title>
				<rect x="4" y="7" width="24" height="21" rx="2" stroke="currentColor" strokeWidth="1.2" />
				<path d="M4 13h24" stroke="currentColor" strokeWidth="1.2" />
				<path d="M10 4v6M22 4v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
			</svg>
		),
	},
	{
		title: "Free brewing kit",
		body: "Your first box ships with a hand-finished steel infuser and a guide to brewing every leaf.",
		icon: (
			<svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-7 w-7">
				<title>kit</title>
				<path
					d="M8 12h16l-1.5 12a3 3 0 0 1-3 2.6h-7a3 3 0 0 1-3-2.6L8 12z"
					stroke="currentColor"
					strokeWidth="1.2"
				/>
				<path d="M12 12V8a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.2" />
			</svg>
		),
	},
	{
		title: "Pause anytime",
		body: "Skip a month, swap a blend, or cancel in a single tap. No long-form goodbyes.",
		icon: (
			<svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-7 w-7">
				<title>pause</title>
				<circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.2" />
				<path d="M13 12v8M19 12v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
			</svg>
		),
	},
];

export function TeaClub() {
	return (
		<section id="tea-club" className="bg-[color:var(--color-yns-blue-100)]">
			<div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 sm:py-24">
				<div className="text-center max-w-2xl mx-auto">
					<p className="text-[11px] tracking-[0.4em] uppercase text-[color:var(--color-yns-blue-400)]">
						The tea club
					</p>
					<h2 className="mt-5 font-serif font-light text-4xl sm:text-5xl text-[color:var(--color-yns-navy)] leading-[1.05]">
						A standing invitation to brew better.
					</h2>
				</div>
				<div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-[color:var(--color-yns-navy)]">
					{BENEFITS.map((b) => (
						<div key={b.title} className="text-center">
							<div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-[color:var(--color-yns-navy)] ring-1 ring-[color:var(--color-yns-blue-200)]">
								{b.icon}
							</div>
							<h3 className="mt-6 font-serif text-2xl font-light">{b.title}</h3>
							<p className="mt-3 text-sm text-[color:var(--color-yns-navy)]/70 leading-relaxed max-w-xs mx-auto">
								{b.body}
							</p>
						</div>
					))}
				</div>
				<div className="mt-14 text-center">
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="inline-flex items-center justify-center h-11 px-7 bg-[color:var(--color-yns-navy)] text-white text-[13px] tracking-[0.16em] rounded-[2px] hover:bg-[color:var(--color-yns-navy-deep)] transition-colors"
					>
						Join the Tea Club
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
