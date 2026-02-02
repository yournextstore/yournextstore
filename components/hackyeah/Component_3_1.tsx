import { Component_3_1_1 } from "./Component_3_1_1";
import { Component_3_1_2 } from "./Component_3_1_2";
import { Component_3_1_3 } from "./Component_3_1_3";

export function Component_3_1() {
	return (
		<div className="max-w-[1132px] caret-[#dbdbdb] m-auto px-[0%]" data-component-id="Component_3_1">
			<div className="mr-[-15px] ml-[-15px] flex flex-wrap items-center caret-[#dbdbdb]">
				<div className="max-w-[30%] flex shrink-0 items-center caret-[#dbdbdb] px-[15px]">
					<a
						href="https://hackyeah.pl/"
						className="text-[#f19551] underline block caret-[#f19551] hover:text-[#2ebcfc]"
					>
						<img
							width="115"
							height="71"
							src="https://hackyeah.pl/wp-content/uploads/2023/02/hy-logo-new.png"
							alt="HackYeah 2025 – the biggest on-site hackathon in Europe"
							className="align-middle max-w-full max-h-[70px] aspect-[auto_115_/_71] basis-0 caret-[#f19551]"
						/>
					</a>
				</div>
				<div className="max-w-full flex grow shrink-0 basis-0 justify-end items-center caret-[#dbdbdb] px-[15px]">
					<div id="mainmenu_container" className="mr-[-15px] ml-[-15px] flex flex-wrap caret-[#dbdbdb]">
						<ul
							id="main_menu"
							className="w-full z-[1] flex flex-wrap grow shrink-0 justify-end list-none caret-[#dbdbdb] my-0 pl-0 left-0 right-auto inset-y-auto"
						>
							<Component_3_1_1 />
							<Component_3_1_2 />
							<Component_3_1_3 />
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
