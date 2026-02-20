import { Mail, Percent, Phone, Truck } from "lucide-react";

export function AnnouncementBar() {
	return (
		<div className="bg-foreground text-primary-foreground">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-9 text-xs sm:text-sm overflow-x-auto gap-4">
					<div className="flex items-center gap-1.5 shrink-0">
						<Percent className="h-3.5 w-3.5" />
						<span className="hidden sm:inline">Check out our</span>
						<span className="font-semibold">5% discount</span>
					</div>
					<div className="flex items-center gap-1.5 shrink-0">
						<Truck className="h-3.5 w-3.5" />
						<span>
							Free shipping from <span className="font-semibold">$200</span>
						</span>
					</div>
					<div className="hidden md:flex items-center gap-1.5 shrink-0">
						<Phone className="h-3.5 w-3.5" />
						<span>(555) 123-4567</span>
					</div>
					<div className="hidden lg:flex items-center gap-1.5 shrink-0">
						<Mail className="h-3.5 w-3.5" />
						<span>shop@yournextstore.com</span>
					</div>
				</div>
			</div>
		</div>
	);
}
