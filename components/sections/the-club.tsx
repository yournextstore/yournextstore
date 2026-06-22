import Image from "next/image";
import { ClubSubscribeForm } from "./the-club-form";

export function TheClub() {
	return (
		<section id="club" className="bg-bone text-ink">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div className="relative">
						<div className="relative aspect-[5/6] bg-clay overflow-hidden">
							<Image
								src="/scraped-3.jpg"
								alt="The Club kit"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
							<div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-bone text-ink px-3 py-1.5 text-[10px] tracking-[0.3em] uppercase font-semibold">
								<span className="block w-1.5 h-1.5 bg-brick rounded-full" /> Members only
							</div>
							<div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-[10px] tracking-[0.3em] uppercase text-bone">
								<span className="bg-ink/85 px-2.5 py-1">$18 / month</span>
								<span className="bg-ink/85 px-2.5 py-1">Pause anytime</span>
							</div>
						</div>
					</div>

					<div>
						<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-ink/60">
							<span className="block h-px w-8 bg-brick" />
							No. 04 — The Club
						</span>
						<h2 className="font-display-wide text-[clamp(2.2rem,5.5vw,4.4rem)] leading-[0.92] uppercase mt-4 text-balance">
							The grocery
							<br />
							club.
						</h2>
						<p className="mt-5 max-w-md text-base text-ink/75 leading-relaxed">
							A small box every month: a seasonal goods drop, an essay, and an invite to a member-only sample
							sale. Cancel anytime — but you won&apos;t.
						</p>

						<ul className="mt-7 grid gap-3 text-[13px] text-ink/85">
							<li className="flex items-baseline gap-3">
								<span className="font-display-wide text-[10px] tracking-[0.3em] uppercase text-brick">
									01
								</span>
								Monthly drop, hand-picked.
							</li>
							<li className="flex items-baseline gap-3">
								<span className="font-display-wide text-[10px] tracking-[0.3em] uppercase text-brick">
									02
								</span>
								Free shipping, every order, forever.
							</li>
							<li className="flex items-baseline gap-3">
								<span className="font-display-wide text-[10px] tracking-[0.3em] uppercase text-brick">
									03
								</span>
								Early access to the seasonal edit.
							</li>
							<li className="flex items-baseline gap-3">
								<span className="font-display-wide text-[10px] tracking-[0.3em] uppercase text-brick">
									04
								</span>
								A field-notes zine, four times a year.
							</li>
						</ul>

						<ClubSubscribeForm />
					</div>
				</div>
			</div>
		</section>
	);
}
