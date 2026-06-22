import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
	return (
		<section className="py-24 sm:py-32 relative overflow-hidden">
			{/* Background with animated gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary" />

			{/* Decorative elements */}
			<div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
			<div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />

			{/* Grid pattern overlay */}
			<div
				className="absolute inset-0 opacity-5"
				style={{
					backgroundImage:
						"linear-gradient(rgba(241, 149, 81, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(241, 149, 81, 0.3) 1px, transparent 1px)",
					backgroundSize: "50px 50px",
				}}
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="text-center max-w-3xl mx-auto">
					{/* Badge */}
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium mb-8">
						<Zap className="h-4 w-4" />
						Limited Time Offer
					</div>

					<h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
						Ready to{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
							Elevate
						</span>{" "}
						Your Style?
					</h2>
					<p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
						Join thousands of satisfied customers who have discovered the perfect products for their
						lifestyle. Start shopping today and experience the difference.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							asChild
							size="lg"
							className="rounded-full h-14 px-10 text-lg bg-primary hover:bg-accent transition-all duration-300 shadow-lg shadow-primary/25"
						>
							<Link href="#products" className="flex items-center gap-2">
								Start Shopping
								<ArrowRight className="h-5 w-5" />
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							size="lg"
							className="rounded-full h-14 px-10 text-lg border-2 border-border hover:border-primary hover:text-primary transition-all duration-300"
						>
							<Link href="/contact">Contact Us</Link>
						</Button>
					</div>

					{/* Stats */}
					<div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8">
						<div className="p-6 rounded-xl bg-card/50 border border-border">
							<div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
								10K+
							</div>
							<div className="text-sm text-muted-foreground mt-2 font-medium">Happy Customers</div>
						</div>
						<div className="p-6 rounded-xl bg-card/50 border border-border">
							<div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70">
								500+
							</div>
							<div className="text-sm text-muted-foreground mt-2 font-medium">Products</div>
						</div>
						<div className="p-6 rounded-xl bg-card/50 border border-border">
							<div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
								99%
							</div>
							<div className="text-sm text-muted-foreground mt-2 font-medium">Satisfaction</div>
						</div>
						<div className="p-6 rounded-xl bg-card/50 border border-border">
							<div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70">
								24/7
							</div>
							<div className="text-sm text-muted-foreground mt-2 font-medium">Support</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
