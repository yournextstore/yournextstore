import { Component_5_2_1 } from "./Component_5_2_1";
import { Component_5_2_2 } from "./Component_5_2_2";
import { Component_5_2_3 } from "./Component_5_2_3";

export function Component_5_2() {
	return (
		<div className="bg-white text-white caret-white -mb-px" data-component-id="Component_5_2">
			<div className="bg-[#1b132d] relative z-0 caret-white">
				<div className="w-full max-w-[1132px] relative z-10 caret-white mx-auto px-[15px]">
					<div className="mr-[-15px] ml-[-15px] flex flex-wrap caret-white">
						<div className="max-w-full flex shrink-0 basis-full caret-white px-[15px]">
							<div className="mr-[-15px] ml-[-15px] flex flex-wrap basis-full caret-white">
								<Component_5_2_1 />
								<Component_5_2_2 />
								<Component_5_2_3 />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
