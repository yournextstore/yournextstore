import { YnsLink } from "@/components/yns-link";

const messages = [
	"Join our YNS community for 15% off your first order",
	"Complimentary shipping on orders over $250",
	"New: Capsule 003 — Painterly Silks",
	"Sustainably crafted in natural and organic fibres",
];

export function AnnouncementBar() {
	return (
		<div className="relative w-full bg-[#161412] text-[#f4f1ec]">
			<div className="overflow-hidden">
				<div className="flex items-center h-9 text-[11px] font-eyebrow whitespace-nowrap">
					<div className="flex shrink-0 editorial-marquee">
						{[0, 1].map((dup) => (
							<div key={dup} className="flex shrink-0">
								{messages.map((msg, i) => (
									<span key={`${dup}-${i}`} className="flex items-center px-8">
										{i === 0 ? (
											<>
												{msg.replace(" for 15% off", "")}{" "}
												<YnsLink
													href="/products"
													className="ml-1 underline underline-offset-4 decoration-[#8b8378] hover:decoration-[#f4f1ec]"
												>
													for 15% off your first order
												</YnsLink>
											</>
										) : (
											msg
										)}
										<span className="mx-8 text-[#8b8378]">◦</span>
									</span>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
