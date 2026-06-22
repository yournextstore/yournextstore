import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { previewHref } from "@/lib/demo-products";
import { YnsLink } from "../yns-link";

const CREATOR_PORTRAITS: Array<{ src: string; alt: string }> = [
	{ src: "/scraped-1.jpg", alt: "Independent creator on YNS" },
	{ src: "/scraped-2.jpg", alt: "Independent creator on YNS" },
	{ src: "/scraped-3.jpg", alt: "Independent creator on YNS" },
];

export function About({ preview = false }: { preview?: boolean }) {
	return (
		<section id="about" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="relative overflow-hidden rounded-[2.5rem] bg-lumen-soft ring-1 ring-[var(--violet)]/15">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-8 sm:p-12 lg:p-16">
						<div className="lg:col-span-5">
							<span className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-[var(--violet-deep)] ring-1 ring-[var(--violet)]/20">
								Studio
							</span>
							<h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
								Creativity &amp;{" "}
								<em className="not-italic font-serif italic text-[var(--violet-deep)]">complete</em>
							</h2>
							<p className="mt-5 max-w-md text-base sm:text-lg text-foreground/70 leading-relaxed">
								Built around the workflow of independent makers — illustrators, writers, musicians, and
								educators. Everything you need to build a brand, sell a drop, and keep the spark.
							</p>
							<ul className="mt-7 space-y-3 text-sm text-foreground/75">
								{[
									"Fast checkout — Apple Pay, cards, multi-currency",
									"Built-in newsletter & customer chat",
									"Royalty-friendly digital downloads",
								].map((feature) => (
									<li key={feature} className="flex items-start gap-2.5">
										<span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--violet)]" />
										<span>{feature}</span>
									</li>
								))}
							</ul>
							<YnsLink
								prefetch={"eager"}
								href={previewHref("/products", preview)}
								className="mt-9 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background hover:bg-[var(--violet-deep)] transition-colors"
							>
								Browse the kit
								<ArrowUpRightIcon className="h-3.5 w-3.5" />
							</YnsLink>
						</div>

						{/* Three overlapping circular portraits */}
						<div className="lg:col-span-7 relative min-h-[320px] lg:min-h-[420px]">
							<div className="relative h-full w-full">
								{CREATOR_PORTRAITS.map((portrait, idx) => {
									const positions = [
										"top-0 left-0 lg:left-4 -rotate-3",
										"top-10 sm:top-16 left-1/3 lg:left-[36%] rotate-3 z-10",
										"top-24 sm:top-28 right-0 lg:right-4 -rotate-2",
									];
									const sizes = [
										"h-44 w-44 sm:h-56 sm:w-56 lg:h-64 lg:w-64",
										"h-48 w-48 sm:h-60 sm:w-60 lg:h-72 lg:w-72",
										"h-44 w-44 sm:h-52 sm:w-52 lg:h-60 lg:w-60",
									];
									return (
										<div
											key={portrait.src}
											className={`absolute ${positions[idx]} ${sizes[idx]} rounded-full overflow-hidden ring-[6px] ring-background shadow-xl shadow-[var(--violet-deep)]/15`}
										>
											<Image
												src={portrait.src}
												alt={portrait.alt}
												fill
												sizes="(max-width: 1024px) 50vw, 25vw"
												className="object-cover"
											/>
										</div>
									);
								})}
								{/* Decorative star */}
								<svg
									aria-hidden="true"
									viewBox="0 0 24 24"
									className="absolute top-4 right-6 lg:right-12 h-8 w-8 text-[var(--butter)]"
									fill="currentColor"
								>
									<title>sparkle</title>
									<path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
