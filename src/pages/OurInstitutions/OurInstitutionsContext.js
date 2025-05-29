import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { ourInstitutionsData } from "./ourInstitutionsData";

export const OurInstitutionsContext = createContext();

export const OurInstitutionsContextProvider = (props) => {
  const [data, setData] = useState(ourInstitutionsData);

 return (
     <OurInstitutionsContext.Provider value={{ contextData: [data, setData] }}>
       <Outlet />
     </OurInstitutionsContext.Provider>
   );
 };
