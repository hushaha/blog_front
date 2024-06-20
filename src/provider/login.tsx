import { createContext, useContext, useState } from "react";

const LoginContext = createContext(null);

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const openLogin = () => {
    setIsLoggedIn(true);
  };

  const closeLogin = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      <LoginContext.Provider value={{ isLoggedIn, openLogin, closeLogin }}>
        {children}
      </LoginContext.Provider>
    </>
  );
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (context === null) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};

export default LoginProvider;
