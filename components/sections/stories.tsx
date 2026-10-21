import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import story1 from "@/public/images/story-1.jpg";
import story2 from "@/public/images/story-2.jpg";
import story3 from "@/public/images/story-3.jpg";

const stories = [
	{
		title: "Caps and bags for every fit",
		excerpt: "Washed six-panels, wool beanies and canvas totes: the small things that finish a workwear fit.",
		image: story1,
		href: "/products",
	},
	{
		title: "Fresh on the rail",
		excerpt: "The latest jackets, sweats and trousers we have picked, washed and photographed.",
		image: story2,
		href: "/products?sort=newest",
	},
	{
		title: "How we pick",
		excerpt: "What we look for in a used jacket, and why a good fade beats a new one.",
		image: story3,
		href: "/about",
	},
];

/** "Stay up to date": the original's black journal band; captions slide in over the photo on hover. */
export function Stories({ blogEnabled }: { blogEnabled: boolean }) {
	return (
		<section className="page-x w-full bg-ink py-4 text-ink-foreground lg:py-8">
			<div className="mb-12 flex items-center justify-between">
				<h2 className="text-heading font-medium uppercase md:text-title">Stay up to date</h2>
				{blogEnabled && (
					<Link href="/blog" className="text-label uppercase underline-offset-4 hover:underline">
						Read the blog
					</Link>
				)}
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3">
				{stories.map((story, index) => (
					<Link
						key={story.title}
						href={story.href}
						className={cn(
							"group relative block rounded-sm border border-ink-line p-1",
							index > 0 && "hidden lg:block",
						)}
					>
						<div className="relative aspect-[467/472] overflow-hidden rounded-xs">
							<Image
								src={story.image}
								alt=""
								fill
								sizes="(min-width: 1024px) 33vw, 100vw"
								className="object-cover"
							/>
						</div>
						<div className="absolute bottom-1 left-1 w-[calc(100%-8px)] rounded-b-xs bg-ink p-4 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
							<h3 className="text-label-lg font-medium">{story.title}</h3>
							<p className="line-clamp-2 text-label font-light">{story.excerpt}</p>
							<span className="mt-[26px] flex items-center gap-4 text-label uppercase">
								Read more
								<ArrowRightIcon aria-hidden className="h-5 w-5" strokeWidth={1.5} />
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
