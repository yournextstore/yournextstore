import { type SVGAttributes } from "react";
import { productReviewBrowse } from "commerce-kit";
import { Avatar, AvatarImage, AvatarFallback } from "@/ui/shadcn/avatar";
import { Separator } from "@/ui/shadcn/separator";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function ReviewList({ productId }: { productId: string }) {
	const reviews = await productReviewBrowse({ productId });

	await sleep(1000);

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
						{reviews.map((review, idx) => (
							<div key={idx + 1}>
								<div className="mb-4 flex gap-4">
									<div className="flex-shrink-0">
										<Avatar className="h-10 w-10 rounded-full border">
											<AvatarImage
												src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${review.author}`}
												alt="@shadcn"
											/>
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
									</div>
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<div className="grid gap-1">
												<h3 className="text-base font-semibold">{review.author}</h3>
												<time className="text-sm text-muted-foreground"></time>
											</div>
											<div className="flex items-center gap-1">
												<StarIcon className="h-5 w-5 fill-primary" />
												<StarIcon className="h-5 w-5 fill-primary" />
												<StarIcon className="h-5 w-5 fill-primary" />
												<StarIcon className="h-5 w-5 fill-muted stroke-muted-foreground" />
												<StarIcon className="h-5 w-5 fill-muted stroke-muted-foreground" />
											</div>
										</div>
										<div className="mt-4 text-sm leading-loose text-muted-foreground">
											<p>{review.content}</p>
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
