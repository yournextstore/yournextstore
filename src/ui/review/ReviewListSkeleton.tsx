import { type SVGAttributes } from "react";
import { Separator } from "@/ui/shadcn/separator";
import { Skeleton } from "@/ui/shadcn/skeleton";

export async function ReviewListSkeleton({ size = 3 }: { size?: number }) {
	return (
		<section className="bg-background py-12 md:py-16">
			<div className="mx-auto">
				<div className="mb-8 md:mb-12">
					<h2 className="text-2xl font-bold tracking-tight md:text-3xl">Product Reviews</h2>
				</div>
				<div className="grid gap-16 md:grid-cols-12">
					<div className="md:col-span-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<StarIcon className="h-6 w-6 fill-primary" />
								<span className="text-2xl font-bold">4.75</span>
								<span className="text-muted-foreground">(4 reviews)</span>
							</div>
						</div>
					</div>
					<div className="grid gap-8 md:col-span-8">
						{[...Array(size)].map((review, idx) => (
							<div key={idx + 1}>
								<div className="mb-4 flex gap-4">
									<div className="flex-shrink-0">
										<Skeleton className="h-10 w-10 rounded-full" />
									</div>
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<div className="grid gap-1">
												<Skeleton className="h-6 w-[250px]" />
											</div>
											<div className="flex items-center gap-1">
												<Skeleton className="h-6 w-[150px]" />
											</div>
										</div>
										<div className="mt-4 text-sm leading-loose text-muted-foreground">
											<Skeleton className="mb-2 h-4 w-full" />
											<Skeleton className="mb-2 h-4 w-full" />
											<Skeleton className="h-4 w-2/3" />
										</div>
									</div>
								</div>
								<Separator />
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function StarIcon(props: SVGAttributes<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
		</svg>
	);
}
