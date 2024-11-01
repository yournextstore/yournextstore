"use client";
import { type FC, type JSX, useEffect, useRef, useState } from "react";
import { SearchIcon } from "lucide-react";
import { SeoH1 } from "@/ui/seo-h1";
import { YnsLink } from "@/ui/yns-link";
import { AlignJustifyDropdown } from "@/ui/nav/aling-justify-dropdown";
export const MobileSearchNav: FC<{
	children: JSX.Element[];
	links: {
		label: string;
		href: string;
	}[];
}> = ({ children, links }) => {
	const [isPress, setIsPress] = useState(true);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const handleClickOutside = (event: MouseEvent) => {
		if (
			containerRef.current &&
			event.target instanceof Node &&
			!containerRef.current.contains(event.target)
		) {
			setIsPress(true); // Close the search when clicking outside
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="ml-auto flex-initial px-4" ref={containerRef}>
			{isPress ? (
				<div className="flex">
					<div className="flex-none">
						<YnsLink href="/">
							<SeoH1 className="-mt-0.5 whitespace-nowrap text-xl font-bold">
								Your Next Stores
							</SeoH1>
						</YnsLink>
					</div>
					<div className="ml-auto mr-2.5 h-6 w-6 flex-initial">
						<SearchIcon onClick={() => setIsPress(false)} />
					</div>
					<div className="flex-initial">{children[1]}</div>
					<div className="mr-2.5 h-6 w-6 flex-initial">
						<AlignJustifyDropdown links={links} />
					</div>
				</div>
			) : (
				<div className="children-wrapper">
					<div className="children-content">{children[0]}</div>
				</div>
			)}
		</div>
	);
};
// return (<div className="lg:invisible">
//     <div className="flex">
//         <div className="flex-none">
//             <YnsLink href="/">
//                 <SeoH1 className="-mt-0.5 whitespace-nowrap text-xl font-bold">Your Next Stores</SeoH1>
//             </YnsLink>
//         </div>

//         <div className="flex-initial">
//             <CartSummaryNav />
//         </div>
//         <div className="flex-initial">
//             <AlignJustify />
//         </div>
//     </div>
// </div>)
