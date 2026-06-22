import Image from "next/image";

export function About() {
	return (
		<>
			{/* Gossip editorial row */}
			<section id="about" className="bg-[var(--background)]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
					<div className="text-center mb-12">
						<p className="font-display uppercase tracking-[0.3em] text-[var(--pink)] text-xs">
							The Gossip Column
						</p>
						<h2 className="font-display uppercase text-[var(--burgundy)] mt-3 text-[clamp(2rem,4vw,3.25rem)] leading-[1]">
							Hot takes & house favourites
						</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[
							{
								img: "/scraped-1.jpg",
								tag: "Editor's Pick",
								title: "“Like a love letter, but you can eat it.”",
								body: "Our taste-tester’s notebook spilled — three picks worth flirting with this season.",
							},
							{
								img: "/scraped-2.jpg",
								tag: "House Story",
								title: "“We hand-pack every box like it’s couture.”",
								body: "The behind-the-scenes look at how each order leaves our studio dressed to the nines.",
							},
							{
								img: "/scraped-3.jpg",
								tag: "Hot Goss",
								title: "“They saw it on the kitchen counter and stayed for dinner.”",
								body: "Why the boldest finds make the boldest dinner parties — and the loudest group chats.",
							},
						].map((c, i) => (
							<article
								key={c.title}
								className="group relative overflow-hidden rounded-3xl bg-white border border-[var(--pink)]/10 yns-shadow-pop"
							>
								<div className="relative aspect-[4/5] overflow-hidden">
									<Image
										src={c.img}
										alt=""
										fill
										sizes="(max-width: 768px) 100vw, 33vw"
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									<div
										className="absolute top-4 left-4 font-display uppercase tracking-widest text-[10px] px-3 py-1 rounded-full"
										style={{
											background: i === 0 ? "var(--yellow)" : i === 1 ? "var(--sky)" : "var(--tangerine)",
											color: "var(--burgundy)",
										}}
									>
										{c.tag}
									</div>
								</div>
								<div className="p-5 sm:p-6">
									<h3 className="font-display uppercase text-[var(--burgundy)] text-lg leading-tight">
										{c.title}
									</h3>
									<p className="mt-3 text-sm text-[var(--burgundy)]/70 leading-relaxed">{c.body}</p>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			{/* Values strip on cream */}
			<section className="bg-[var(--cream)]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
						{[
							{ icon: "🌿", title: "Sustainably Sourced", body: "Small partners, big standards." },
							{ icon: "💋", title: "Hand-Packed", body: "Lovingly assembled, just for you." },
							{ icon: "✨", title: "Small-Batch", body: "Made in tiny, brag-worthy runs." },
						].map((v) => (
							<div key={v.title} className="flex flex-col items-center">
								<div className="w-16 h-16 rounded-full bg-[var(--pink)] flex items-center justify-center text-3xl yns-shadow-pop">
									<span>{v.icon}</span>
								</div>
								<h3 className="mt-4 font-display uppercase text-[var(--burgundy)] text-sm tracking-widest">
									{v.title}
								</h3>
								<p className="mt-2 text-sm text-[var(--burgundy)]/70 max-w-[22ch]">{v.body}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Press strip on burgundy */}
			<section className="bg-[var(--burgundy)] py-8 overflow-hidden">
				<div className="yns-marquee">
					<div className="yns-marquee__track whitespace-nowrap font-display uppercase tracking-[0.4em] text-[var(--cream)]/80 text-sm sm:text-base">
						{[
							"AS SEEN IN BON APPÉTIT",
							"VOGUE",
							"NYT",
							"MONOCLE",
							"GQ",
							"KINFOLK",
							"WALLPAPER*",
							"DAZED",
						].map((p) => (
							<span key={`p-${p}`} className="flex items-center gap-10">
								<span>✦</span>
								<span>{p}</span>
							</span>
						))}
					</div>
					<div
						className="yns-marquee__track whitespace-nowrap font-display uppercase tracking-[0.4em] text-[var(--cream)]/80 text-sm sm:text-base"
						aria-hidden="true"
					>
						{[
							"AS SEEN IN BON APPÉTIT",
							"VOGUE",
							"NYT",
							"MONOCLE",
							"GQ",
							"KINFOLK",
							"WALLPAPER*",
							"DAZED",
						].map((p) => (
							<span key={`p2-${p}`} className="flex items-center gap-10">
								<span>✦</span>
								<span>{p}</span>
							</span>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
