import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { ourModelData } from "./ourModelData";

export const OurModelContext = createContext();

export const OurModelContextProvider = (props) => {
  const [data, setData] = useState(ourModelData);

 return (
     <OurModelContext.Provider value={{ contextData: [data, setData] }}>
       <Outlet />
     </OurModelContext.Provider>
   );
 };
