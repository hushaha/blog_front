import { useRef } from "react";

import { message } from "@/components";
import { Dialog } from "@/components";
import { useLogin } from "@/provider";
import { http } from "@/utils";
import { setToken } from "@/utils";

const Login = () => {
  const { isLoggedIn } = useLogin();
  const userRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const onClick = async (type: "login" | "regist") => {
    const data = {
      name: userRef?.current.value,
      password: passRef?.current.value,
    };

    if (!userRef?.current.value || !passRef?.current.value) {
      message.error("请输入账号和密码");
    } else {
      const res =
        type === "login" ? await http.login(data) : await http.register(data);

      if (!res.error) {
        message.success(type === "login" ? "登录成功" : "注册成功");
        setToken(res.data);
        window.location.replace("/");
      }
    }
  };

  return (
    <>
      <Dialog visabled={isLoggedIn} title="登录">
        <div className="flex flex-col items-center justify-center">
          <div className="flex w-96 flex-col">
            <input
              ref={userRef}
              type="text"
              name="user"
              className="input-border-b"
              placeholder="User name"
            />
            <input
              ref={passRef}
              type="password"
              name="password"
              className="input-border-b mt-1"
              placeholder="Password"
            />
          </div>
          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => {
                onClick("login");
              }}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => {
                onClick("regist");
              }}
            >
              注册
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Login;
