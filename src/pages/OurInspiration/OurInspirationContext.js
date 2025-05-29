import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { ourInspirationData } from "./ourInspirationData";

export const OurInspirationContext = createContext();

export const OurInspirationContextProvider = (props) => {
  const [data, setData] = useState(ourInspirationData);

  return (
    <OurInspirationContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </OurInspirationContext.Provider>
  );
};
