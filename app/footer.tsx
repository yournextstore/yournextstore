import { cacheLife } from "next/cache";
import { Heart, Star, Sparkles } from "lucide-react";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-sm font-bold text-foreground flex items-center gap-2">
				<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
				Categories
			</h3>
			<ul className="mt-4 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="border-t-2 border-primary/10 bg-gradient-to-b from-background to-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 flex flex-col sm:flex-row gap-8 sm:gap-16">
					{/* Brand */}
					<div className="sm:max-w-xs">
						<YnsLink prefetch={"eager"} href="/" className="flex items-center gap-2 group">
							<span className="text-3xl">🎈</span>
							<span className="text-xl font-black gradient-text">Kids Wonder</span>
						</YnsLink>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed">
							Amazing stuff for amazing kids! We bring joy and wonder to every little adventure.
						</p>
						<div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
							<span>Made with</span>
							<Heart className="h-4 w-4 text-pink-500 fill-pink-500 animate-pulse" />
							<span>for kids everywhere</span>
						</div>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Fun section */}
					<div>
						<h3 className="text-sm font-bold text-foreground flex items-center gap-2">
							<Sparkles className="h-4 w-4 text-primary" />
							Fun Stuff
						</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<span className="text-sm text-muted-foreground">🎁 Free Shipping on Orders $50+</span>
							</li>
							<li>
								<span className="text-sm text-muted-foreground">🔄 Easy Returns</span>
							</li>
							<li>
								<span className="text-sm text-muted-foreground">💬 24/7 Support</span>
							</li>
							<li>
								<span className="text-sm text-muted-foreground">⭐ 100% Satisfaction</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-primary/10">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<p className="text-sm text-muted-foreground">
							&copy; {new Date().getFullYear()} Kids Wonder Shop. All rights reserved.
						</p>
						<div className="flex items-center gap-2 text-2xl">
							<span className="animate-bounce-slow">🧸</span>
							<span className="animate-bounce-slow animation-delay-100">🎮</span>
							<span className="animate-bounce-slow animation-delay-200">🎨</span>
							<span className="animate-bounce-slow animation-delay-300">📚</span>
							<span className="animate-bounce-slow animation-delay-400">🚀</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
