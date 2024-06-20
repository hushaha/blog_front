import React, { useState } from "react";
import ReactDOM from "react-dom";

import Message, { MessageType } from "./message";

interface Notice {
  content: string;
  key: string;
  type: MessageType;
}

interface MessageApi {
  info: (content: string) => void;
  success: (content: string) => void;
  warning: (content: string) => void;
  error: (content: string) => void;
}

let add: (notice: Notice) => void;

const getUuid = (): string => {
  const now = Date.now();
  return `MESSAGE_${now}`;
};

const duration = 3 * 1000;

export const MessageContainer = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  add = (notice: Notice) => {
    setNotices((n) => [...n, notice]);

    setTimeout(() => {
      remove(notice);
    }, duration);
  };

  const remove = (notice: Notice) => {
    const { key } = notice;
    setNotices((n) => n.filter((itm) => itm.key !== key));
  };

  return (
    <div className="fixed left-0 top-16 z-50 flex w-screen flex-col items-center justify-center justify-items-start">
      {notices.map(({ content, key, type }) => (
        <Message key={key} type={type} content={content} duration={duration} />
      ))}
    </div>
  );
};

if (process.browser) {
  let el = document?.querySelector("#message-wrapper");
  if (!el) {
    el = document?.createElement("div");
    el.className = "message-wrapper";
    el.id = "message-wrapper";
    document?.body.append(el);
  }
  ReactDOM.render(<MessageContainer />, el);
}

const api: MessageApi = {
  info: (content) => {
    add({
      content,
      key: getUuid(),
      type: "info",
    });
  },
  success: (content) => {
    add({
      content,
      key: getUuid(),
      type: "success",
    });
  },
  warning: (content) => {
    add({
      content,
      key: getUuid(),
      type: "warning",
    });
  },
  error: (content) => {
    add({
      content,
      key: getUuid(),
      type: "error",
    });
  },
};

export default api;
