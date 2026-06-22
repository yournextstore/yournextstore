import { Camera } from "lucide-react";
import Image from "next/image";

const tiles = ["/scraped-4.jpg", "/scraped-5.jpg", "/scraped-0.jpg", "/scraped-1.jpg"];

export function UGCGrid() {
	return (
		<section className="bg-[#fbf6ec]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="text-center mb-12">
					<p className="text-[11px] tracking-[0.4em] uppercase text-[#e11226] font-semibold flex items-center justify-center gap-2">
						<Camera className="h-3.5 w-3.5" />
						@yournextstore
					</p>
					<h2 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl text-[#0f0f10] tracking-tight">
						Shot by <span className="italic text-[#e11226]">you</span>.
					</h2>
					<p className="mt-3 text-sm text-[#0f0f10]/60 max-w-md mx-auto">
						Tag us for a chance to be featured. Free shipping on every reshare.
					</p>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
					{tiles.map((src, idx) => (
						<a
							key={src}
							href="https://instagram.com"
							className="group relative aspect-square overflow-hidden rounded-sm bg-[#f2b7c1]"
						>
							<Image
								src={src}
								alt={`Community post ${idx + 1}`}
								fill
								sizes="(max-width: 640px) 50vw, 25vw"
								className="object-cover transition-transform duration-700 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-[#0f0f10]/0 group-hover:bg-[#0f0f10]/30 transition-colors flex items-center justify-center">
								<Camera className="h-7 w-7 text-[#fbf6ec] opacity-0 group-hover:opacity-100 transition-opacity" />
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
