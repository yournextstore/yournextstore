import Image from "next/image";

export function DeskDeclutter() {
	return (
		<section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				{/* Image */}
				<div className="relative aspect-[4/3] overflow-hidden">
					<Image
						src="/scraped-14.png"
						alt="Desk decluttering with pen tray"
						fill
						className="object-cover"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
				</div>

				{/* Text */}
				<div className="max-w-lg">
					<h2 className="font-heading text-3xl sm:text-4xl text-foreground tracking-wide mb-6">
						Desk decluttering
					</h2>
					<p className="text-sm text-muted-foreground leading-relaxed">
						Our desks are where our ideas come to life. The small change of decluttering your desk with our
						organization system will work wonders for peace of mind and productivity. A clean workspace leads
						to clearer thinking.
					</p>
				</div>
			</div>
		</section>
	);
}
