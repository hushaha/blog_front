import React, { useEffect, useReducer } from "react";
import ReactDOM from "react-dom";

const DURATION = 3 * 1000;

const messageType = {
	info: {
		class: "icon-[f7--info-circle-fill] q-info",
	},
	success: {
		class: "icon-[f7--checkmark-alt-circle-fill] q-success",
	},
	warning: {
		class: "icon-[f7--exclamationmark-circle-fill] q-warning",
	},
	error: {
		class: "icon-[f7--xmark-circle-fill] q-error",
	},
};

type MessageType = keyof typeof messageType;

interface Message {
	title?: string;
	content?: string;
	key: string;
	type: MessageType;
	show: boolean;
}

interface AddProps {
	title?: Message["title"];
	content?: Message["content"];
	type?: Message["type"];
	duration?: number;
}

type Messages = { [k in MessageType]: (content: string | AddProps) => void };

const getId = (): string => {
	const now = Date.now();
	return `MESSAGE_${now}_${Math.random()}`;
};

const MessageItem = ({ title, content, show, type }: Message) => {
	// 转义处理防止XSS
	const escapedContent = String(content)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");

	const prop = messageType[type];

	return (
		<div
			role="alert"
			className={`q-bg-cpt q-border mt-2 flex gap-4 rounded-md px-8 py-4 sm:min-w-96
        ${show ? "animation-HideToDown" : "animation-HideToUp"}`}
		>
			<div className="flex w-6 items-center">
				<span
					className={prop.class}
					style={{ width: "1.25rem", height: "1.25rem" }}
				/>
			</div>
			<div className="flex-1">
				<p className="block font-medium">{title}</p>
				<p className="q-secondary mt-1 text-sm">{escapedContent}</p>
			</div>
		</div>
	);
};

const MessageItemMemo = React.memo(MessageItem);

const MessageContainer = ({ init }) => {
	const [messageList, dispatchMessageList] = useReducer(
		(
			state: Message[],
			action: { type: "add" | "remove"; payload: Message },
		) => {
			switch (action.type) {
				case "add":
					return [...state, { ...action.payload, show: true }];
				case "remove":
					return state
						.map((msg) =>
							msg.key === action.payload.key ? { ...msg, show: false } : msg,
						)
						.filter((msg) => msg.show);
				default:
					return state;
			}
		},
		[],
	);

	useEffect(() => {
		const timerMap = new Map<string, NodeJS.Timeout>();

		const add = ({ duration = DURATION, type = "info", ...prop }: AddProps) => {
			const message: Message = {
				...prop,
				type,
				key: getId(),
				show: true,
			};
			dispatchMessageList({ type: "add", payload: message });

			if (duration) {
				const timer = setTimeout(() => {
					remove(message);
				}, duration);

				timerMap.set(message.key, timer);
			}
		};

		init({ add });

		return () => {
			timerMap.forEach((timer) => clearTimeout(timer));
			timerMap.clear();
		};
	}, [init]);

	const remove = (message: Message) => {
		dispatchMessageList({ type: "remove", payload: message });
	};

	return (
		<div className="fixed left-1/2 top-16 z-40 flex -translate-x-1/2 flex-col items-center justify-center justify-items-start sm:left-auto sm:right-8 sm:translate-x-0">
			{messageList.map((msg) => (
				<MessageItemMemo key={msg.key} {...msg} />
			))}
		</div>
	);
};

const createMessageContainer = () => {
	let add: (props: AddProps) => void;

	const initAdd = ({ add: addFunc }) => {
		add = addFunc;
	};

	if (typeof window !== "undefined") {
		let el = document?.querySelector("#message-wrapper");
		if (!el) {
			el = document?.createElement("div");
			el.className = "message-wrapper";
			el.id = "message-wrapper";
			document?.body.append(el);
		}
		ReactDOM.render(<MessageContainer init={initAdd} />, el);
	}

	const messages: Messages = Object.keys(messageType).reduce(
		(obj: Messages, type: MessageType) => {
			obj[type] = (content) => {
				if (typeof content === "string") {
					add({
						content,
						type,
					});
				} else {
					add({
						type,
						...content,
					});
				}
			};
			return obj;
		},
		{} as Messages,
	);

	return messages;
};

const messages = createMessageContainer();

export default messages;
