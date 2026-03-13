import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext();
export default function AuthContextProvider(props) {
  const [userLogin, setuserLogin] = useState(() =>
    localStorage.getItem("userToken"),
  );
  const [userId, setuserId] = useState(null)

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      const decodedToken = jwtDecode(localStorage.getItem("userToken"));
      setuserId(decodedToken.user)
    }
  }, [userLogin]);
  return (
    <AuthContext.Provider value={{ userLogin, setuserLogin , userId }}>
      {props.children}
    </AuthContext.Provider>
  );
}
