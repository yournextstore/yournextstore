import Image from "next/image";
import { YnsLink } from "../yns-link";

type Muse = {
	name: string;
	role: string;
	image: string;
	href: string;
};

const muses: Muse[] = [
	{
		name: "Inés",
		role: "The Composer",
		image: "/scraped-2.jpg",
		href: "#muses",
	},
	{
		name: "Rumi",
		role: "The Poet",
		image: "/scraped-5.jpg",
		href: "#muses",
	},
	{
		name: "Sade",
		role: "The Ceramicist",
		image: "/scraped-3.jpg",
		href: "#muses",
	},
];

export function Muses() {
	return (
		<section id="muses" className="bg-espresso text-bone">
			<div className="max-w-[1600px] mx-auto px-6 sm:px-10 py-24 sm:py-32">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-6">
					<div>
						<p className="eyebrow text-clay mb-5">Volume Ⅰ — The Muses</p>
						<h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05]">
							Portraits in <span className="italic">warm light.</span>
						</h2>
					</div>
					<p className="text-bone/60 text-sm max-w-sm leading-relaxed">
						Three women in three unhurried hours. A lookbook on intimacy, ritual, and the room before the
						world wakes.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
					{muses.map((muse, idx) => (
						<YnsLink
							prefetch={"eager"}
							key={muse.name}
							href={muse.href}
							className="group relative block aspect-[3/4] overflow-hidden bg-mahogany/40"
						>
							<Image
								src={muse.image}
								alt={`${muse.name}, ${muse.role}`}
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
								className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/10 to-transparent" />
							<div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
								<p className="eyebrow text-bone/70 mb-2">
									№ {String(idx + 1).padStart(2, "0")} · {muse.role}
								</p>
								<h3 className="font-serif text-3xl sm:text-4xl text-bone font-light">{muse.name}</h3>
								<span className="mt-3 inline-block w-10 h-px bg-bone/70 transition-all duration-500 group-hover:w-20" />
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
