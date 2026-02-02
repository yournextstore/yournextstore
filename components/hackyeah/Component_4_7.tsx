import { Component_4_7_1 } from "./Component_4_7_1";
import { Component_4_7_2 } from "./Component_4_7_2";
import { Component_4_7_3 } from "./Component_4_7_3";

export function Component_4_7() {
	return (
		<div id="news" className="relative caret-[#dbdbdb] pt-[110px]" data-component-id="Component_4_7">
			<div className="text-[#1b132d] leading-none font-extrabold text-[87px] text-center absolute z-0 overflow-x-clip overflow-y-clip opacity-0 caret-[#1b132d] mx-auto top-[121px] bottom-auto inset-x-0">
				NEWS
			</div>
			<div className="w-full max-w-[1132px] caret-[#dbdbdb] mx-auto px-[15px]">
				<div className="relative z-[9] caret-[#dbdbdb]">
					<div className="mr-[-15px] ml-[-15px] text-center flex flex-wrap items-center caret-[#dbdbdb]">
						<div className="w-full flex basis-full justify-center items-center caret-[#dbdbdb] px-[15px]">
							<h2 className="text-white leading-[48px] font-extrabold text-[59px] relative overflow-x-hidden overflow-y-hidden caret-white my-0 p-[30px]">
								NEWS
							</h2>
						</div>
					</div>
					<div className="mr-[-15px] ml-[-15px] flex flex-wrap caret-[#dbdbdb]">
						<div className="basis-full caret-[#dbdbdb] px-[15px]">
							<div className="mr-[-15px] ml-[-15px] flex flex-wrap justify-center caret-[#dbdbdb]">
								<Component_4_7_1 />
								<Component_4_7_2 />
								<Component_4_7_3 />
							</div>
						</div>
					</div>
					<div className="mr-[-15px] ml-[-15px] text-center flex flex-wrap caret-[#dbdbdb]">
						<a
							href="https://hackyeah.pl/blog/"
							className="text-[#f19551] underline block basis-full caret-[#f19551] px-[15px] hover:text-[#2ebcfc]"
						>
							<img
								src="https://hackyeah.pl/wp-content/uploads/2023/03/more-btn-new.png"
								alt="View More News"
								className="max-w-full basis-0 caret-[#f19551]"
							/>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
