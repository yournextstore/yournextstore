import Image from "next/image";

export function Founder() {
	return (
		<section id="about" className="bg-[#f7e4d4]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
					<div className="relative">
						<div className="relative aspect-square max-w-md mx-auto">
							<div className="absolute inset-0 bg-[#4b1fb5] rounded-[2.5rem] rotate-3" />
							<div className="absolute inset-0 rounded-[2.5rem] overflow-hidden -rotate-1">
								<Image
									src="/scraped-4.jpg"
									alt="Founder portrait"
									fill
									sizes="(max-width:1024px) 80vw, 40vw"
									className="object-cover"
								/>
							</div>
							<span
								aria-hidden="true"
								className="absolute -top-4 -right-4 w-20 h-20 bg-[#f5c518] rounded-full z-10 flex items-center justify-center font-marker text-[#1a0f4d] text-sm rotate-12"
							>
								since 2021
							</span>
						</div>
					</div>

					<div>
						<p className="font-marker text-[#f4884a] text-xl mb-3 -rotate-2">our story</p>
						<h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#1a0f4d] leading-tight">
							Built by people who were{" "}
							<span className="font-marker text-[#4b1fb5] inline-block -rotate-2">tired</span> of pill
							bottles.
						</h2>
						<div className="mt-6 space-y-4 text-[#1a0f4d]/80 text-base leading-relaxed">
							<p>
								We started Your Next Store because the wellness aisle felt like a chore. Plastic horse-pill
								bottles, fishy capsules, sugar-bomb gummies disguised as health.
							</p>
							<p>
								So we built melt-in-mouth strips with clinically-dosed actives, real fruit flavors, and
								pocket-size packs you actually want to use. No water. No swallowing. No nonsense.
							</p>
						</div>
						<div className="mt-8 grid grid-cols-3 gap-4 max-w-sm">
							{[
								{ stat: "60s", label: "to absorb" },
								{ stat: "0g", label: "added sugar" },
								{ stat: "100%", label: "third-party tested" },
							].map((s) => (
								<div key={s.label}>
									<p className="font-marker text-3xl text-[#4b1fb5] -rotate-2 leading-none">{s.stat}</p>
									<p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#1a0f4d]/60">
										{s.label}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
