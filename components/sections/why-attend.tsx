import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function LineupSection() {
	return (
		<div className="col-span-1 md:col-span-4 border-r border-foreground/10 flex flex-col">
			<div className="p-8 md:p-12 border-b border-foreground/10">
				<h2 className="text-6xl font-bold text-primary mb-2">15.10</h2>
				<h3 className="text-3xl font-bold uppercase flex items-center flex-wrap gap-4">
					Lineup
					<span className="text-xs font-mono border border-current px-2 py-1">PHASE 1</span>
				</h3>
				<div className="mt-2 flex space-x-1">
					<div className="w-8 h-1 bg-current transform -skew-x-12" />
					<div className="w-8 h-1 bg-current transform -skew-x-12 opacity-50" />
					<div className="w-8 h-1 bg-current transform -skew-x-12 opacity-25" />
				</div>
			</div>
			<div className="p-8 md:p-12 flex-grow flex flex-col justify-between">
				<div>
					<p className="font-mono text-sm opacity-70 mb-8">
						We are leaving it up to you. Choose your path through 4 distinct tracks covering AI, Web3, Design
						Systems, and Sustainable Tech.
					</p>
				</div>
				<Link
					href="#schedule"
					className="flex items-center space-x-4 cursor-pointer hover:text-primary transition-colors group"
				>
					<span className="font-bold uppercase tracking-widest text-sm">See Full Schedule</span>
					<ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
				</Link>
			</div>
		</div>
	);
}
