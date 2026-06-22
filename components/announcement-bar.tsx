import { Leaf } from "lucide-react";

const messages = [
	"Subscribe & Get Free Shipping on Every Order",
	"New botanical arrivals — crafted small batch",
	"Rooted in nature, refined for everyday wellness",
];

export function AnnouncementBar() {
	return (
		<div className="bg-peach text-cocoa relative overflow-hidden border-b border-cocoa/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-center gap-3 h-9 text-[13px] tracking-wide font-medium">
					<Leaf className="h-3.5 w-3.5 hidden sm:inline-block text-cocoa/70" aria-hidden="true" />
					<span className="hidden sm:inline-flex items-center gap-6">
						{messages.map((message, i) => (
							<span key={message} className="flex items-center gap-6">
								{message}
								{i < messages.length - 1 && (
									<span className="h-1 w-1 rounded-full bg-cocoa/30" aria-hidden="true" />
								)}
							</span>
						))}
					</span>
					<span className="sm:hidden">{messages[0]}</span>
				</div>
			</div>
		</div>
	);
}
