import { ArrowRightIcon, FileTextIcon, PillIcon, ShieldCheckIcon, TruckIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6 lg:pt-6">
			<div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] bg-mint-gradient ring-1 ring-[color:var(--mint-deep)]/8 sm:rounded-[36px]">
				{/* Soft decorative blobs */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/30 blur-3xl"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-[color:var(--mint-deep)]/10 blur-3xl"
				/>

				<div className="relative grid gap-6 px-5 py-10 sm:px-10 sm:py-14 lg:grid-cols-12 lg:gap-8 lg:px-14 lg:py-16">
					{/* Left: oversized wordmark + copy */}
					<div className="lg:col-span-7 lg:pr-6">
						<span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--mint-deep)] ring-1 ring-[color:var(--mint-deep)]/10 backdrop-blur">
							<span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--mint-deep)]" />
							Licensed online pharmacy
						</span>
						<h1 className="mt-5 font-display text-[18vw] font-extrabold leading-[0.85] tracking-tight text-[color:var(--mint-deep)] sm:text-[14vw] lg:text-[10.5rem] xl:text-[12rem]">
							Pharmacy
						</h1>
						<p className="mt-6 max-w-md text-[13px] uppercase tracking-[0.18em] text-[color:var(--mint-deep)]/70">
							Online medicine delivery
						</p>
						<p className="mt-2 max-w-md text-base leading-relaxed text-[color:var(--mint-deep)]/80 sm:text-lg">
							Skip the queue. Order genuine medicines, vitamins, and wellness essentials — delivered to your
							doorstep, often the same day.
						</p>
						<div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
							<div className="flex items-center gap-2.5">
								<span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 ring-1 ring-[color:var(--mint-deep)]/10">
									<TruckIcon className="h-4 w-4 text-[color:var(--mint-deep)]" />
								</span>
								<div className="leading-tight">
									<div className="text-[11px] uppercase tracking-wide text-[color:var(--mint-deep)]/60">
										Delivery by
									</div>
									<div className="text-sm font-semibold text-[color:var(--mint-deep)]">Next doorstep</div>
								</div>
							</div>
							<div className="flex items-center gap-2.5">
								<span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 ring-1 ring-[color:var(--mint-deep)]/10">
									<ShieldCheckIcon className="h-4 w-4 text-[color:var(--mint-deep)]" />
								</span>
								<div className="leading-tight">
									<div className="text-[11px] uppercase tracking-wide text-[color:var(--mint-deep)]/60">
										100% Genuine
									</div>
									<div className="text-sm font-semibold text-[color:var(--mint-deep)]">Medicines</div>
								</div>
							</div>
							<div className="flex items-center gap-2.5">
								<span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 ring-1 ring-[color:var(--mint-deep)]/10">
									<PillIcon className="h-4 w-4 text-[color:var(--mint-deep)]" />
								</span>
								<div className="leading-tight">
									<div className="text-[11px] uppercase tracking-wide text-[color:var(--mint-deep)]/60">
										10,000+ products
									</div>
									<div className="text-sm font-semibold text-[color:var(--mint-deep)]">In stock</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right: pharmacist portrait + upload prescription card */}
					<div className="relative lg:col-span-5">
						<div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl">
							<Image
								src="/scraped-0.jpg"
								alt="Friendly pharmacist holding a medicine box"
								fill
								priority
								sizes="(max-width: 1024px) 90vw, 480px"
								className="object-cover"
							/>
							<div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[color:var(--mint)]/40 to-transparent" />
						</div>

						{/* Upload prescription floating card */}
						<div className="absolute -bottom-4 right-2 w-[min(280px,90%)] rounded-2xl bg-white p-4 shadow-[0_20px_60px_-20px_rgba(15,47,26,0.35)] ring-1 ring-[color:var(--mint-deep)]/8 sm:bottom-6 sm:right-6">
							<div className="flex items-start gap-3">
								<span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--mint-soft)]">
									<FileTextIcon className="h-5 w-5 text-[color:var(--mint-deep)]" />
								</span>
								<div className="leading-tight">
									<div className="text-[11px] uppercase tracking-wide text-muted-foreground">
										Have a prescription?
									</div>
									<div className="font-display text-base font-bold text-foreground">Upload prescription</div>
								</div>
							</div>
							<YnsLink
								prefetch="eager"
								href="/products"
								className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[color:var(--mint-deep)] text-sm font-semibold text-[color:var(--mint-soft)] transition-colors hover:bg-[color:var(--mint-deep)]/90"
							>
								Order the prescription
								<ArrowRightIcon className="h-4 w-4" />
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
