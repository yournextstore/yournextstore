import { Check, X } from "lucide-react";

const features = [
	{ label: "Certified B Corp", us: true, others: false },
	{ label: "Locally sourced ingredients", us: true, others: false },
	{ label: "Out of control flavours", us: true, others: false },
	{ label: "Will make you a better chef", us: true, others: false },
];

export function ComparisonTable() {
	return (
		<section className="py-16 sm:py-24 bg-secondary">
			<div className="max-w-[1820px] mx-auto px-5 sm:px-8 lg:px-10">
				<h2 className="font-[family-name:var(--font-prompt)] text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground text-center mb-12">
					How we stack up
				</h2>

				<div className="max-w-2xl mx-auto bg-background rounded-md border-[3px] border-foreground shadow-[8px_8px_0_0_#000] overflow-hidden">
					{/* Header */}
					<div className="grid grid-cols-3 border-b-[3px] border-foreground">
						<div className="p-4"></div>
						<div className="p-4 text-center border-x-[3px] border-foreground bg-[#5aff24]">
							<span className="font-[family-name:var(--font-prompt)] text-sm font-black uppercase">YNS</span>
						</div>
						<div className="p-4 text-center">
							<span className="text-sm font-bold text-muted-foreground">Others</span>
						</div>
					</div>

					{/* Rows */}
					{features.map((feature, index) => (
						<div
							key={feature.label}
							className={`grid grid-cols-3 ${index < features.length - 1 ? "border-b-[3px] border-foreground" : ""}`}
						>
							<div className="p-4 flex items-center">
								<span className="text-sm font-bold">{feature.label}</span>
							</div>
							<div className="p-4 flex items-center justify-center border-x-[3px] border-foreground">
								{feature.us ? (
									<Check className="h-5 w-5 text-[#5aff24]" strokeWidth={3} />
								) : (
									<X className="h-5 w-5 text-[#ff2524]" strokeWidth={3} />
								)}
							</div>
							<div className="p-4 flex items-center justify-center">
								{feature.others ? (
									<Check className="h-5 w-5 text-[#5aff24]" strokeWidth={3} />
								) : (
									<X className="h-5 w-5 text-[#ff2524]" strokeWidth={3} />
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
