import { MessageCircle } from "lucide-react";
import { YnsLink } from "@/components/yns-link";

export function FloatingActions() {
	return (
		<>
			<a
				href="mailto:hello@yournextstore.com"
				className="fixed left-3 sm:left-5 bottom-5 z-30 inline-flex items-center gap-2 rounded-full bg-cocoa text-cream pl-3 pr-4 py-2.5 shadow-lg shadow-cocoa/20 ring-2 ring-peach/60 hover:scale-[1.03] hover:shadow-cocoa/30 transition-all"
			>
				<span className="flex h-6 w-6 items-center justify-center rounded-full bg-peach text-cocoa">
					<MessageCircle className="h-3.5 w-3.5" />
				</span>
				<span className="text-sm font-medium">Text us</span>
			</a>
			<YnsLink
				href="/products"
				className="fixed right-3 sm:right-5 bottom-5 z-30 group inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-cream text-cocoa shadow-xl shadow-cocoa/15 ring-1 ring-cocoa/10 hover:rotate-6 transition-all text-center"
			>
				<div className="leading-tight">
					<div className="text-[10px] font-medium uppercase tracking-wider">Get</div>
					<div className="font-serif text-lg sm:text-xl text-terracotta -mt-0.5">10% Off</div>
				</div>
			</YnsLink>
		</>
	);
}
