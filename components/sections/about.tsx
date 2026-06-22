import { Award, Compass, Sparkles } from "lucide-react";
import Image from "next/image";

const pillars = [
	{
		icon: Compass,
		title: "Curated by design",
		body: "Every piece is selected with a designer's eye and a buyer's instinct.",
	},
	{
		icon: Award,
		title: "Made to last",
		body: "Premium fabrics, considered construction, and timeless silhouettes.",
	},
	{
		icon: Sparkles,
		title: "Modern essentials",
		body: "A wardrobe of staples that quietly elevates how you show up.",
	},
];

export function About() {
	return (
		<section id="about" className="relative overflow-hidden">
			<div className="absolute inset-0 bg-sunset-soft opacity-70" />
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					<div className="lg:col-span-5">
						<p className="text-xs font-medium uppercase tracking-[0.2em] text-[--ember]">Our Story</p>
						<h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[--ink]">
							Quiet quality for <span className="italic text-[--ember]">a louder world</span>
						</h2>
						<p className="mt-5 text-[--ink]/70 text-lg leading-relaxed">
							Your Next Store is a small studio with a long memory. We work directly with mills and makers who
							treat fabric like a craft — then ship it to you the way it should arrive.
						</p>
						<p className="mt-4 text-[--ink]/70 leading-relaxed">
							No fast fashion. No filler. Just a tightly edited wardrobe of pieces we'd wear every day, made
							by people who deserve their names on the label.
						</p>
					</div>
					<div className="relative lg:col-span-7">
						<div className="relative aspect-[5/4] sm:aspect-[5/3] rounded-3xl overflow-hidden ring-1 ring-black/5">
							<Image
								src="/scraped-5.jpg"
								alt="Studio behind Your Next Store"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-tr from-[--ink]/30 via-transparent to-[--sun]/20" />
						</div>
						<div className="absolute -bottom-6 -left-3 sm:-left-6 max-w-xs rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.35)]">
							<p className="font-display text-2xl font-semibold text-[--ink]">12+ years</p>
							<p className="mt-1 text-sm text-[--ink]/60">
								of partnering with independent ateliers across Europe and Japan.
							</p>
						</div>
					</div>
				</div>

				<div className="mt-20 grid sm:grid-cols-3 gap-6">
					{pillars.map((p) => (
						<div key={p.title} className="rounded-2xl bg-white/85 backdrop-blur p-6 ring-1 ring-black/5">
							<span className="inline-grid place-items-center h-10 w-10 rounded-full bg-[--ember]/10 text-[--ember]">
								<p.icon className="h-5 w-5" />
							</span>
							<h3 className="mt-4 font-display text-lg font-semibold text-[--ink]">{p.title}</h3>
							<p className="mt-1.5 text-sm text-[--ink]/65 leading-relaxed">{p.body}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
