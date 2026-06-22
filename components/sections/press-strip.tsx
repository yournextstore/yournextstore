const PRESS = ["VOGUE", "WIRED", "GQ", "FAST CO.", "BON APPÉTIT", "HYPEBEAST", "THRILLIST"];

export function PressStrip() {
	return (
		<section className="bg-[var(--tizz-cream)] border-y-2 border-[var(--tizz-deep)]/15">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
				<p className="tizz-overline text-center text-[var(--tizz-deep)]/60 text-xs mb-6">As featured in</p>
				<div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14">
					{PRESS.map((name) => (
						<span
							key={name}
							className="tizz-display text-[var(--tizz-deep)] text-xl sm:text-2xl opacity-70 hover:opacity-100 transition-opacity"
							style={{ letterSpacing: "0.05em" }}
						>
							{name}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
