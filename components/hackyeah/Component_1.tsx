import { Component_1_1 } from "./Component_1_1";

export function Component_1() {
	return (
		<div
			tabIndex={0}
			aria-label="We value your privacy"
			role="region"
			className="w-[440px] fixed hidden caret-[#dbdbdb] rounded-br-[6px] rounded-t-[6px] rounded-bl-[6px] left-auto right-10 top-auto bottom-10"
			data-component-id="Component_1"
		>
			<div className="bg-white shadow-[rgba(172,171,171,0.3)_0px_-1px_10px_0px] caret-[#dbdbdb] px-[26px] py-5 rounded-br-[6px] rounded-t-[6px] rounded-bl-[6px] border-[0.909091px] border-[#f4f4f4]">
				<div className="caret-[#dbdbdb]">
					<p role="heading" className="text-[#212121] font-bold text-[18px] caret-[#212121] mt-0 mb-3">
						Our website uses cookies.
					</p>
					<Component_1_1 />
				</div>
			</div>
		</div>
	);
}
