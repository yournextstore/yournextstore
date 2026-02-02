import { Component_5_1_1 } from "./Component_5_1_1";
import { Component_5_1_2 } from "./Component_5_1_2";
import { Component_5_1_3 } from "./Component_5_1_3";

export function Component_5_1() {
	return (
		<div
			id="contact"
			className="bg-[#e6007e] relative caret-[#dbdbdb] py-10"
			data-component-id="Component_5_1"
		>
			<div className="w-full max-w-[1132px] relative z-[1] caret-[#dbdbdb] mx-auto px-[15px]">
				<div className="max-w-full flex flex-wrap shrink-0 basis-full caret-[#dbdbdb] px-[15px]">
					<Component_5_1_1 />
					<Component_5_1_2 />
					<Component_5_1_3 />
				</div>
			</div>
		</div>
	);
}
