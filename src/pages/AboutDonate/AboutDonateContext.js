import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { aboutDonateData } from "./aboutDonateData";

export const AboutDonateContext = createContext();

export const AboutDonateContextProvider = (props) => {
  const [data, setData] = useState(aboutDonateData);

  return (
    <AboutDonateContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </AboutDonateContext.Provider>
  );
};
