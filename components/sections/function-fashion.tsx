import Image from "next/image";
import { YnsLink } from "../yns-link";

export function FunctionFashion() {
	return (
		<section className="relative overflow-hidden bg-foreground text-primary-foreground">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<div className="max-w-lg">
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight mb-6">
							Function & Fashion
						</h2>
						<p className="text-primary-foreground/70 text-lg mb-8 leading-relaxed">
							A celebration of precipitation and the opportunity that lies within a rainy day
						</p>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center text-xs tracking-[0.2em] uppercase font-medium border-b border-primary-foreground/50 pb-1 hover:border-primary-foreground transition-colors"
						>
							LEARN more
						</YnsLink>
					</div>
					<div className="relative aspect-[4/3] rounded-sm overflow-hidden">
						<Image
							src="/scraped-5.png"
							alt="Function and Fashion"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 50vw"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
