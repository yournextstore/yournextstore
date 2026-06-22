export function About() {
	return (
		<section id="about" className="relative overflow-hidden border-t border-foreground/10 bg-ink">
			<div className="mx-auto max-w-3xl px-5 py-24 text-center sm:py-32 lg:px-12">
				<p className="text-[10px] tracking-microcaps text-foreground/55">A Note on Method</p>
				<p className="mt-8 font-serif-display text-3xl leading-[1.2] text-foreground sm:text-4xl lg:text-5xl">
					&ldquo;Perfume is not for being liked. It is for being remembered — long after the room has emptied,
					long after the wearer has gone.&rdquo;
				</p>
				<div className="mt-10 flex items-center justify-center gap-3 text-[10px] tracking-microcaps text-foreground/55">
					<span className="h-px w-10 bg-foreground/20" />
					<span>The Perfumer · Atelier No. 19</span>
					<span className="h-px w-10 bg-foreground/20" />
				</div>
			</div>
		</section>
	);
}
