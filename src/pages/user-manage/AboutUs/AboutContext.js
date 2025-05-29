import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { aboutUsData } from "./aboutUsData";

export const AboutContext = createContext();

export const AboutContextProvider = (props) => {
  const [data, setData] = useState(aboutUsData);

  return (
    <AboutContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </AboutContext.Provider>
  );
};
