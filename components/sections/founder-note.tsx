import Image from "next/image";

export function FounderNote() {
	return (
		<section className="bg-cream-grain">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div className="relative aspect-[4/5] overflow-hidden bg-[#e8dcc8] rounded-sm">
						<Image
							src="/scraped-4.jpg"
							alt="A still life of botanicals on the founder's desk"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
					</div>
					<div>
						<p className="text-[11px] tracking-luxe uppercase text-[#8b6b4a] mb-6">A Note From the Maker</p>
						<blockquote className="font-serif text-2xl sm:text-3xl text-foreground leading-[1.35] italic">
							“The first candle I poured was for my grandmother’s kitchen — beeswax, fig leaf, the windows
							thrown open in late September. Everything we make is still trying to find that light again.”
						</blockquote>
						<div className="mt-10 flex items-end gap-6">
							{/* Handwritten signature */}
							<svg
								aria-hidden="true"
								viewBox="0 0 240 90"
								className="h-16 w-auto text-[#3d2e22]"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M8 60 C 18 30, 36 28, 40 56 C 42 70, 50 64, 56 50 C 62 36, 70 28, 76 44 C 80 56, 88 56, 92 42" />
								<path d="M104 38 C 110 50, 122 50, 128 38 M 134 32 L 136 60 M 144 38 C 150 32, 160 36, 158 50 C 156 60, 144 60, 144 52" />
								<path d="M174 40 C 180 30, 192 32, 196 46 C 198 56, 188 60, 180 56" />
								<path d="M210 44 C 216 36, 226 38, 226 50 C 226 58, 218 60, 214 56" />
							</svg>
							<div>
								<p className="font-serif text-base text-foreground">Élise Marchand</p>
								<p className="text-[10px] tracking-luxe uppercase text-muted-foreground mt-1">
									Founder & Perfumer
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
