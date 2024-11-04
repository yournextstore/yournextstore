import { YnsLink } from "./yns-link";

export const Banner = () => {
	return (
		<div className="bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-300 px-4 py-3 text-indigo-900">
			<div className="mx-auto flex max-w-7xl items-center justify-center gap-x-4">
				<p className="text-center text-sm font-medium">
					🎉 Your Next Store adds 3D product previews powered by Spline
				</p>
				<YnsLink
					href="/product/horizon-gaze-sunglasses"
					className="flex-none rounded-full bg-indigo-500 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
				>
					Check it out
				</YnsLink>
			</div>
		</div>
	);
};
