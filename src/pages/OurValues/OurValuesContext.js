import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { OurValuesData } from "./ourValuesData";

export const OurValuesContext = createContext();

export const OurValuesContextProvider = (props) => {
  const [data, setData] = useState(OurValuesData);

  return (
    <OurValuesContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </OurValuesContext.Provider>
  );
};
