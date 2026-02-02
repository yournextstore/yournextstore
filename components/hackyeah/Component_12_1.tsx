import { Component_12_1_1 } from "./Component_12_1_1";
import { Component_12_1_2 } from "./Component_12_1_2";

export function Component_12_1() {
	return (
		<div id="offcanvas-menu" className="text-white grow caret-white" data-component-id="Component_12_1">
			<ul id="offcanvas_menu" className="grow basis-[0%] list-none caret-white mt-0 pl-0">
				<li className="text-[12.8px] list-outside caret-white border-t-white border-b-[0.909091px] border-b-[rgba(128,128,128,0.2)] border-x-white">
					<ul className="bg-[#1b132d] hidden caret-white my-0 pl-0"></ul>
				</li>
				<Component_12_1_1 />
				<Component_12_1_2 />
			</ul>
		</div>
	);
}
