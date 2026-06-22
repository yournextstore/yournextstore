import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const FEATURES = [
	{
		title: "Designed to last",
		body: "Heritage joinery, premium textiles, and finishes that age beautifully.",
		bg: "bg-[#f5e8e4]",
		text: "text-[#0f0f0f]",
	},
	{
		title: "Free white-glove delivery",
		body: "We deliver, assemble, and stage every order — anywhere in the continental US.",
		bg: "bg-[#2f62f6]",
		text: "text-white",
	},
	{
		title: "30-day home trial",
		body: "Live with the piece. If it doesn't feel right, we'll pick it up for free.",
		bg: "bg-[#1fb36b]",
		text: "text-white",
	},
];

export function About() {
	return (
		<section id="about" className="mt-4 sm:mt-5 grid lg:grid-cols-12 gap-4 sm:gap-5">
			<div className="lg:col-span-7 relative overflow-hidden rounded-[2rem] bg-white ring-1 ring-black/5">
				<div className="grid sm:grid-cols-2 h-full">
					<div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
						<span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff6b35]">
							Our Story
						</span>
						<div className="mt-6 sm:mt-0">
							<h2 className="font-display uppercase text-3xl sm:text-4xl lg:text-[2.6rem] leading-[0.95] text-[#0f0f0f]">
								Furniture that
								<br /> earns its space
							</h2>
							<p className="mt-4 text-[15px] leading-relaxed text-neutral-600 max-w-md">
								We partner with independent makers and ethical factories to bring you pieces built to last
								generations — without the showroom markup.
							</p>
							<YnsLink
								prefetch={"eager"}
								href="/faq"
								className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0f0f0f] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#ff6b35] transition-colors"
							>
								Learn more
								<ArrowUpRight className="h-4 w-4" />
							</YnsLink>
						</div>
					</div>
					<div className="relative min-h-[260px] sm:min-h-0">
						<Image
							src="/scraped-1.jpg"
							alt="A curated bedroom scene"
							fill
							sizes="(max-width: 1024px) 100vw, 40vw"
							className="object-cover"
						/>
					</div>
				</div>
			</div>

			<div className="lg:col-span-5 grid grid-cols-1 gap-4 sm:gap-5">
				{FEATURES.map((feature) => (
					<div
						key={feature.title}
						className={`relative overflow-hidden rounded-[1.75rem] ${feature.bg} ${feature.text} p-5 sm:p-6 ring-1 ring-black/5`}
					>
						<div className="flex items-start justify-between gap-4">
							<div>
								<h3 className="font-display text-xl sm:text-2xl leading-tight">{feature.title}</h3>
								<p
									className={`mt-2 text-sm ${feature.text === "text-white" ? "text-white/80" : "text-neutral-600"}`}
								>
									{feature.body}
								</p>
							</div>
							<span
								className={`shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full ${feature.text === "text-white" ? "bg-white/15 text-white" : "bg-[#0f0f0f] text-white"}`}
							>
								<ArrowUpRight className="h-4 w-4" />
							</span>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
