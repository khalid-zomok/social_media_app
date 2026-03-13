import { createContext, useState } from "react";

export const CounterContext = createContext();
 
export default function CounterContextProvider(props) {
  const [counter, setcounter] = useState(10);
const [userUserData, setuserUserData] = useState({})
  return (
    <CounterContext.Provider value={{ counter, setcounter, userUserData , setuserUserData }}>
      {props.children}
    </CounterContext.Provider>
  );
}
