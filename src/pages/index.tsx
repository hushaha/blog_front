import { message, SEO } from "@/components";
import { InputArea } from "@/components";

const Index = () => {
  const onClickSend = () => {
    message.info({
      title: "系统通知",
      content: `该功能还在开发中...`,
    });
  };
  return (
    <>
      <SEO title="hush的博客" />
      <h1 className="mt-8 text-center text-xl font-semibold">
        How can we help you?
      </h1>
      <div className="relative mx-auto mt-8 max-w-lg">
        <InputArea
          placeholder="Describe your issue"
          style={{ paddingRight: "3rem" }}
        />
        <button
          className="q-color-primary-hover q-secondary icon-[mingcute--send-line] absolute bottom-4 right-3"
          style={{ width: "2rem", height: "2rem" }}
          onClick={onClickSend}
        />
      </div>
    </>
  );
};

export default Index;
