import { ArrowRightIcon } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

export async function Drops() {
	"use cache";

	const { data: products } = await commerce.productBrowse({ active: true, limit: 4 });

	return (
		<section className="border-b-2 border-foreground bg-background">
			<div className="grid lg:grid-cols-2">
				{/* Left: lime editorial panel */}
				<div className="yns-bg-lime border-foreground border-b-2 lg:border-b-0 lg:border-r-2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[420px]">
					<div className="text-[10px] font-bold tracking-[0.25em] uppercase">Manifesto</div>
					<div>
						<h2 className="font-display uppercase text-3xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.92] text-foreground">
							Stay tuned to our new drops <span className="italic">and updates</span>
						</h2>
						<p className="mt-6 max-w-md text-sm sm:text-base text-foreground/85 leading-relaxed">
							Consumers no longer follow a unified standard of what is considered fashionable or beautiful. We
							believe the clothes we wear reflect our personalities — and we want to empower everyone to
							explore and express their individuality.
						</p>
						<div className="mt-8 flex flex-wrap items-center gap-4">
							<YnsLink prefetch={"eager"} href="/products" className="yns-btn-brutal">
								Get In Touch
								<ArrowRightIcon className="h-4 w-4" />
							</YnsLink>
							<div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/80">
								<span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block" />
								180+ Brand Drops This Year
							</div>
						</div>
					</div>
					<svg
						viewBox="0 0 24 24"
						aria-hidden="true"
						className="absolute bottom-6 right-8 w-10 h-10 text-foreground"
					>
						<title>Sparkle</title>
						<path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" fill="currentColor" />
					</svg>
				</div>

				{/* Right: product tile grid */}
				<div className="grid grid-cols-2 grid-rows-2">
					{products.slice(0, 4).map((product, idx) => (
						<div
							key={product.id}
							className={`border-foreground p-5 sm:p-6 bg-background ${
								idx % 2 === 0 ? "border-r-2" : ""
							} ${idx < 2 ? "border-b-2" : ""}`}
						>
							<div className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3 text-foreground/60 flex items-center justify-between">
								<span>YNS · {String(idx + 1).padStart(2, "0")}</span>
								<span className="h-1.5 w-1.5 rounded-full bg-foreground" />
							</div>
							<ProductCard product={product} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
