import { cn } from "@/lib/utils";

function CardSkeleton() {
	return (
		<div className="panel-card overflow-hidden">
			<div className="grid aspect-[16/9] place-items-center border-b border-line bg-page-2">
				<div className="aspect-[4/5] w-[40%] animate-pulse rounded-[6px] bg-face" />
			</div>
			<div className="space-y-3 px-[1.2rem] pt-[1.1rem] pb-[1.3rem]">
				<div className="flex justify-between gap-4">
					<div className="h-6 w-1/2 animate-pulse rounded bg-face" />
					<div className="h-5 w-14 animate-pulse rounded bg-face" />
				</div>
				<div className="h-3 w-2/3 animate-pulse rounded bg-face" />
				<div className="h-12 w-full animate-pulse rounded bg-face" />
				<div className="h-5 w-20 animate-pulse rounded-full bg-face" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 gap-[1.1rem] xs:grid-cols-2 lg:grid-cols-3", className)}>
			{Array.from({ length: count }, (_, i) => (
				<CardSkeleton key={i} />
			))}
		</div>
	);
}
