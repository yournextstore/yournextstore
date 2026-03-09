import { cacheLife } from "next/cache";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce } from "@/lib/commerce";
import { TicketCard } from "./ticket-card";

const tierLabels = ["Student / Early", "Standard", "Professional"];

export async function TicketGrid() {
	"use cache";
	cacheLife("seconds");

	const { data: tickets } = await commerce.productBrowse({ active: true, limit: 3 });

	return (
		<div className="col-span-1 md:col-span-8 flex flex-col">
			{/* Tickets Row */}
			<div
				id="tickets"
				className="grid grid-cols-1 md:grid-cols-3 border-b border-foreground/10 pt-4 overflow-visible"
			>
				{tickets.map((ticket, index) => (
					<TicketCard key={ticket.id} product={ticket} featured={index === 1} tierLabel={tierLabels[index]} />
				))}
			</div>

			{/* Speaker Images with Marquee */}
			<div className="flex-grow grid grid-cols-2 relative h-64 md:h-auto min-h-[300px]">
				{/* Speaker 1 */}
				<div className="relative overflow-hidden group border-r border-foreground/10">
					<Image
						src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop"
						alt="Speaker - Sarah Chen"
						fill
						className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 grayscale-[20%]"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
					<div className="absolute bottom-6 left-6">
						<p className="font-mono text-xs text-primary mb-1">KEYNOTE</p>
						<p className="font-bold text-lg uppercase leading-none">
							Sarah Chen
							<br />
							OpenAI
						</p>
					</div>
				</div>

				{/* Speaker 2 */}
				<div className="relative overflow-hidden group">
					<Image
						src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=600&fit=crop"
						alt="Speaker - Marcus Cole"
						fill
						className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
					/>
					<div className="absolute inset-0 bg-primary mix-blend-color opacity-30" />
					<div className="absolute bottom-6 left-6">
						<p className="font-mono text-xs text-primary mb-1">DESIGN SYSTEMS</p>
						<p className="font-bold text-lg uppercase leading-none">
							Marcus Cole
							<br />
							Figma
						</p>
					</div>
				</div>

				{/* Marquee Banner */}
				<div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 overflow-hidden py-2 bg-primary text-white -rotate-1 z-10 shadow-lg border-y border-white/20">
					<div className="whitespace-nowrap animate-marquee font-mono text-xs font-bold uppercase tracking-widest">
						{
							"Limited Tickets Available /// Early Bird Ends Soon /// New Speakers Announced /// Limited Tickets Available /// Early Bird Ends Soon /// New Speakers Announced /// "
						}
					</div>
				</div>
			</div>
		</div>
	);
}

export function TicketGridSkeleton() {
	return (
		<div className="col-span-1 md:col-span-8 flex flex-col">
			<div className="grid grid-cols-1 md:grid-cols-3 border-b border-foreground/10">
				{[0, 1, 2].map((i) => (
					<div
						key={`ticket-skeleton-${i}`}
						className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-foreground/10"
					>
						<Skeleton className="h-4 w-20 mb-2" />
						<Skeleton className="h-8 w-32 mb-4" />
						<div className="space-y-2 mb-8">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-4 w-20" />
						</div>
						<Skeleton className="h-10 w-24" />
					</div>
				))}
			</div>
			<div className="flex-grow grid grid-cols-2 relative h-64 md:h-auto min-h-[300px]">
				<Skeleton className="h-full border-r border-foreground/10" />
				<Skeleton className="h-full" />
			</div>
		</div>
	);
}
