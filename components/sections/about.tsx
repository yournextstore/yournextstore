export function About() {
	return (
		<section id="about" className="relative bg-[#f2ebdd]">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
				<p className="text-[10px] tracking-[0.45em] uppercase text-foreground/55 mb-6 font-light">
					Chapter One — The Philosophy
				</p>
				<h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-[-0.01em] text-foreground max-w-3xl mx-auto">
					Small objects, made
					<span className="italic font-light"> with intention</span> &mdash; for the rooms you actually live
					in.
				</h2>
				<p className="mt-10 max-w-xl mx-auto text-[15px] leading-[1.8] text-foreground/65">
					Your Next Store began as a quiet rebellion against the disposable. Every piece in our collection is
					sourced from independent makers who measure twice and finish slowly &mdash; the kind of work that
					rewards a second look.
				</p>
				<div className="mt-12 inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-foreground/60">
					<span className="h-px w-8 bg-foreground/30" />
					Built to outlast trend
					<span className="h-px w-8 bg-foreground/30" />
				</div>
			</div>
		</section>
	);
}
