import { MaterialIcon } from "@/components/icons/material-icon";

export function AnnouncementBar() {
	return (
		<div className="bg-dark-accent text-white text-xs py-2 hidden md:block border-b border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<MaterialIcon name="local_shipping" className="text-secondary text-sm" />
					<span className="font-light">
						Free next day delivery when you <span className="font-bold">spend over $40</span>
					</span>
				</div>
				<div className="flex items-center space-x-6">
					<div className="flex space-x-2">
						<button
							type="button"
							className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-primary transition-colors"
						>
							<span className="text-xs font-medium">FB</span>
						</button>
						<button
							type="button"
							className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-primary transition-colors"
						>
							<span className="text-xs font-medium">TW</span>
						</button>
						<button
							type="button"
							className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-primary transition-colors"
						>
							<span className="text-xs font-medium">IG</span>
						</button>
					</div>
					<div className="flex items-center space-x-1 text-secondary">
						<MaterialIcon name="support_agent" className="text-sm" />
						<span className="font-medium text-white">Need Help? +12345 56535</span>
					</div>
				</div>
			</div>
		</div>
	);
}
