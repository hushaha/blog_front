import { ChangeEvent, FC } from "react";

interface Props {
	maxHeight?: number;
	onInput?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	[key: string]: any;
}

const InputArea: FC<Props> = ({ maxHeight = 200, onInput, ...props }) => {
	const getAreaHeight = (height: number) => {
		const borderHeight = 2;
		return height + borderHeight + "px";
	};

	const resizeAreaHeight = (e: ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = "auto";
		requestAnimationFrame(() => {
			if (e.target.scrollHeight <= maxHeight) {
				e.target.style.height = getAreaHeight(e.target.scrollHeight);
			} else {
				e.target.style.height = getAreaHeight(maxHeight);
			}
		});
	};

	const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onInput && onInput(e);
		resizeAreaHeight(e);
	};

	return (
		<textarea
			rows={1}
			className="q-input w-full resize-none"
			onInput={onChange}
			{...props}
		/>
	);
};

export default InputArea;
