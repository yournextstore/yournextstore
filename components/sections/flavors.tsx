import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const FALLBACKS = [
	{ tone: "bg-cherry", label: "Cherry on top", swatch: "/scraped-1.jpg" },
	{ tone: "bg-sky", label: "Sky high", swatch: "/scraped-2.jpg" },
	{ tone: "bg-mustard", label: "Sun-baked", swatch: "/scraped-3.jpg" },
];

export async function Flavors() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 3 });
	const items = collections.data.slice(0, 3);

	return (
		<section className="relative bg-cream py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-12 flex flex-col items-center text-center">
					<span className="inline-block rounded-full bg-ink text-cream px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
						Three ways to love it
					</span>
					<h2 className="yns-display mt-5 text-ink" style={{ fontSize: "clamp(2.75rem, 7vw, 5.5rem)" }}>
						Pick your <span className="text-cherry">flavor</span>
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
					{[0, 1, 2].map((i) => {
						const fb = FALLBACKS[i];
						const collection = items[i];
						const href = collection ? `/collection/${collection.slug}` : "/products";
						const label = collection?.name ?? fb.label;

						return (
							<YnsLink key={href + i.toString()} prefetch={"eager"} href={href} className="group block">
								<div
									className={`relative aspect-square rounded-full overflow-hidden ${fb.tone} flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-3`}
								>
									<div className="absolute inset-6 rounded-full overflow-hidden ring-[8px] ring-cream/95 shadow-xl">
										<Image
											src={fb.swatch}
											alt=""
											fill
											sizes="(max-width: 768px) 80vw, 30vw"
											className="object-cover"
										/>
									</div>
									<div className="pointer-events-none absolute inset-0 yns-spin-slow">
										<svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
											<title>orbit label</title>
											<defs>
												<path
													id={`circlePath-${i.toString()}`}
													d="M 100,100 m -88,0 a 88,88 0 1,1 176,0 a 88,88 0 1,1 -176,0"
												/>
											</defs>
											<text
												fontSize="11"
												fontWeight="700"
												letterSpacing="3"
												fill="currentColor"
												className={i === 1 ? "text-ink" : "text-cream"}
											>
												<textPath href={`#circlePath-${i.toString()}`}>
													DIPPABLE • SPREADABLE • INFINITELY ENJOYABLE •
												</textPath>
											</text>
										</svg>
									</div>
								</div>
								<div className="mt-6 text-center">
									<h3 className="yns-display text-ink" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
										{label}
									</h3>
									<p className="mt-2 text-sm font-medium text-ink/70 uppercase tracking-widest">
										Shop now &nbsp;→
									</p>
								</div>
							</YnsLink>
						);
					})}
				</div>
			</div>
		</section>
	);
}
