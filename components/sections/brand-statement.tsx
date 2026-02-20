export function BrandStatement({ text }: { text: string }) {
	return (
		<section className="py-16 sm:py-24 bg-secondary">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<p className="text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed uppercase tracking-wide text-foreground">
					{text}
				</p>
			</div>
		</section>
	);
}
