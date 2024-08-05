import type { ReactNode } from "react";
import { CartAsideDrawer } from "./CartAsideDrawer";

export const CartAsideContainer = ({
	children,
}: {
	children: ReactNode;
	withAnimations: boolean;
}) => {
	return (
		<CartAsideDrawer>
			<div className="flex h-full min-h-[80vh] flex-col">{children}</div>
		</CartAsideDrawer>
	);
	// return (
	// 	<aside className={clsx(withAnimations && "animation-fade-in", "fixed inset-0 z-50")}>
	// 		<Overlay />
	// 		<div
	// 			className={clsx(
	// 				withAnimations && "animation-slide-from-right",
	// 				"absolute bottom-0 right-0 top-0 flex h-full flex-col overflow-hidden bg-white shadow-xl sm:w-1/2 lg:w-1/3",
	// 			)}
	// 		>
	// 			{children}
	// 		</div>
	// 	</aside>
	// );
};
