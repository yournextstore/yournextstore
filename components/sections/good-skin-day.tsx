import { YnsLink } from "@/components/yns-link";

export function GoodSkinDay() {
	return (
		<section className="relative overflow-hidden bg-brand-mint/30 py-20 sm:py-28">
			<div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
				<h2 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
					Make Everyday a Good Skin Day
				</h2>
				<div className="mt-8">
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="inline-block bg-foreground px-10 py-3 text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground/90"
					>
						Shop Now
					</YnsLink>
				</div>
			</div>
			{/* Decorative SVG background */}
			<div
				className="pointer-events-none absolute inset-0 opacity-10"
				style={{
					backgroundImage: "url(/hero-bg-2.svg)",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>
		</section>
	);
}
