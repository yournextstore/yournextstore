import { ArrowRightIcon, CheckCircle2Icon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const BENEFITS = [
	"Provides essential nutrients",
	"High in fiber",
	"Low in fat",
	"Plant-based & vegan friendly",
];

export function Spotlight() {
	return (
		<section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
			<div className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
				Cereal Honey Flavour
			</div>
			<div className="relative grid overflow-hidden rounded-[28px] bg-mint-gradient ring-1 ring-[color:var(--mint-deep)]/8 lg:grid-cols-2">
				<div className="relative z-10 p-8 sm:p-12 lg:p-14">
					<h2 className="font-display text-3xl font-extrabold leading-tight text-[color:var(--mint-deep)] sm:text-4xl lg:text-5xl">
						Cereal Healthy
						<br />
						Food
					</h2>
					<p className="mt-4 max-w-md text-sm leading-relaxed text-[color:var(--mint-deep)]/75 sm:text-base">
						Wholesome cereal with many benefits that make for a healthy and nutritious breakfast choice.
					</p>
					<ul className="mt-6 space-y-2.5">
						{BENEFITS.map((b) => (
							<li key={b} className="flex items-center gap-2.5 text-sm text-[color:var(--mint-deep)]">
								<CheckCircle2Icon className="h-4 w-4 text-[color:var(--mint-deep)]" />
								{b}
							</li>
						))}
					</ul>
					<div className="mt-8 flex flex-wrap items-center gap-4">
						<YnsLink
							href="/products"
							className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--mint-deep)] px-6 text-sm font-semibold text-[color:var(--mint-soft)] transition-colors hover:bg-[color:var(--mint-deep)]/90"
						>
							Buy now from $50.00
							<ArrowRightIcon className="h-4 w-4" />
						</YnsLink>
						<div className="text-sm text-[color:var(--mint-deep)]/70">
							<span className="text-xs uppercase tracking-wide">Includes</span>
							<div className="font-semibold text-[color:var(--mint-deep)]">Free delivery & returns</div>
						</div>
					</div>
				</div>
				<div className="relative min-h-[280px] lg:min-h-[460px]">
					<Image
						src="/scraped-4.jpg"
						alt="Healthy cereal box with whole grains"
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-[color:var(--mint)]/30 via-transparent to-transparent" />
				</div>
			</div>
		</section>
	);
}
