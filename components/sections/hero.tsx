"use client";

import Image from "next/image";
import { MaterialIcon } from "@/components/icons/material-icon";
import { AnimatedHeading } from "@/components/ui/animated-heading";
import { YnsLink } from "@/components/yns-link";

export function Hero() {
	return (
		<section className="relative bg-background-dark hero-gradient min-h-[700px] flex items-center overflow-hidden">
			{/* Decorative gradient orbs */}
			<div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 pointer-events-none hidden md:block">
				<div className="w-96 h-96 rounded-full bg-primary/20 blur-[120px]" />
			</div>
			<div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 pointer-events-none hidden md:block">
				<div className="w-80 h-80 rounded-full bg-secondary/10 blur-[100px]" />
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12 lg:py-0">
					{/* Left Column - Content */}
					<div className="col-span-1 lg:col-span-6 xl:col-span-5 xl:col-start-2 space-y-8 pt-10 lg:pt-0">
						<AnimatedHeading
							text="Cannabis Benefits and Medical Marijuanna"
							className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
						/>
						<p className="text-gray-300 text-lg leading-relaxed max-w-lg">
							Working with a global network of wellbeing enthusiasts and health experts to bring you the
							finest CBD. Experience nature&apos;s remedy in its purest form.
						</p>
						<div className="pt-4 flex items-center space-x-4">
							<YnsLink
								prefetch={"eager"}
								href="/"
								className="bg-primary hover:bg-green-600 text-white font-semibold py-4 px-10 rounded-full flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-primary/30 text-lg"
							>
								Start Shopping
								<span className="bg-white text-primary rounded-full w-8 h-8 flex items-center justify-center">
									<MaterialIcon name="arrow_forward" className="text-sm" />
								</span>
							</YnsLink>
						</div>
					</div>

					{/* Right Column - Image */}
					<div className="col-span-1 lg:col-span-6 xl:col-span-5 relative h-full flex items-center justify-center pb-10 lg:pb-0">
						<div className="relative w-full max-w-xl aspect-[4/5] flex items-center justify-center">
							{/* Blurred Background Circle */}
							<div className="absolute inset-0 bg-primary/10 rounded-full filter blur-[100px] transform scale-75" />

							{/* Main Product Image */}
							<div className="relative z-10 w-full h-full flex items-center justify-center">
								<div className="relative w-full h-full">
									<Image
										src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoeha9eVJIB2Xfnu8aUtBoXdgTo-_FHhLc562IrlrlgLf1yfJYUfsxaoTdP7R6Y4Khyg1TvumcYjozhmFPV5be43CZ5wEEeIDANWYNAjonK9xI79eZLgDBBk49MSWB6HTXfRJI-97OstfIxsSuNcijG00AXf54tJ6L0ZHn8KkiUguX5thYpyV485UxL9kqIQsIbR_ReZYEobyItm4LkeZNUM4J-E8bNRMO7ijhc21iNOwkdOPAkWbUSWKg-WiRe2vXXqC_uE_d_uVr"
										alt="Premium Amber Glass CBD Oil Bottle on Natural Surface"
										fill
										sizes="(max-width: 768px) 100vw, 50vw"
										className="object-cover rounded-2xl shadow-2xl"
										priority
									/>

									{/* Quality Badge - Spinning */}
									<div className="absolute -top-10 -left-10 z-30 transform hover:scale-110 transition-transform duration-500">
										<div className="relative group cursor-pointer">
											<div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center p-1 shadow-lg animate-spin-slow">
												<svg className="w-full h-full fill-current text-white" viewBox="0 0 100 100">
													<path
														d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
														fill="transparent"
														id="curve-hero"
													/>
													<text fontSize="11" letterSpacing="1.2">
														<textPath href="#curve-hero" startOffset="0%">
															PREMIUM QUALITY • 100% ORGANIC •
														</textPath>
													</text>
												</svg>
											</div>
											<div className="absolute inset-0 flex items-center justify-center">
												<MaterialIcon name="verified" className="text-primary text-3xl drop-shadow-lg" />
											</div>
										</div>
									</div>

									{/* Discount Card - Floating */}
									<div className="absolute bottom-8 -left-8 md:left-[-40px] bg-secondary/95 backdrop-blur-md rounded-xl p-5 shadow-2xl flex items-center space-x-4 max-w-xs z-40 animate-bounce-slow border border-white/20 transform hover:-translate-y-1 transition-transform">
										<div className="bg-white p-2 rounded-lg h-14 w-12 flex-shrink-0 flex items-center justify-center shadow-inner">
											<Image
												src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3FMrHLYLF2RghrQ-aIQg1nALkfbU-k-Owh6ZQQQ5ghzLWh99gAQcalBRtyE5z5aZkfardyYyFoWGPAjaqzx3MEUjo6wEDYrBH2OBWalGz3pdXTLkuEcYLnw5oEfe2W2DteNhah57L1-M1y6-6022Eeewb-sH459hGPj1GwnmYej0sKaB_RNF_xWCXzWAz25K6-au7Hrc88TVEh1AsiQu4IduoSgrnP8f-jiv44jERkl0z3vxJ9HQFMe9tseXkjhbx0Bx1XJSs56uv"
												alt="Small Bottle Icon"
												width={40}
												height={40}
												className="object-contain"
											/>
										</div>
										<div>
											<h3 className="font-bold text-gray-900 text-lg">Get 10% OFF</h3>
											<p className="text-xs text-gray-800 leading-tight mt-0.5 font-medium">
												First time purchase discount applied automatically.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
