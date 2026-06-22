import { PhoneIcon } from "lucide-react";

export function TopUtilityBar() {
	return (
		<div className="hidden md:block bg-brand text-brand-foreground/90 text-xs">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-9 items-center justify-between">
					<a
						href="tel:+13664646242"
						className="inline-flex items-center gap-2 hover:text-brand-foreground transition-colors"
					>
						<PhoneIcon className="h-3.5 w-3.5" />
						<span className="font-medium tracking-wide">+1 (366) 464-6242</span>
					</a>
					<p className="hidden lg:block tracking-[0.18em] uppercase text-brand-foreground/70">
						Free worldwide shipping on orders over $99
					</p>
					<div className="flex items-center gap-1">
						<span className="hidden lg:inline text-brand-foreground/60 mr-2">Send to</span>
						<a
							href="mailto:hello@yournextstore.com"
							className="mr-3 hover:text-brand-foreground transition-colors"
						>
							hello@yournextstore.com
						</a>
						<div className="flex items-center gap-1">
							{[
								{
									label: "Instagram",
									path: "M12 2.16c3.2 0 3.58.012 4.85.07 1.17.054 1.8.25 2.23.415.56.218.96.478 1.38.9.42.42.682.82.9 1.38.164.43.36 1.06.414 2.23.058 1.27.07 1.65.07 4.85s-.012 3.58-.07 4.85c-.054 1.17-.25 1.8-.414 2.23-.218.56-.48.96-.9 1.38-.42.42-.82.682-1.38.9-.43.164-1.06.36-2.23.414-1.27.058-1.65.07-4.85.07s-3.58-.012-4.85-.07c-1.17-.054-1.8-.25-2.23-.414a3.72 3.72 0 01-1.38-.9 3.72 3.72 0 01-.9-1.38c-.164-.43-.36-1.06-.414-2.23C2.172 15.58 2.16 15.2 2.16 12s.012-3.58.07-4.85c.054-1.17.25-1.8.414-2.23.218-.56.48-.96.9-1.38.42-.42.82-.682 1.38-.9.43-.164 1.06-.36 2.23-.414C8.42 2.172 8.8 2.16 12 2.16zm0 2.16c-3.14 0-3.5.012-4.74.07-.97.044-1.5.21-1.85.346-.46.18-.79.39-1.13.74-.35.34-.56.67-.74 1.13-.137.35-.302.88-.346 1.85C4.172 9.5 4.16 9.86 4.16 13s.012 3.5.07 4.74c.044.97.21 1.5.346 1.85.18.46.39.79.74 1.13.34.35.67.56 1.13.74.35.137.88.302 1.85.346 1.24.058 1.6.07 4.74.07s3.5-.012 4.74-.07c.97-.044 1.5-.21 1.85-.346.46-.18.79-.39 1.13-.74.35-.34.56-.67.74-1.13.137-.35.302-.88.346-1.85.058-1.24.07-1.6.07-4.74s-.012-3.5-.07-4.74c-.044-.97-.21-1.5-.346-1.85a3.05 3.05 0 00-.74-1.13 3.05 3.05 0 00-1.13-.74c-.35-.137-.88-.302-1.85-.346-1.24-.058-1.6-.07-4.74-.07zM12 7.7a4.3 4.3 0 110 8.6 4.3 4.3 0 010-8.6zm0 7.09a2.79 2.79 0 100-5.58 2.79 2.79 0 000 5.58zm5.47-7.27a1 1 0 11-2 0 1 1 0 012 0z",
								},
								{
									label: "Twitter",
									path: "M22 5.92c-.74.33-1.54.55-2.36.65a4.13 4.13 0 001.82-2.27 8.36 8.36 0 01-2.6 1 4.1 4.1 0 00-7.07 3.74A11.65 11.65 0 013 4.92a4.07 4.07 0 001.27 5.47 4.1 4.1 0 01-1.86-.51v.05a4.1 4.1 0 003.29 4.02 4.1 4.1 0 01-1.85.07 4.11 4.11 0 003.83 2.85A8.23 8.23 0 012 18.55 11.6 11.6 0 008.29 20.4c7.55 0 11.67-6.25 11.67-11.67l-.01-.53A8.32 8.32 0 0022 5.92z",
								},
								{
									label: "Facebook",
									path: "M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0022 12z",
								},
							].map((s) => (
								<a
									key={s.label}
									href="#"
									aria-label={s.label}
									className="flex h-7 w-7 items-center justify-center rounded-full text-brand-foreground/70 hover:bg-brand-foreground/10 hover:text-brand-foreground transition-colors"
								>
									<span className="sr-only">{s.label}</span>
									<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
										<path d={s.path} />
									</svg>
								</a>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
